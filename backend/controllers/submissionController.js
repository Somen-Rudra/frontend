import axios from "axios";
import Problem from "../models/problemModel.js";
import Submission, { VERDICT, ALLOWED_LANGUAGES } from "../models/submissionModel.js";

/* =========================
   Config
========================= */

const JUDGE_URL = process.env.JUDGE_URL || "http://localhost:3000";
const JUDGE_TIMEOUT_MS = parseInt(process.env.JUDGE_TIMEOUT_MS || "60000", 10);

// Map your problem model's language keys → judge server's language keys
const LANGUAGE_MAP = {
  js:     "javascript",
  py:     "python",
  c:      "c",
  cpp:    "cpp",
  java:   "java",
  kotlin: "kotlin",
  swift:  "swift",
};

/* =========================
   Helpers
========================= */

/**
 * Stitch user code into a runnable file.
 *
 * Template layout (all fields optional except inputOutput + codeStub):
 *
 *   [header]          ← imports, boilerplate the user shouldn't see
 *   [user code]       ← exactly what the editor contains (codeStub default)
 *   [driver / inputOutput] ← reads stdin, calls the user's function, prints output
 *
 * The driver is stored in the `driver` field. For problems where there is
 * no driver (the user writes the full program), `driver` is an empty string
 * and `inputOutput` holds the full expected scaffold instead.
 */
function stitchCode(langTemplate, userCode) {
  const { header = "", driver = "" } = langTemplate;

  // header  → always prepended (even if empty string — safe)
  // userCode→ what the user typed
  // driver  → wraps execution; may be empty for "write a full program" problems
  const parts = [header, userCode, driver].filter((p) => p && p.trim() !== "");
  return parts.join("\n\n");
}

/**
 * Call the judge /run-tests endpoint.
 *
 * Returns the raw judge response body.
 */
async function callJudge(language, stitchedCode, testCases) {
  const judgeLanguage = LANGUAGE_MAP[language];
  if (!judgeLanguage) throw new Error(`No judge mapping for language: ${language}`);

  const { data } = await axios.post(
    `${JUDGE_URL}/run-tests`,
    {
      language: judgeLanguage,
      code:     stitchedCode,
      testCases,          // [{ input, output }]
    },
    { timeout: JUDGE_TIMEOUT_MS },
  );

  return data;
}

/**
 * Derive an overall verdict from the per-test-case results.
 * Priority: compile_error > time_limit_exceeded > runtime_error >
 *           output_limit_exceeded > wrong_answer > accepted
 */
function deriveVerdict(results) {
  const priority = [
    VERDICT.COMPILE_ERROR,
    VERDICT.TIME_LIMIT_EXCEEDED,
    VERDICT.RUNTIME_ERROR,
    VERDICT.OUTPUT_LIMIT_EXCEEDED,
    VERDICT.WRONG_ANSWER,
  ];

  for (const v of priority) {
    if (results.some((r) => r.status === v)) return v;
  }
  return VERDICT.ACCEPTED;
}

/**
 * Build firstFailure summary from results array (null if all passed).
 */
function buildFirstFailure(results, includeExpected = false) {
  const failing = results.find((r) => !r.passed);
  if (!failing) return null;

  const obj = {
    index:        failing.index,
    status:       failing.status,
    actualOutput: failing.actualOutput,
    stderr:       failing.stderr,
    elapsed:      failing.elapsed,
  };

  if (includeExpected) obj.expectedOutput = failing.expectedOutput;

  return obj;
}

/* =========================
   POST /:slug/run
   Runs against VISIBLE test cases only.
   Not persisted as an official submission.
========================= */

export const runCode = async (req, res) => {
  try {
    const { slug }             = req.params;
    const { language, code }   = req.body;

    /* ── Basic validation ─────────────────────────────────────────────── */
    if (!language || !ALLOWED_LANGUAGES.includes(language)) {
      return res.status(400).json({ success: false, message: "Unsupported language" });
    }
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, message: "Code must be non-empty" });
    }
    if (code.length > 65536) {
      return res.status(400).json({ success: false, message: "Code exceeds 64 KB limit" });
    }

    /* ── Fetch problem (visible test cases only) ──────────────────────── */
    const problem = await Problem.findOne({ slug, isPublished: true })
      .select("languages visibleTestCases timeLimit memoryLimit _id problemNumber")
      .lean();

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const langTemplate = problem.languages?.[language];
    if (!langTemplate) {
      return res.status(400).json({
        success: false,
        message: `Language "${language}" is not available for this problem`,
      });
    }

    if (!problem.visibleTestCases?.length) {
      return res.status(422).json({ success: false, message: "No visible test cases configured" });
    }

    /* ── Stitch & judge ───────────────────────────────────────────────── */
    const stitchedCode = stitchCode(langTemplate, code);

    const judgeResponse = await callJudge(language, stitchedCode, problem.visibleTestCases);

    /* ── Build a lightweight result (no DB write for "run") ───────────── */
    const results  = judgeResponse.results || [];
    const verdict  = deriveVerdict(results);
    const firstFail = buildFirstFailure(results, true); // expose expected in run-mode

    /* ── Optionally persist a non-official run record ─────────────────── */
    // Comment this block out entirely if you don't want run-mode saved to DB.
    if (req.user) {
      await Submission.create({
        user:            req.user._id,
        problem:         problem._id,
        problemSlug:     slug,
        problemNumber:   problem.problemNumber,
        language,
        code,
        verdict,
        passedCount:     judgeResponse.passed  ?? 0,
        totalCount:      judgeResponse.total   ?? results.length,
        totalElapsed:    judgeResponse.totalElapsed ?? 0,
        testCaseResults: results,
        firstFailure:    firstFail,
        mode:            "run",
        isOfficial:      false,
      });
    }

    return res.status(200).json({
      success: true,
      mode:    "run",
      verdict,
      passed:       judgeResponse.passed  ?? 0,
      failed:       judgeResponse.failed  ?? 0,
      total:        judgeResponse.total   ?? results.length,
      totalElapsed: judgeResponse.totalElapsed ?? 0,
      firstFailure: firstFail,
      results: results.map((r) => ({
        index:          r.index,
        passed:         r.passed,
        status:         r.status,
        stdin:          r.stdin,
        expectedOutput: r.expectedOutput,
        actualOutput:   r.actualOutput,
        stderr:         r.stderr,
        elapsed:        r.elapsed,
        timedOut:       r.timedOut,
        outputExceeded: r.outputExceeded,
      })),
    });
  } catch (err) {
    console.error("[runCode]", err.message);

    if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
      return res.status(503).json({ success: false, message: "Judge service unavailable" });
    }
    if (err.response) {
      // axios received an error response from the judge
      return res.status(502).json({
        success: false,
        message: "Judge returned an error",
        detail:  err.response.data,
      });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* =========================
   POST /:slug/submit
   Runs against HIDDEN test cases.
   Persisted as an official submission and updates acceptance stats.
========================= */

export const submitCode = async (req, res) => {
  try {
    const { slug }           = req.params;
    const { language, code } = req.body;

    /* ── Auth guard ───────────────────────────────────────────────────── */
    // Uncomment when you add authentication middleware:
    // if (!req.user) return res.status(401).json({ success: false, message: "Unauthorised" });

    /* ── Basic validation ─────────────────────────────────────────────── */
    if (!language || !ALLOWED_LANGUAGES.includes(language)) {
      return res.status(400).json({ success: false, message: "Unsupported language" });
    }
    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({ success: false, message: "Code must be non-empty" });
    }
    if (code.length > 65536) {
      return res.status(400).json({ success: false, message: "Code exceeds 64 KB limit" });
    }

    /* ── Fetch problem WITH hidden test cases ─────────────────────────── */
    const problem = await Problem.findForJudge(
      (await Problem.findOne({ slug, isPublished: true }).select("_id").lean())?._id,
    ).select("languages visibleTestCases hiddenTestCases timeLimit memoryLimit _id problemNumber slug acceptanceRate")
     .lean();

    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    const langTemplate = problem.languages?.[language];
    if (!langTemplate) {
      return res.status(400).json({
        success: false,
        message: `Language "${language}" is not available for this problem`,
      });
    }

    const testCases = problem.hiddenTestCases;
    if (!testCases?.length) {
      return res.status(422).json({ success: false, message: "No hidden test cases configured" });
    }

    /* ── Stitch & judge ───────────────────────────────────────────────── */
    const stitchedCode = stitchCode(langTemplate, code);

    const judgeResponse = await callJudge(language, stitchedCode, testCases);

    /* ── Derive result ────────────────────────────────────────────────── */
    const results     = judgeResponse.results || [];
    const verdict     = deriveVerdict(results);
    const firstFail   = buildFirstFailure(results, false); // hide expected in submit-mode
    const passedCount = judgeResponse.passed ?? 0;
    const totalCount  = judgeResponse.total  ?? results.length;

    /* ── Persist submission ───────────────────────────────────────────── */
    const submission = await Submission.create({
      user:            req.user?._id ?? new (await import("mongoose")).default.Types.ObjectId(), // remove fallback once auth is wired
      problem:         problem._id,
      problemSlug:     slug,
      problemNumber:   problem.problemNumber,
      language,
      code,
      verdict,
      passedCount,
      totalCount,
      totalElapsed:    judgeResponse.totalElapsed ?? 0,
      testCaseResults: results,
      firstFailure:    firstFail,
      mode:            "submit",
      isOfficial:      true,
    });

    /* ── Update problem acceptance stats (fire-and-forget) ────────────── */
    Problem.findByIdAndUpdate(problem._id, {
      $inc: {
        "acceptanceRate.totalSubs":    1,
        "acceptanceRate.acceptedSubs": verdict === VERDICT.ACCEPTED ? 1 : 0,
      },
    }).exec().catch((e) => console.error("[submitCode] acceptance update failed", e));

    /* ── Response ─────────────────────────────────────────────────────── */
    return res.status(200).json({
      success: true,
      mode:    "submit",
      submissionId: submission._id,
      verdict,
      passed:       passedCount,
      failed:       totalCount - passedCount,
      total:        totalCount,
      totalElapsed: judgeResponse.totalElapsed ?? 0,
      firstFailure: firstFail,   // null when accepted
      // We intentionally omit per-test-case details on submit
      // (user can query GET /submissions/:id for the breakdown)
    });
  } catch (err) {
    console.error("[submitCode]", err.message);

    if (err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
      return res.status(503).json({ success: false, message: "Judge service unavailable" });
    }
    if (err.response) {
      return res.status(502).json({
        success: false,
        message: "Judge returned an error",
        detail:  err.response.data,
      });
    }

    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* =========================
   GET /submissions/:submissionId
   Fetch a single submission with full test-case breakdown.
========================= */

export const getSubmissionById = async (req, res) => {
  try {
    const { submissionId } = req.params;

    const submission = await Submission.findById(submissionId)
      .select("+testCaseResults")
      .populate("problem", "title slug problemNumber difficulty")
      .lean();

    if (!submission) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    // Ownership check — uncomment when auth is wired:
    // if (String(submission.user) !== String(req.user._id)) {
    //   return res.status(403).json({ success: false, message: "Forbidden" });
    // }

    return res.status(200).json({ success: true, data: submission });
  } catch (err) {
    console.error("[getSubmissionById]", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

/* =========================
   GET /problemSet/:slug/submissions
   All submissions for a problem (current user).
========================= */

export const getSubmissionsForProblem = async (req, res) => {
  try {
    const { slug } = req.params;
    const page     = Math.max(parseInt(req.query.page  || "1",  10), 1);
    const limit    = Math.min(parseInt(req.query.limit || "20", 10), 100);

    const filter = {
      problemSlug: slug,
      isOfficial:  true,
      // user: req.user._id,   ← uncomment when auth is wired
    };

    const [submissions, total] = await Promise.all([
      Submission.find(filter)
        .select("-testCaseResults -firstFailure.expectedOutput")
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Submission.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: submissions,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        total,
        limit,
      },
    });
  } catch (err) {
    console.error("[getSubmissionsForProblem]", err.message);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

 
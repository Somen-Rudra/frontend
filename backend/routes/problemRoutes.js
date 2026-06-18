// ─────────────────────────────────────────────────────────────────────────────
// src/routes/problemRouter.js  (updated — execution routes now import from
// submissionController, and two new submission-list routes are added)
// ─────────────────────────────────────────────────────────────────────────────
import express from "express";

import {
  getProblems,
  getProblemBySlug,
  getProblemByNumber,
  createProblem,
  updateProblem,
  deleteProblem,
  getProblemMetadata,
  getFeaturedProblems,
  getRandomProblem,
  getProblemStats,
  togglePublishProblem,getProblemEditorData
} from "../controllers/problemController.js";

import {
  runCode,
  submitCode,
  getSubmissionsForProblem, 
} from "../controllers/submissionController.js";

const problemRouter = express.Router();

/* =========================
   Public Routes
   ⚠️  Static paths MUST stay above /:slug
========================= */
problemRouter.get("/",               getProblems);
problemRouter.get("/metadata",       getProblemMetadata);
problemRouter.get("/featured",       getFeaturedProblems);
problemRouter.get("/random",         getRandomProblem);
problemRouter.get("/stats/overview", getProblemStats);
problemRouter.get("/number/:number", getProblemByNumber);
problemRouter.get("/:slug/editor", getProblemEditorData);
problemRouter.get("/:slug",          getProblemBySlug);

/* =========================
   Execution Routes
========================= */
problemRouter.post("/:slug/run",         runCode);
problemRouter.post("/:slug/submit",      submitCode);
problemRouter.get( "/:slug/submissions", getSubmissionsForProblem);

/* =========================
   Admin Routes
========================= */
problemRouter.post("/",               createProblem);
problemRouter.patch("/:slug/publish", togglePublishProblem);
problemRouter.patch("/:slug",         updateProblem);
problemRouter.delete("/:slug",        deleteProblem);

export default problemRouter;


// ─────────────────────────────────────────────────────────────────────────────
// src/routes/submissionRouter.js  (standalone router mounted at /submissions)
// ─────────────────────────────────────────────────────────────────────────────
// import express from "express";
// import { getSubmissionById } from "../controllers/submissionController.js";
//
// const submissionRouter = express.Router();
// submissionRouter.get("/:submissionId", getSubmissionById);
// export default submissionRouter;
//
// Then in app.js:
//   import submissionRouter from "./routes/submissionRouter.js";
//   app.use("/api/submissions", submissionRouter);
import { useState } from "react";
import "../styles/ai-page.css";

const DEFAULT_CODE = `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        rem = target - num
        if rem in seen:
            return [seen[rem], i]
        seen[num] = i`;

const RELATED_PROBLEMS = [
  { name: "Two Sum", difficulty: "Easy" },
  { name: "3Sum", difficulty: "Medium" },
  { name: "4Sum", difficulty: "Medium" },
  { name: "Two Sum II - Input Array Is Sorted", difficulty: "Easy" },
  { name: "Two Sum IV - Input is a BST", difficulty: "Medium" },
];

const MORE_ACTIONS = [
  "Generate Test Cases",
  "Optimize Code",
  "Convert to Another Language",
  "Find Similar Problems",
];

const FOLLOWUPS = [
  { key: "complexity", label: "Explain Complexity" },
  { key: "approach", label: "Approach Explainer" },
  { key: "bugs", label: "Bug Finder" },
  { key: "hints", label: "Hint Generation" },
  { key: "optimize", label: "Code Optimization" },
  { key: "walkthrough", label: "Show Example Walkthrough" },
];

const SAMPLE_RESULTS = {
  overview:
    "This solves the Two Sum problem. It returns the indices of two numbers that add up to the target.",
  steps: [
    "We create a dictionary seen to store numbers and their indices.",
    "We iterate through the list using enumerate to get both index and value.",
    "For each number, we calculate the remainder (target - num).",
    "If the remainder exists in the dictionary, we found our pair.",
    "Otherwise, we add the current number and its index to the dictionary.",
  ],
  complexity: { time: "O(n)", space: "O(n)" },
  approach: [
    "Identify what value would complete the pair for the current element.",
    "Use a hash map for O(1) average lookups instead of nested loops.",
    "Trade extra space for a single linear pass over the array.",
  ],
  bugs: [
    {
      line: "Line 6",
      message:
        "No bug detected, but if duplicate target sums are possible, only the first match is returned.",
    },
  ],
  hints: [
    "Think about what information you need to remember as you scan the array.",
    "A hash map can turn an O(n^2) search into an O(1) lookup.",
    "For each element, check if its complement has already been seen.",
  ],
  optimized: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        rem = target - num
        if rem in seen:
            return [seen[rem], i]
        seen[num] = i
    return []`,
};

function CopyIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function ActionIcon({ name }) {
  const icons = {
    "Generate Test Cases": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    "Optimize Code": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
    "Convert to Another Language": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 5h7M9 3v2c0 4.5-2 8-6 11M12 21l4-8 4 8M13.5 17h5" />
      </svg>
    ),
    "Find Similar Problems": (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
    ),
  };
  return icons[name] || null;
}

export default function AICodeExplanation() {
  const [code, setCode] = useState(DEFAULT_CODE);
  const [language, setLanguage] = useState("Python");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(SAMPLE_RESULTS);
  const [activeFollowup, setActiveFollowup] = useState(null);

  const handleExplain = () => {
    setLoading(true);
    setActiveFollowup(null);
    setTimeout(() => {
      setResult(SAMPLE_RESULTS);
      setLoading(false);
    }, 900);
  };

  const handleClear = () => {
    setCode("");
    setResult(null);
    setActiveFollowup(null);
  };

  const handleCopy = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(code);
    }
  };

  const handleFollowup = (key) => {
    setActiveFollowup(key);
  };

  return (
    <div className="ai-explain-page">
      <div className="ai-explain-breadcrumb">
        AI Features <span className="crumb-active">/ AI Code Explanation</span>
      </div>

      <div className="ai-explain-header">
        <h1>AI Code Explanation</h1>
        <p>Get detailed explanations of any code snippet</p>
      </div>

      <div className="ai-explain-grid">
        {/* Left: Code input panel */}
        <div className="panel code-panel">
          <div className="panel-title">Your Code</div>
          <div className="panel-toolbar">
            <select
              className="language-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option>Python</option>
              <option>JavaScript</option>
              <option>Java</option>
              <option>C++</option>
              <option>C</option>
              <option>Go</option>
            </select>
            <button
              className="copy-icon-btn"
              onClick={handleCopy}
              aria-label="Copy code"
            >
              <CopyIcon />
            </button>
          </div>

          <textarea
            className="code-textarea"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Paste your code here..."
            spellCheck="false"
          />

          <div className="code-panel-actions">
            <button className="btn btn-secondary" onClick={handleClear}>
              Clear
            </button>
            <button
              className="btn btn-primary"
              onClick={handleExplain}
              disabled={!code.trim() || loading}
            >
              {loading ? "Explaining..." : "Explain Code"}
            </button>
          </div>
        </div>

        {/* Middle: Explanation panel */}
        <div className="panel explanation-panel">
          <div className="panel-title">AI Explanation</div>

          {loading && (
            <div className="loading-row">
              <div className="spinner" />
              Analyzing your code...
            </div>
          )}

          {!loading && !result && (
            <div className="explanation-empty">
              <SparkleIcon />
              <p>Paste your code and click "Explain Code" to get started.</p>
            </div>
          )}

          {!loading && result && (
            <>
              <div className="explanation-section">
                <h3>Overview</h3>
                <p>{result.overview}</p>
              </div>

              {activeFollowup === null && (
                <div className="explanation-section">
                  <h3>Step-by-step Explanation</h3>
                  <ol>
                    {result.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {activeFollowup === "complexity" && (
                <div className="explanation-section">
                  <h3>Time &amp; Space Complexity</h3>
                  <ul className="complexity-list">
                    <li>
                      <span>Time Complexity</span>
                      <strong>{result.complexity.time}</strong>
                    </li>
                    <li>
                      <span>Space Complexity</span>
                      <strong>{result.complexity.space}</strong>
                    </li>
                  </ul>
                </div>
              )}

              {activeFollowup === "approach" && (
                <div className="explanation-section">
                  <h3>Approach Explainer</h3>
                  <ul>
                    {result.approach.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeFollowup === "bugs" && (
                <div className="explanation-section">
                  <h3>Bug Finder</h3>
                  {result.bugs.map((bug, i) => (
                    <div className="bug-item" key={i}>
                      <div className="bug-line">{bug.line}</div>
                      <p>{bug.message}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeFollowup === "hints" && (
                <div className="explanation-section">
                  <h3>Hint Generation</h3>
                  {result.hints.map((hint, i) => (
                    <div className="hint-item" key={i}>
                      <span className="hint-number">{i + 1}.</span>
                      {hint}
                    </div>
                  ))}
                </div>
              )}

              {activeFollowup === "optimize" && (
                <div className="explanation-section">
                  <h3>Code Optimization</h3>
                  <pre className="optimized-code-block">{result.optimized}</pre>
                </div>
              )}

              {activeFollowup === "walkthrough" && (
                <div className="explanation-section">
                  <h3>Example Walkthrough</h3>
                  <p>
                    For nums = [2, 7, 11, 15] and target = 9: at i = 0, num = 2,
                    rem = 7, not in seen, so seen becomes {"{2: 0}"}. At i = 1,
                    num = 7, rem = 2, which is in seen, so we return [0, 1].
                  </p>
                </div>
              )}

              <div className="explanation-section">
                <div className="followup-title">
                  Would you like more details?
                </div>
                <div className="followup-grid">
                  {FOLLOWUPS.map((f) => (
                    <button
                      key={f.key}
                      className={`followup-btn ${activeFollowup === f.key ? "active" : ""}`}
                      onClick={() => handleFollowup(f.key)}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right column */}
        <div className="right-column">
          <div className="panel related-panel">
            <div className="panel-title">Related Problems</div>
            <ul className="related-list">
              {RELATED_PROBLEMS.map((p, i) => (
                <li key={p.name}>
                  <span className="problem-name">
                    <span className="problem-index">{i + 1}.</span>
                    {p.name}
                  </span>
                  <span
                    className={`difficulty-tag difficulty-${p.difficulty.toLowerCase()}`}
                  >
                    {p.difficulty}
                  </span>
                </li>
              ))}
            </ul>
            <button className="view-more-btn">View More Problems</button>
          </div>

          <div className="panel more-actions-panel">
            <div className="panel-title">More Actions</div>
            <div className="more-actions-list">
              {MORE_ACTIONS.map((action) => (
                <button key={action} className="more-action-btn">
                  <ActionIcon name={action} />
                  {action}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

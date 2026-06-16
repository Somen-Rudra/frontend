import { useState } from "react";
import "../styles/testcases.css";

/* ─── Icons ─── */
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconLoader = () => (
  <svg className="tc__spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
  </svg>
);
const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

/* ─── Default test cases ─── */
const DEFAULT_CASES = [
  { id: 1, label: "Case 1", inputs: { nums: "[2,7,11,15]", target: "9" }, expected: "[0,1]" },
  { id: 2, label: "Case 2", inputs: { nums: "[3,2,4]", target: "6" }, expected: "[1,2]" },
  { id: 3, label: "Case 3", inputs: { nums: "[3,3]", target: "6" }, expected: "[0,1]" },
];

/* ─── Status pill ─── */
const StatusPill = ({ status }) => {
  if (!status) return null;
  const map = {
    passed: { icon: <IconCheck />, label: "Passed", cls: "tc__pill--pass" },
    failed: { icon: <IconX />, label: "Wrong Answer", cls: "tc__pill--fail" },
    running: { icon: <IconLoader />, label: "Running…", cls: "tc__pill--run" },
  };
  const s = map[status];
  if (!s) return null;
  return (
    <span className={`tc__pill ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
};

/* ─── Single test case panel ─── */
const CasePanel = ({ tc, result }) => (
  <div className="tc__case-panel">
    <div className="tc__field-group">
      {Object.entries(tc.inputs).map(([key, val]) => (
        <div key={key} className="tc__field">
          <label className="tc__field-label">{key} =</label>
          <div className="tc__field-val">{val}</div>
        </div>
      ))}
      <div className="tc__field">
        <label className="tc__field-label">Expected</label>
        <div className="tc__field-val tc__field-val--expected">{tc.expected}</div>
      </div>
    </div>

    {result && (
      <div className="tc__result-block">
        <div className="tc__result-row">
          <span className="tc__result-key">Output</span>
          <span className={`tc__result-val ${result.status === "passed" ? "tc__result-val--pass" : "tc__result-val--fail"}`}>
            {result.output ?? "—"}
          </span>
          <StatusPill status={result.status} />
        </div>
        {result.runtime && (
          <div className="tc__result-meta">
            Runtime: <strong>{result.runtime}</strong> · Memory: <strong>{result.memory}</strong>
          </div>
        )}
      </div>
    )}
  </div>
);

/* ─── Main component ─── */
const TestCase = ({ results = {}, onRun, onSubmit, isRunning = false }) => {
  const [tab, setTab] = useState("testcase"); // "testcase" | "result"
  const [activeCase, setActiveCase] = useState(0);
  const [cases, setCases] = useState(DEFAULT_CASES);

  const addCase = () => {
    const newId = cases.length + 1;
    setCases((prev) => [
      ...prev,
      { id: newId, label: `Case ${newId}`, inputs: { nums: "[]", target: "0" }, expected: "[]" },
    ]);
    setActiveCase(cases.length);
  };

  const allPassed =
    Object.keys(results).length > 0 &&
    Object.values(results).every((r) => r.status === "passed");
  const anyFailed = Object.values(results).some((r) => r.status === "failed");

  return (
    <div className="tc__root">
      {/* Tab bar */}
      <div className="tc__tabs">
        <div className="tc__tabs-left">
          <button
            className={`tc__tab ${tab === "testcase" ? "tc__tab--active" : ""}`}
            onClick={() => setTab("testcase")}
          >
            Testcase
          </button>
          <button
            className={`tc__tab ${tab === "result" ? "tc__tab--active" : ""}`}
            onClick={() => setTab("result")}
          >
            Test Result
            {Object.keys(results).length > 0 && (
              <span className={`tc__tab-badge ${allPassed ? "tc__tab-badge--pass" : "tc__tab-badge--fail"}`}>
                {allPassed ? <IconCheck /> : <IconX />}
              </span>
            )}
          </button>
        </div>

        {tab === "testcase" && (
          <div className="tc__tabs-right">
            {isRunning && <StatusPill status="running" />}
          </div>
        )}
      </div>

      {/* Case selector */}
      <div className="tc__case-bar">
        {cases.map((tc, i) => {
          const r = results[tc.id];
          return (
            <button
              key={tc.id}
              className={`tc__case-btn ${activeCase === i ? "tc__case-btn--active" : ""} ${
                r?.status === "passed" ? "tc__case-btn--pass" : r?.status === "failed" ? "tc__case-btn--fail" : ""
              }`}
              onClick={() => setActiveCase(i)}
            >
              {r?.status === "passed" && <IconCheck />}
              {r?.status === "failed" && <IconX />}
              {tc.label}
            </button>
          );
        })}
        <button className="tc__case-add" onClick={addCase} title="Add test case">
          <IconPlus />
        </button>
      </div>

      {/* Content */}
      <div className="tc__content">
        {tab === "testcase" ? (
          <CasePanel tc={cases[activeCase]} result={results[cases[activeCase]?.id]} />
        ) : (
          <div className="tc__result-summary">
            {Object.keys(results).length === 0 ? (
              <div className="tc__empty">
                <div className="tc__empty-icon">▷</div>
                <div className="tc__empty-text">Run your code to see results</div>
              </div>
            ) : (
              <>
                <div className={`tc__verdict ${allPassed ? "tc__verdict--pass" : "tc__verdict--fail"}`}>
                  {allPassed ? (
                    <><IconCheck /> All test cases passed</>
                  ) : (
                    <><IconX /> Some test cases failed</>
                  )}
                </div>
                <div className="tc__result-list">
                  {cases.map((tc, i) => {
                    const r = results[tc.id];
                    if (!r) return null;
                    return (
                      <div
                        key={tc.id}
                        className={`tc__result-item ${r.status === "passed" ? "tc__result-item--pass" : "tc__result-item--fail"}`}
                      >
                        <div className="tc__result-item-header">
                          <span className="tc__result-item-label">
                            {r.status === "passed" ? <IconCheck /> : <IconX />}
                            {tc.label}
                          </span>
                          <StatusPill status={r.status} />
                        </div>
                        <div className="tc__result-item-body">
                          <span className="tc__result-key">Input:</span> <code>{Object.entries(tc.inputs).map(([k, v]) => `${k}=${v}`).join(", ")}</code>
                        </div>
                        <div className="tc__result-item-body">
                          <span className="tc__result-key">Output:</span> <code>{r.output}</code>
                          &nbsp;·&nbsp;
                          <span className="tc__result-key">Expected:</span> <code>{tc.expected}</code>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="tc__footer">
        <div className="tc__footer-left">
          <span className="tc__console-link">Console</span>
        </div>
        <div className="tc__footer-right">
          <button className="tc__btn tc__btn--secondary" onClick={onRun} disabled={isRunning}>
            {isRunning ? <><IconLoader /> Running…</> : "Run Code"}
          </button>
          <button className="tc__btn tc__btn--primary" onClick={onSubmit} disabled={isRunning}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestCase;
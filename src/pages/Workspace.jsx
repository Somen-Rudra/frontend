import {
  useRef,
  useState,
  useCallback,
  useEffect,
  memo,
} from "react";
import * as FlexLayout from "flexlayout-react";
import "flexlayout-react/style/dark.css";

import ProblemDescription from "../components/ProblemDescription";
import CodeEditor from "../components/CodeEditor";
import TestCase from "../components/TestCase";

/* ─── FlexLayout model definition ─── */
const MODEL_JSON = {
  global: {
    tabEnableClose: false,
    tabEnableFloat: false,
    tabEnableRename: false,
    tabSetEnableTabStrip: true,
    tabSetHeaderHeight: 0,
    borderBarSize: 0,
    splitterSize: 5,
    splitterExtra: 4,
  },
  borders: [],
  layout: {
    type: "row",
    weight: 100,
    children: [
      /* ── Left panel: Problem Description ── */
      {
        type: "tabset",
        id: "ts-left",
        weight: 38,
        enableDrag: false,
        enableDrop: false,
        enableMaximize: false,
        children: [
          {
            type: "tab",
            name: "Problem",
            id: "tab-problem",
            component: "problem",
          },
        ],
      },

      /* ── Right panel: Editor + Testcase ── */
      {
        type: "column",
        weight: 62,
        children: [
          {
            type: "tabset",
            id: "ts-editor",
            weight: 60,
            enableDrag: false,
            enableDrop: false,
            enableMaximize: false,
            children: [
              {
                type: "tab",
                name: "Code",
                id: "tab-editor",
                component: "editor",
              },
            ],
          },
          {
            type: "tabset",
            id: "ts-testcase",
            weight: 40,
            enableDrag: false,
            enableDrop: false,
            enableMaximize: false,
            children: [
              {
                type: "tab",
                name: "Testcase",
                id: "tab-testcase",
                component: "testcase",
              },
            ],
          },
        ],
      },
    ],
  },
};

/* ─── Header ─── */
const Header = memo(({ theme, onToggleTheme }) => (
  <header className="app-header">
    <div className="app-header__left">
      <div className="app-header__logo">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="var(--color-primary)"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>

        <span className="app-header__brand">CodeJudge</span>
      </div>

      <nav className="app-header__nav">
        <a
          className="app-header__nav-link app-header__nav-link--active"
          href="#"
        >
          Problems
        </a>

        <a className="app-header__nav-link" href="#">
          Contests
        </a>

        <a className="app-header__nav-link" href="#">
          Discuss
        </a>
      </nav>
    </div>

    <div className="app-header__right">
      <button
        className="app-header__theme-btn"
        onClick={onToggleTheme}
        title="Toggle theme"
      >
        {theme === "dark" ? (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="12" cy="12" r="5" />

            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />

            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />

            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />

            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </svg>
        ) : (
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </button>

      <div className="app-header__avatar">U</div>
    </div>
  </header>
));

Header.displayName = "Header";

/* ─── Main layout ─── */
const Workspace = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") return "dark";

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [testResults, setTestResults] = useState({});
  const [isRunning, setIsRunning] = useState(false);

  const modelRef = useRef(FlexLayout.Model.fromJson(MODEL_JSON));
  const timeoutRef = useRef(null);

  /* Apply theme */
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  /* Cleanup pending execution */
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  /* Simulate running test cases */
  const handleRunCode = useCallback(() => {
    setIsRunning(true);
    setTestResults({});

    const MOCK_RESULTS = {
      1: {
        status: "passed",
        output: "[0,1]",
        runtime: "52 ms",
        memory: "14.3 MB",
      },
      2: {
        status: "passed",
        output: "[1,2]",
        runtime: "48 ms",
        memory: "14.1 MB",
      },
      3: {
        status: "passed",
        output: "[0,1]",
        runtime: "51 ms",
        memory: "14.2 MB",
      },
    };

    timeoutRef.current = setTimeout(() => {
      setTestResults(MOCK_RESULTS);
      setIsRunning(false);
    }, 1400);
  }, []);

  const handleSubmit = handleRunCode;

  /* FlexLayout factory */
  const factory = useCallback(
    (node) => {
      switch (node.getComponent()) {
        case "problem":
          return <ProblemDescription />;

        case "editor":
          return (
            <CodeEditor
              onRunCode={handleRunCode}
              onSubmit={handleSubmit}
            />
          );

        case "testcase":
          return (
            <TestCase
              results={testResults}
              onRun={handleRunCode}
              onSubmit={handleSubmit}
              isRunning={isRunning}
            />
          );

        default:
          return null;
      }
    },
    [testResults, isRunning, handleRunCode, handleSubmit]
  );

  return (
    <div className="app-root">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <div className="app-body">
        {/* Breadcrumb */}
        <div className="app-breadcrumb">
          <span className="app-breadcrumb__item">Problems</span>

          <span className="app-breadcrumb__sep">›</span>

          <span className="app-breadcrumb__item">Array</span>

          <span className="app-breadcrumb__sep">›</span>

          <span className="app-breadcrumb__item app-breadcrumb__item--active">
            Easy
          </span>
        </div>

        {/* FlexLayout canvas */}
        <div className="app-canvas">
          <FlexLayout.Layout
            model={modelRef.current}
            factory={factory}
            onRenderTab={(node, renderValues) => {
              /* Hide tab labels for cleaner look */
              renderValues.content = null;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Workspace;
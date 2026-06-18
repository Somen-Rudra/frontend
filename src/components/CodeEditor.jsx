// src/components/Problem/CodeEditor.jsx

import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { VscPlay } from "react-icons/vsc";

import "../styles/code-editor.css";
import { defineEditorThemes } from "./problemConfig/editorTheme";
import { MONACO_OPTIONS, LANGUAGES } from "./problemConfig/editorConfig";

/**
 * Detects the active color mode by checking (in order):
 *  1. data-theme="dark"  on <html>  (most common pattern)
 *  2. class="dark"       on <html>  (Tailwind / next-themes)
 *  3. class="dark"       on <body>  (some libs target body)
 *  4. OS prefers-color-scheme       (fallback)
 */
function isDarkMode() {
  const html = document.documentElement;
  const body = document.body;

  if (html.dataset.theme === "dark")  return true;
  if (html.dataset.theme === "light") return false;
  if (html.classList.contains("dark"))  return true;
  if (html.classList.contains("light")) return false;
  if (body.classList.contains("dark"))  return true;
  if (body.classList.contains("light")) return false;

  // last resort — OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function resolveEditorTheme() {
  return isDarkMode() ? "crimson" : "daybreak";
}

export default function CodeEditor({ onRun, onCodeChange, isRunning }) {
  const [langKey, setLangKey]         = useState("cpp");
  const [code, setCode]               = useState("");
  const [editorTheme, setEditorTheme] = useState(resolveEditorTheme);

  useEffect(() => {
    const update = () => setEditorTheme(resolveEditorTheme());

    // Watch data-theme AND class changes on <html> and <body>
    const observer = new MutationObserver(update);
    const opts = { attributes: true, attributeFilter: ["class", "data-theme"] };
    observer.observe(document.documentElement, opts);
    observer.observe(document.body, opts);

    // Also catch OS-level changes
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  function handleCodeChange(value) {
    const newCode = value || "";
    setCode(newCode);
    onCodeChange?.(newCode, LANGUAGES[langKey]?.judgeKey || "cpp");
  }

  function handleRun() {
    onRun?.(code, LANGUAGES[langKey]?.judgeKey || "cpp");
  }

  return (
    <div className="editor-page">
      <div className="editor-wrapper">
        <div className="editor-toolbar">
          <div className="dropdown-container">
            <label htmlFor="lang-select">Language: </label>

            <select
              id="lang-select"
              value={langKey}
              onChange={(e) => setLangKey(e.target.value)}
              className="styled-select"
            >
              {Object.entries(LANGUAGES).map(([key, lang]) => (
                <option key={key} value={key}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          <button
            className={`run-button ${isRunning ? "running" : ""}`}
            onClick={handleRun}
            disabled={isRunning}
          >
            {isRunning ? (
              <>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "spin 0.7s linear infinite",
                  }}
                />
                Running…
              </>
            ) : (
              <>
                <VscPlay size={16} />
                Run
              </>
            )}
          </button>
        </div>

        <div className="monaco-container">
          <Editor
            height="100%"
            language={LANGUAGES[langKey]?.monacoLang || "cpp"}
            value={code}
            onChange={handleCodeChange}
            beforeMount={defineEditorThemes}
            theme={editorTheme}
            options={MONACO_OPTIONS}
          />
        </div>
      </div>
    </div>
  );
}
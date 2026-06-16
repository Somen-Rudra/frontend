import { useState, useRef, useEffect } from "react";
import "../styles/code-editor.css";

/* ─── Icons ─── */
const IconReset = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="1 4 1 10 7 10"/>
    <path d="M3.51 15a9 9 0 1 0 .49-4.52"/>
  </svg>
);
const IconFullscreen = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);
const IconSettings = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M4.93 4.93a10 10 0 0 0 0 14.14"/>
  </svg>
);
const IconCopy = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);

const LANGUAGES = ["Python3", "JavaScript", "Java", "C++", "TypeScript", "Go", "Rust"];

const DEFAULT_CODE = {
  Python3: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        seen = {}
        for i, num in enumerate(nums):
            complement = target - num
            if complement in seen:
                return [seen[complement], i]
            seen[num] = i`,
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement), i];
        map.set(nums[i], i);
    }
};`,
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }
}`,
  "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> map;
        for (int i = 0; i < nums.size(); i++) {
            int complement = target - nums[i];
            if (map.count(complement)) return {map[complement], i};
            map[nums[i]] = i;
        }
        return {};
    }
};`,
  TypeScript: `function twoSum(nums: number[], target: number): number[] {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) return [map.get(complement)!, i];
        map.set(nums[i], i);
    }
    return [];
}`,
  Go: `func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, num := range nums {
        complement := target - num
        if j, ok := seen[complement]; ok {
            return []int{j, i}
        }
        seen[num] = i
    }
    return nil
}`,
  Rust: `impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        use std::collections::HashMap;
        let mut map = HashMap::new();
        for (i, &num) in nums.iter().enumerate() {
            let complement = target - num;
            if let Some(&j) = map.get(&complement) {
                return vec![j as i32, i as i32];
            }
            map.insert(num, i);
        }
        vec![]
    }
}`,
};

/* ─── Syntax highlight helpers (lightweight, no deps) ─── */
function highlight(code, lang) {
  if (!code) return "";

  const esc = (s) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const keywords = {
    Python3: /\b(class|def|for|in|if|return|and|or|not|import|from|as|with|while|else|elif|pass|None|True|False|self|enumerate)\b/g,
    JavaScript: /\b(const|let|var|function|return|for|of|if|else|new|this|class|extends|import|export|default|Map|has|get|set|typeof|instanceof)\b/g,
    Java: /\b(class|public|private|int|void|return|new|for|if|else|Map|HashMap|Integer|containsKey|get|put|import)\b/g,
    "C++": /\b(class|public|vector|int|return|for|if|else|auto|using|namespace|std|unordered_map|count|size)\b/g,
    TypeScript: /\b(function|const|let|var|return|for|if|else|number|string|Map|has|get|set|new|of)\b/g,
    Go: /\b(func|return|for|if|range|make|int|map|ok|var|type|struct|package|import)\b/g,
    Rust: /\b(pub|fn|let|mut|use|impl|for|if|else|return|Vec|vec|HashMap|Some|None|Ok|Err|in|iter|as)\b/g,
  };

  const escCode = esc(code);
  const kwRegex = keywords[lang] || keywords["JavaScript"];

  return escCode
    // strings
    .replace(/(&#34;[^&#34;]*&#34;|&#39;[^&#39;]*&#39;|"[^"]*"|'[^']*')/g, '<span class="tok-str">$1</span>')
    // comments
    .replace(/(#.*|\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="tok-comment">$1</span>')
    // numbers
    .replace(/\b(\d+)\b/g, '<span class="tok-num">$1</span>')
    // keywords
    .replace(kwRegex, '<span class="tok-kw">$&</span>')
    // types/classes (PascalCase)
    .replace(/\b([A-Z][a-zA-Z0-9]*)\b/g, '<span class="tok-type">$&</span>');
}

/* ─── Line numbers + highlighted code ─── */
const CodeDisplay = ({ code, language }) => {
  const lines = code.split("\n");
  const highlighted = highlight(code, language);
  const highlightedLines = highlighted.split("\n");

  return (
    <div className="ce__code-wrap">
      <div className="ce__gutters" aria-hidden="true">
        {lines.map((_, i) => (
          <div key={i} className="ce__line-num">{i + 1}</div>
        ))}
      </div>
      <pre
        className="ce__pre"
        dangerouslySetInnerHTML={{
          __html: highlightedLines.join("\n"),
        }}
      />
    </div>
  );
};

/* ─── Main component ─── */
const CodeEditor = ({ onRunCode, onSubmit }) => {
  const [language, setLanguage] = useState("Python3");
  const [code, setCode] = useState(DEFAULT_CODE["Python3"]);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setCode(DEFAULT_CODE[language]);
  }, [language]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleReset = () => setCode(DEFAULT_CODE[language]);

  const handleRun = () => {
    onRunCode?.(code, language);
  };

  const handleSubmitClick = () => {
    onSubmit?.(code, language);
  };

  return (
    <div className="ce__root">
      {/* Toolbar */}
      <div className="ce__toolbar">
        <div className="ce__toolbar-left">
          <select
            className="ce__lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>{l}</option>
            ))}
          </select>
        </div>

        <div className="ce__toolbar-right">
          <button className="ce__tool-btn" onClick={handleCopy} title="Copy code">
            <IconCopy />
            <span>{copied ? "Copied!" : "Copy"}</span>
          </button>
          <button className="ce__tool-btn" onClick={handleReset} title="Reset to default">
            <IconReset />
          </button>
          <button className="ce__tool-btn" title="Settings">
            <IconSettings />
          </button>
          <button className="ce__tool-btn" title="Fullscreen">
            <IconFullscreen />
          </button>
        </div>
      </div>

      {/* Editor area */}
      <div
        className="ce__editor"
        onClick={() => {
          setIsEditing(true);
          setTimeout(() => textareaRef.current?.focus(), 0);
        }}
      >
        <CodeDisplay code={code} language={language} />
        <textarea
          ref={textareaRef}
          className="ce__textarea"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onBlur={() => setIsEditing(false)}
          spellCheck={false}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {/* Footer actions */}
      <div className="ce__footer">
        <div className="ce__footer-left">
          <button className="ce__footer-btn ce__footer-btn--ghost">
            Auto
          </button>
        </div>
        <div className="ce__footer-right">
          <button className="ce__footer-btn ce__footer-btn--secondary" onClick={handleRun}>
            Run Code
          </button>
          <button className="ce__footer-btn ce__footer-btn--primary" onClick={handleSubmitClick}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
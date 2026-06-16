import { useState } from "react";
import "../styles/problem-description.css";

/* ─── Icons (inline SVG micro-set) ─── */
const IconThumbUp = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);
const IconBookmark = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
  </svg>
);
const IconShare = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
  </svg>
);
const IconNote = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
  </svg>
);
const IconPlay = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);

/* ─── Difficulty badge ─── */
const DifficultyBadge = ({ level }) => (
  <span className={`difficulty-badge difficulty-badge--${level.toLowerCase()}`}>
    {level}
  </span>
);

/* ─── Example block ─── */
const ExampleBlock = ({ index, input, output, explanation, onRun }) => (
  <div className="example-block">
    <div className="example-block__header">
      <span className="example-block__label">Example {index}</span>
      {onRun && (
        <button className="example-block__run-btn" onClick={() => onRun(input)}>
          Run
        </button>
      )}
    </div>
    <div className="example-block__body">
      <div className="example-block__row">
        <span className="example-block__key">Input:</span>
        <span className="example-block__val">{input}</span>
      </div>
      <div className="example-block__row">
        <span className="example-block__key">Output:</span>
        <span className="example-block__val">{output}</span>
      </div>
      {explanation && (
        <div className="example-block__explain">
          <strong>Explanation:</strong> {explanation}
        </div>
      )}
    </div>
  </div>
);

/* ─── Main component ─── */
const ProblemDescription = ({
  problem = DEFAULT_PROBLEM,
  onRunExample,
}) => {
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div className="panel-content panel-content--pad">
      {/* Header */}
      <div className="prob__header">
        <div className="prob__title-row">
          <span className="prob__number">{problem.id}.</span>
          <span className="prob__title">{problem.title}</span>
          <DifficultyBadge level={problem.difficulty} />
        </div>

        {/* Meta stats */}
        <div className="prob__meta">
          <span className="prob__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
            </svg>
            <span className="prob__meta-accent">{problem.likes.toLocaleString()}</span>
          </span>
          <span className="prob__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z"/>
            </svg>
            <span className="prob__meta-accent">{problem.dislikes.toLocaleString()}</span>
          </span>
          <span className="prob__meta-item">
            Acceptance&nbsp;
            <span className="prob__meta-accent">{problem.acceptance}%</span>
          </span>
          <span className="prob__meta-item">
            Submissions&nbsp;
            <span className="prob__meta-accent">{problem.submissions}</span>
          </span>
        </div>

        {/* Action buttons */}
        <div className="prob__actions">
          <button
            className="prob__action-btn"
            onClick={() => setLiked((v) => !v)}
            style={liked ? { color: "var(--color-primary)", borderColor: "var(--color-primary-border)" } : {}}
          >
            <IconThumbUp />
            {liked ? "Liked" : "Add to List"}
          </button>
          <button
            className="prob__action-btn"
            onClick={() => setBookmarked((v) => !v)}
            style={bookmarked ? { color: "var(--color-primary)", borderColor: "var(--color-primary-border)" } : {}}
          >
            <IconBookmark />
            {bookmarked ? "Saved" : "Save"}
          </button>
          <button className="prob__action-btn">
            <IconNote />
            Note
          </button>
          <button className="prob__action-btn">
            <IconShare />
            Share
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="prob__body">
        {problem.description.map((para, i) => (
          <p
            key={i}
            dangerouslySetInnerHTML={{ __html: para }}
          />
        ))}
      </div>

      {/* Examples */}
      <div className="prob__examples">
        {problem.examples.map((ex, i) => (
          <ExampleBlock
            key={i}
            index={i + 1}
            input={ex.input}
            output={ex.output}
            explanation={ex.explanation}
            onRun={onRunExample}
          />
        ))}
      </div>

      {/* Constraints */}
      <div className="prob__constraints">
        <div className="prob__section-title">Constraints</div>
        <ul className="constraints-list">
          {problem.constraints.map((c, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: c }} />
          ))}
        </ul>
      </div>

      {/* Topics */}
      {problem.topics?.length > 0 && (
        <div className="prob__constraints" style={{ marginTop: "var(--space-6)" }}>
          <div className="prob__section-title">Topics</div>
          <div className="prob__topics">
            {problem.topics.map((t) => (
              <span key={t} className="topic-tag">{t}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Default problem data ─── */
const DEFAULT_PROBLEM = {
  id: 1,
  title: "Two Sum",
  difficulty: "Easy",
  likes: 55100,
  dislikes: 1830,
  acceptance: 72.1,
  submissions: "12.3M",
  description: [
    `Given an array of integers <code>nums</code> and an integer <code>target</code>, return
    <strong>indices of the two numbers</strong> such that they add up to <code>target</code>.`,
    `You may assume that each input would have <strong>exactly one solution</strong>, and you
    may not use the same element twice.`,
    `You can return the answer in any order.`,
  ],
  examples: [
    {
      input: "nums = [2,7,11,15], target = 9",
      output: "[0,1]",
      explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
    },
    {
      input: "nums = [3,2,4], target = 6",
      output: "[1,2]",
      explanation: null,
    },
    {
      input: "nums = [3,3], target = 6",
      output: "[0,1]",
      explanation: null,
    },
  ],
  constraints: [
    `<code>2 &lt;= nums.length &lt;= 10<sup>4</sup></code>`,
    `<code>-10<sup>9</sup> &lt;= nums[i] &lt;= 10<sup>9</sup></code>`,
    `<code>-10<sup>9</sup> &lt;= target &lt;= 10<sup>9</sup></code>`,
    "Only one valid answer exists.",
  ],
  topics: ["Array", "Hash Table"],
};

export default ProblemDescription;
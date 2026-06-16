import { Link } from "react-router-dom";
import "../styles/ai-feature-page.css";

/*
  AI feature cards.
  "to" matches a route in your react-router config.
*/
const aiFeatures = [
  {
    key: "codeExplanation",
    title: "AI Code Explanation",
    description: "Get step-by-step explanations of any code or algorithm.",
    iconClass: "icon-green",
    to: "/ai-features/code-explanation",
  },
  {
    key: "hintGenerator",
    title: "AI Hint Generator",
    description: "Stuck on a problem? Get smart hints without spoiling the solution.",
    iconClass: "icon-yellow",
    to: "/ai-features/hint-generator",
  },
  {
    key: "solutionGenerator",
    title: "AI Solution Generator",
    description: "Generate optimized solutions with detailed explanations.",
    iconClass: "icon-blue",
    to: "/ai-features/solution-generator",
  },
  {
    key: "codeReview",
    title: "AI Code Review",
    description: "Review your code for bugs, complexity, and best practices.",
    iconClass: "icon-red",
    to: "/ai-features/code-review",
  },
  {
    key: "testCaseGenerator",
    title: "AI Test Case Generator",
    description: "Generate edge cases and custom test cases for better coverage.",
    iconClass: "icon-orange",
    to: "/ai-features/test-case-generator",
  },
  {
    key: "mockInterview",
    title: "AI Mock Interview",
    description: "Practice with AI interviewers and get real-time feedback.",
    iconClass: "icon-purple",
    to: "/ai-features/mock-interview",
  },
];

function SparklesIcon({ className }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function FeatureCardIcon({ featureKey }) {
  const icons = {
    codeExplanation: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
    hintGenerator: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
      </svg>
    ),
    solutionGenerator: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" />
      </svg>
    ),
    codeReview: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    testCaseGenerator: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    mockInterview: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
      </svg>
    ),
  };
  return icons[featureKey] || null;
}

function ArrowRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  );
}

export default function AIFeaturesPage() {
  return (
    <main className="ai-features-page">
      <div className="ai-features-header">
        <SparklesIcon className="header-icon" />
        <h1>AI Features</h1>
      </div>
      <p className="ai-features-subtitle">
        Your AI-powered coding companion to learn, practice and grow faster
      </p>

      <div className="feature-grid">
        {aiFeatures.map((feature) => (
          <div className="feature-card" key={feature.key}>
            <div className={`feature-icon ${feature.iconClass}`}>
              <FeatureCardIcon featureKey={feature.key} />
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
            <Link to={feature.to} className="feature-try-link">
              Try Now <ArrowRightIcon />
            </Link>
          </div>
        ))}
      </div>

      <section className="ask-ai-banner">
        <div className="ask-ai-content">
          <h2>Ask AI anything about coding</h2>
          <p>From doubts to deep explanations, your AI assistant is here.</p>
          <div className="ask-ai-input-row">
            <input
              type="text"
              placeholder="Ask anything... e.g. Explain dynamic programming"
            />
            <button className="ask-ai-submit">
              Ask AI <PaperPlaneIcon />
            </button>
          </div>
        </div>
        <div className="ask-ai-illustration" />
      </section>
    </main>
  );
}
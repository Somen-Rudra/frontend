import { useState } from "react";
import "../styles/profile.css";

/* ─── Mock data ─── */
const USER = {
  name: "PRIYOTOSH NIGGA",
  handle: "@bantupriyo_codes",
  avatar: "AS",
  rank: 1284,
  country: "India",
  joined: "Jan 2024",
  bio: "Full-stack dev. Love graphs & DP. Grinding daily.",
  streak: 42,
  solved: { easy: 87, medium: 54, hard: 19, total: 160 },
  totals: { easy: 800, medium: 1600, hard: 600 },
  badges: ["30-Day Streak", "Top 5%", "Contest Finalist", "Speed Coder"],
  recentSubmissions: [
    { id: 1, title: "Two Sum",                  difficulty: "Easy",   status: "Accepted",  time: "2h ago",   lang: "Python3" },
    { id: 2, title: "LRU Cache",                difficulty: "Medium", status: "Accepted",  time: "5h ago",   lang: "Python3" },
    { id: 3, title: "Median of Two Sorted Arrays", difficulty: "Hard", status: "Wrong Answer","time": "1d ago", lang: "C++" },
    { id: 4, title: "Valid Parentheses",         difficulty: "Easy",   status: "Accepted",  time: "2d ago",   lang: "JavaScript" },
    { id: 5, title: "Word Ladder II",            difficulty: "Hard",   status: "TLE",       time: "3d ago",   lang: "Python3" },
  ],
};

/* ─── Generate a fake 52-week heatmap ─── */
function generateHeatmap() {
  const weeks = [];
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      const rand = Math.random();
      days.push(rand < 0.35 ? 0 : rand < 0.6 ? 1 : rand < 0.8 ? 2 : rand < 0.93 ? 3 : 4);
    }
    weeks.push(days);
  }
  return weeks;
}

const HEATMAP = generateHeatmap();

/* ─── Heatmap cell intensities ─── */
const INTENSITY = [
  "hm__cell--0",
  "hm__cell--1",
  "hm__cell--2",
  "hm__cell--3",
  "hm__cell--4",
];

/* ─── Stat card ─── */
const StatCard = ({ label, value, sub }) => (
  <div className="pf__stat-card">
    <div className="pf__stat-val">{value}</div>
    <div className="pf__stat-label">{label}</div>
    {sub && <div className="pf__stat-sub">{sub}</div>}
  </div>
);

/* ─── Difficulty ring (simple CSS arc simulation) ─── */
const DiffRing = ({ solved, total, color, label }) => {
  const pct = Math.round((solved / total) * 100);
  return (
    <div className="pf__diff-item">
      <div className="pf__diff-ring" style={{ "--pct": pct, "--clr": color }}>
        <div className="pf__diff-ring-inner">
          <span className="pf__diff-count">{solved}</span>
        </div>
      </div>
      <div className="pf__diff-label" style={{ color }}>{label}</div>
      <div className="pf__diff-total">/{total}</div>
    </div>
  );
};

/* ─── Tab nav ─── */
const TABS = ["Overview", "Submissions", "Badges"];

/* ─── Main ─── */
export default function Profile() {
  const [tab, setTab] = useState("Overview");
  const { solved, totals } = USER;
  const totalSolved = solved.easy + solved.medium + solved.hard;
  const totalProblems = totals.easy + totals.medium + totals.hard;

  return (
    <div className="pf__root">
      {/* ── Left column ── */}
      <aside className="pf__aside">
        {/* Avatar + identity */}
        <div className="pf__card pf__identity">
          <div className="pf__avatar">{USER.avatar}</div>
          <h2 className="pf__name">{USER.name}</h2>
          <p className="pf__handle">{USER.handle}</p>
          <p className="pf__bio">{USER.bio}</p>

          <div className="pf__meta">
            <span className="pf__meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {USER.country}
            </span>
            <span className="pf__meta-item">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              Joined {USER.joined}
            </span>
          </div>

          <button className="pf__edit-btn">Edit Profile</button>
        </div>

        {/* Stats */}
        <div className="pf__card pf__stats-grid">
          <StatCard label="Global Rank"  value={`#${USER.rank.toLocaleString()}`} />
          <StatCard label="Day Streak"   value={`${USER.streak}🔥`} />
          <StatCard label="Problems"     value={totalSolved} sub={`/ ${totalProblems}`} />
          <StatCard label="Reputation"   value="2.4k" />
        </div>

        {/* Difficulty breakdown */}
        <div className="pf__card">
          <div className="pf__section-title">Solved by Difficulty</div>
          <div className="pf__diff-row">
            <DiffRing solved={solved.easy}   total={totals.easy}   color="var(--easy)"   label="Easy"   />
            <DiffRing solved={solved.medium} total={totals.medium} color="var(--medium)" label="Medium" />
            <DiffRing solved={solved.hard}   total={totals.hard}   color="var(--hard)"   label="Hard"   />
          </div>
        </div>
      </aside>

      {/* ── Right column ── */}
      <main className="pf__main">
        {/* Tabs */}
        <div className="pf__tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`pf__tab ${tab === t ? "pf__tab--active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* ── Overview tab ── */}
        {tab === "Overview" && (
          <>
            {/* Activity heatmap */}
            <div className="pf__card">
              <div className="pf__card-header">
                <span className="pf__section-title">Activity</span>
                <span className="pf__section-sub">{totalSolved} submissions in the last year</span>
              </div>
              <div className="pf__heatmap">
                {HEATMAP.map((week, wi) => (
                  <div key={wi} className="hm__week">
                    {week.map((level, di) => (
                      <div key={di} className={`hm__cell ${INTENSITY[level]}`} title={`${level} submissions`} />
                    ))}
                  </div>
                ))}
              </div>
              <div className="pf__heatmap-legend">
                <span className="pf__section-sub">Less</span>
                {INTENSITY.map((cls, i) => <div key={i} className={`hm__cell ${cls}`} />)}
                <span className="pf__section-sub">More</span>
              </div>
            </div>

            {/* Recent submissions */}
            <div className="pf__card">
              <div className="pf__section-title" style={{ marginBottom: "var(--space-3)" }}>Recent Submissions</div>
              <div className="pf__submissions">
                {USER.recentSubmissions.map(s => (
                  <div key={s.id} className="pf__sub-row">
                    <div className="pf__sub-left">
                      <span className="pf__sub-title">{s.title}</span>
                      <span className={`pf__diff-badge pf__diff-badge--${s.difficulty.toLowerCase()}`}>{s.difficulty}</span>
                    </div>
                    <div className="pf__sub-right">
                      <span className={`pf__sub-status pf__sub-status--${s.status === "Accepted" ? "pass" : "fail"}`}>
                        {s.status}
                      </span>
                      <span className="pf__sub-lang">{s.lang}</span>
                      <span className="pf__sub-time">{s.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ── Submissions tab ── */}
        {tab === "Submissions" && (
          <div className="pf__card">
            <div className="pf__section-title" style={{ marginBottom: "var(--space-3)" }}>All Submissions</div>
            <div className="pf__submissions">
              {[...USER.recentSubmissions, ...USER.recentSubmissions].map((s, i) => (
                <div key={i} className="pf__sub-row">
                  <div className="pf__sub-left">
                    <span className="pf__sub-title">{s.title}</span>
                    <span className={`pf__diff-badge pf__diff-badge--${s.difficulty.toLowerCase()}`}>{s.difficulty}</span>
                  </div>
                  <div className="pf__sub-right">
                    <span className={`pf__sub-status pf__sub-status--${s.status === "Accepted" ? "pass" : "fail"}`}>
                      {s.status}
                    </span>
                    <span className="pf__sub-lang">{s.lang}</span>
                    <span className="pf__sub-time">{s.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Badges tab ── */}
        {tab === "Badges" && (
          <div className="pf__card">
            <div className="pf__section-title" style={{ marginBottom: "var(--space-4)" }}>Earned Badges</div>
            <div className="pf__badges-grid">
              {USER.badges.map((b, i) => (
                <div key={i} className="pf__badge-card">
                  <div className="pf__badge-icon">
                    {["🏆","⭐","🎯","⚡"][i % 4]}
                  </div>
                  <div className="pf__badge-name">{b}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
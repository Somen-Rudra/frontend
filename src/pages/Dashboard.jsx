import { useState, useMemo } from "react";
import {
  AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, Legend,
} from "recharts";
import "../styles/dashboard.css";

/* ─── MOCK DATA LAYER ────────────────────────────────────────
   Replace each object / array with real API responses later.
──────────────────────────────────────────────────────────── */
const USER = {
  name: "SOMEN",
  handle: "@somen_rudra",
  avatar: null,          // swap with URL string when available
  streak: 25,
  bestStreak: 62,
};

const STATS = [
  { label: "Solved Problems", value: "1,248", delta: "+18 this week",  trend: "up"      },
  { label: "Contest Rating",  value: "1,856", delta: "+56",            trend: "up"      },
  { label: "Global Rank",     value: "12,432",delta: "Top 3.2%",       trend: "neutral" },
  { label: "Badge Count",     value: "24",    delta: "See all",        trend: "link"    },
];

// monthly problems solved — swap with real data
const MONTHLY_SOLVED = [
  { month: "Jan", solved: 98  },
  { month: "Feb", solved: 120 },
  { month: "Mar", solved: 87  },
  { month: "Apr", solved: 145 },
  { month: "May", solved: 210 },
  { month: "Jun", solved: 189 },
  { month: "Jul", solved: 230 },
  { month: "Aug", solved: 175 },
  { month: "Sep", solved: 260 },
  { month: "Oct", solved: 195 },
  { month: "Nov", solved: 284 },
  { month: "Dec", solved: 155 },
];

// difficulty breakdown for radial chart
const DIFFICULTY_DATA = [
  { name: "Easy",   solved: 720, fill: "var(--easy)"   },
  { name: "Medium", solved: 480, fill: "var(--medium)" },
  { name: "Hard",   solved: 148, fill: "var(--hard)"   },
];

// heatmap: 28 weeks × 7 days  (0 = no activity, 1-4 = intensity)
// Replace with a real { "YYYY-MM-DD": count } map and map it to weeks
function buildHeatmap() {
  const weeks = 28;
  return Array.from({ length: weeks * 7 }, () => Math.floor(Math.random() * 5));
}

const HEATMAP_CELLS = buildHeatmap();

const UPCOMING_CONTESTS = [
  { id: 1, org: "Google",  title: "Google CodeSprint Challenge", date: "May 25, 2026", time: "10:30 AM", msLeft: 2 * 3600 + 15 * 60 + 45, color: "#4285F4" },
  { id: 2, org: "Code",    title: "Weekly Contest 428",          date: "May 25, 2026", time: "08:00 PM", msLeft: 10 * 3600 + 45 * 60 + 30, color: "var(--info)" },
  { id: 3, org: "Arena",   title: "CodeArena Monthly Challenge", date: "May 30, 2026", time: "09:00 AM", msLeft: 5 * 3600 + 15 * 60 + 30,  color: "var(--color-primary)" },
];

const CONTINUE_SOLVING = [
  { id: 1, title: "Two Sum",                                          diff: "easy",   tags: "Array, Hash Table",              iconColor: "var(--easy)"   },
  { id: 2, title: "Merge k Sorted Lists",                             diff: "hard",   tags: "Linked List, Divide & Conquer",  iconColor: "var(--hard)"   },
  { id: 3, title: "Longest Substring Without Repeating Characters",   diff: "medium", tags: "Hash Table, String",             iconColor: "var(--medium)" },
];

const RECOMMENDATIONS = [
  { id: 1, title: "3Sum",               diff: "medium", submissions: "42.1K", acceptRate: "69%", iconColor: "var(--medium)" },
  { id: 2, title: "Maximum Subarray",   diff: "easy",   submissions: "31.5K", acceptRate: "72%", iconColor: "var(--easy)"   },
  { id: 3, title: "LRU Cache",          diff: "hard",   submissions: "18.7K", acceptRate: "58%", iconColor: "var(--hard)"   },
  { id: 4, title: "Valid Parentheses",  diff: "easy",   submissions: "25.2K", acceptRate: "89%", iconColor: "var(--info)"   },
];

const ACHIEVEMENTS = [
  { id: 1, icon: "✅", color: "#3b82f6", bg: "rgba(59,130,246,.1)",  label: "Solved 1000 Problems",  when: "2 days ago"  },
  { id: 2, icon: "🔥", color: "#f97316", bg: "rgba(249,115,22,.1)",  label: "28 Days Streak",         when: "5 days ago"  },
  { id: 3, icon: "⭐", color: "#a855f7", bg: "rgba(168,85,247,.1)",  label: "Contest Rating 1850",    when: "1 week ago"  },
];

/* ─── HELPERS ──────────────────────────────────────────────── */
function fmtTime(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${h} : ${m} : ${s}`;
}

function cap(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/* Custom recharts tooltip */
function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="db-tooltip">
      <div className="db-tooltip__label">{label}</div>
      <div className="db-tooltip__val">{payload[0].value} solved</div>
    </div>
  );
}

/* ─── COMPONENT ────────────────────────────────────────────── */
export default function Dashboard() {
  const [chartPeriod, setChartPeriod] = useState("This Year");

  // derive mini heatmap (last 42 cells = last 6 weeks)
  const miniCells = HEATMAP_CELLS.slice(-42);

  // filter monthly data by period (extensible)
  const chartData = useMemo(() => {
    if (chartPeriod === "Last 6 Months") return MONTHLY_SOLVED.slice(-6);
    if (chartPeriod === "Last 3 Months") return MONTHLY_SOLVED.slice(-3);
    return MONTHLY_SOLVED;
  }, [chartPeriod]);

  return (
    <div className="db-layout">

      {/* ══ MAIN SCROLL ══════════════════════════════════════ */}
      <main className="db-scroll">
        <div className="db-container">

          {/* ── LEFT COLUMN ─────────────────────────────────── */}
          <div className="db-left">

            {/* Welcome + Streak */}
            <div className="db-welcome">
              <div className="db-greeting">
                <h1>Good morning, {USER.name}! <span aria-label="wave">👋</span></h1>
                <p>Let's solve some problems today and keep that streak alive.</p>
              </div>

              <div className="db-streak-card">
                <div className="db-streak-info">
                  <div className="db-flame">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.66 11.2c-.23-.3-.51-.56-.77-.82-.67-.6-1.43-1.03-2.07-1.66C13.33 7.26 13 4.85 13.95 3c-.95.23-1.78.75-2.49 1.32-2.59 2.08-3.61 5.75-2.39 8.9.04.1.08.2.08.33 0 .22-.15.42-.35.5-.22.1-.46.04-.64-.12a.83.83 0 0 1-.15-.17c-1.1-1.43-1.28-3.48-.53-5.12C5.89 10 5 12.3 5.14 14.47c.04.5.1 1 .27 1.5.14.6.4 1.2.72 1.73 1.04 1.73 2.87 2.97 4.84 3.22 2.1.27 4.35-.12 5.96-1.6 1.8-1.66 2.45-4.32 1.5-6.6l-.13-.26c-.2-.45-.47-.87-.78-1.25z"/>
                    </svg>
                  </div>
                  <div>
                    <div className="db-streak-label">Current Streak</div>
                    <div className="db-streak-count">{USER.streak} days</div>
                    <div className="db-streak-best">Best: {USER.bestStreak} days</div>
                  </div>
                </div>
                <div className="db-mini-heatmap">
                  {miniCells.map((lvl, i) => (
                    <div key={i} className={`db-hcell db-hcell--${lvl}`} />
                  ))}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="db-stats-grid">
              {STATS.map((s) => (
                <div key={s.label} className="db-card db-stat-card">
                  <div className="db-stat-label">{s.label}</div>
                  <div className="db-stat-val">{s.value}</div>
                  <div className={`db-stat-delta db-stat-delta--${s.trend}`}>
                    {s.trend === "up" && (
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="12 19 12 5"/><polyline points="5 12 12 5 19 12"/></svg>
                    )}
                    {s.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Charts row */}
            <div className="db-charts-grid">

              {/* Activity heatmap */}
              <div className="db-card">
                <div className="db-card-header">
                  <h3 className="db-card-title">Activity Heatmap</h3>
                  <span className="db-card-hint">28 weeks</span>
                </div>
                <div className="db-heatmap-wrap">
                  <div className="db-heatmap">
                    {HEATMAP_CELLS.map((lvl, i) => (
                      <div key={i} className={`db-hcell db-hcell--${lvl}`} />
                    ))}
                  </div>
                  <div className="db-heatmap-legend">
                    <span>Less</span>
                    {[0, 1, 2, 3, 4].map((l) => (
                      <div key={l} className={`db-hcell db-hcell--${l}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>
              </div>

              {/* Area chart — problems solved */}
              <div className="db-card">
                <div className="db-card-header">
                  <h3 className="db-card-title">Problems Solved</h3>
                  <select
                    className="db-select"
                    value={chartPeriod}
                    onChange={(e) => setChartPeriod(e.target.value)}
                  >
                    <option>This Year</option>
                    <option>Last 6 Months</option>
                    <option>Last 3 Months</option>
                  </select>
                </div>
                <div className="db-chart-area">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                      <defs>
                        <linearGradient id="solvedGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#dc143c" stopOpacity={0.25} />
                          <stop offset="100%" stopColor="#dc143c" stopOpacity={0}    />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-primary)", strokeWidth: 1, strokeDasharray: "4 2" }} />
                      <Area
                        type="monotone"
                        dataKey="solved"
                        stroke="#dc143c"
                        strokeWidth={2.5}
                        fill="url(#solvedGrad)"
                        dot={{ r: 3, fill: "#dc143c", strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: "#dc143c", stroke: "var(--bg-card)", strokeWidth: 2 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radial chart — difficulty breakdown */}
              <div className="db-card db-card--radial">
                <div className="db-card-header">
                  <h3 className="db-card-title">Difficulty Breakdown</h3>
                </div>
                <div className="db-radial-wrap">
                  <ResponsiveContainer width="100%" height={180}>
                    <RadialBarChart
                      cx="50%" cy="50%"
                      innerRadius="30%" outerRadius="90%"
                      barSize={14}
                      data={DIFFICULTY_DATA}
                      startAngle={90} endAngle={-270}
                    >
                      <RadialBar dataKey="solved" cornerRadius={6} background={{ fill: "var(--bg-tertiary)" }} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                  <div className="db-radial-legend">
                    {DIFFICULTY_DATA.map((d) => (
                      <div key={d.name} className="db-radial-item">
                        <span className="db-radial-dot" style={{ background: d.fill }} />
                        <span className="db-radial-name">{d.name}</span>
                        <span className="db-radial-count">{d.solved}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommended for You */}
            <div className="db-section">
              <div className="db-section-header">
                <div>
                  <h3 className="db-card-title">Recommended for You</h3>
                  <p className="db-section-sub">Based on your recent activity</p>
                </div>
                <a href="#" className="db-link">View all</a>
              </div>
              <div className="db-rec-grid">
                {RECOMMENDATIONS.map((r) => (
                  <div key={r.id} className="db-rec-card">
                    <div className="db-rec-top">
                      <div className="db-icon-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={r.iconColor} strokeWidth="2">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="9" y1="3" x2="9" y2="21"/>
                        </svg>
                      </div>
                      <span className={`db-badge db-badge--${r.diff}`}>{cap(r.diff)}</span>
                    </div>
                    <h4 className="db-rec-title">{r.title}</h4>
                    <div className="db-rec-meta">
                      <span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                        {r.submissions}
                      </span>
                      <span>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
                        {r.acceptRate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ─────────────────────────────────── */}
          <div className="db-right">

            {/* Upcoming Contests */}
            <div className="db-card db-card--right">
              <div className="db-card-header">
                <h3 className="db-card-title">Upcoming Contests</h3>
                <a href="#" className="db-link">View all</a>
              </div>
              <div className="db-list">
                {UPCOMING_CONTESTS.map((c) => (
                  <div key={c.id} className="db-list-item">
                    <div className="db-list-left">
                      <div className="db-org-badge" style={{ background: c.color + "22", color: c.color }}>
                        {c.org.charAt(0)}
                      </div>
                      <div>
                        <div className="db-list-title">{c.title}</div>
                        <div className="db-list-sub">{c.date} · {c.time}</div>
                      </div>
                    </div>
                    <div className="db-list-right">
                      <div className="db-timer">{fmtTime(c.msLeft)}</div>
                      <button className="db-btn-outline">Register</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Continue Solving */}
            <div className="db-card db-card--right">
              <div className="db-card-header">
                <h3 className="db-card-title">Continue Solving</h3>
                <a href="#" className="db-link">View all</a>
              </div>
              <div className="db-list">
                {CONTINUE_SOLVING.map((item) => (
                  <div key={item.id} className="db-list-item">
                    <div className="db-list-left">
                      <div className="db-icon-box">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={item.iconColor} strokeWidth="2">
                          <polygon points="12 2 2 7 12 12 22 7 12 2"/>
                          <polyline points="2 17 12 22 22 17"/>
                          <polyline points="2 12 12 17 22 12"/>
                        </svg>
                      </div>
                      <div>
                        <div className="db-list-title">
                          {item.title}
                          <span className={`db-badge db-badge--${item.diff}`} style={{ marginLeft: 7 }}>{cap(item.diff)}</span>
                        </div>
                        <div className="db-list-sub">{item.tags}</div>
                      </div>
                    </div>
                    <button className="db-btn-outline">Continue</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="db-card db-card--right">
              <div className="db-card-header">
                <h3 className="db-card-title">Recent Achievements</h3>
                <a href="#" className="db-link">View all</a>
              </div>
              <div className="db-list">
                {ACHIEVEMENTS.map((a) => (
                  <div key={a.id} className="db-list-item">
                    <div className="db-list-left">
                      <div className="db-icon-box" style={{ background: a.bg, borderColor: "transparent" }}>
                        <span style={{ fontSize: 14 }}>{a.icon}</span>
                      </div>
                      <div className="db-list-title" style={{ marginBottom: 0 }}>{a.label}</div>
                    </div>
                    <div className="db-list-sub">{a.when}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
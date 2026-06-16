import { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import ProfilePopup from "./ProfilePopup";
import "../styles/sidebar.css";

export const routeMap = {
  dashboard:    { label: "Dashboard",    path: "/",             icon: "ti-layout-dashboard" },
  problems:     { label: "Problems",     path: "/problems",     icon: "ti-code" },
  contests:     { label: "Contests",     path: "/contests",     icon: "ti-trophy" },
  companies:    { label: "Companies",    path: "/companies",    icon: "ti-building" },
  interviews:   { label: "Interviews",   path: "/interviews",   icon: "ti-message-dots" },
  aiFeatures:   { label: "AI Features",  path: "/ai-features",  icon: "ti-sparkles" },
  bookmarks:    { label: "Bookmarks",    path: "/bookmarks",    icon: "ti-bookmark" },
  progress:     { label: "Progress",     path: "/progress",     icon: "ti-chart-line" },
  certificates: { label: "Certificates", path: "/certificates", icon: "ti-certificate" },
};

const BOTTOM_KEYS = [];

const USER = {
  name: "Arjun Sharma",
  handle: "@arjun_codes",
  avatar: "AS",
  plan: "Free",
};

export default function Sidebar({ routes = routeMap }) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const avatarRef = useRef(null);

  const topRoutes    = Object.entries(routes).filter(([k]) => !BOTTOM_KEYS.includes(k));
  const bottomRoutes = Object.entries(routes).filter(([k]) =>  BOTTOM_KEYS.includes(k));

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--collapsed" : ""}`}>

      {/* ── Header ── */}
      <div className="sidebar__header">
        {!collapsed && (
          <Link to="/" className="sidebar__brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6"/>
              <polyline points="8 6 2 12 8 18"/>
            </svg>
            <span className="sidebar__brand-name">CodeArena</span>
          </Link>
        )}
        <button
          className="sidebar__toggle"
          onClick={() => setCollapsed(v => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <i className={`ti ${collapsed ? "ti-layout-sidebar-right" : "ti-layout-sidebar"}`} aria-hidden="true" />
        </button>
      </div>

      {/* ── Search ── */}
      {!collapsed ? (
        <div className="sidebar__search">
          <i className="ti ti-search sidebar__search-icon" aria-hidden="true" />
          <input type="text" placeholder="Search…" className="sidebar__search-input" />
        </div>
      ) : (
        <button className="sidebar__icon-btn" title="Search">
          <i className="ti ti-search" aria-hidden="true" />
        </button>
      )}

      {/* ── Top nav ── */}
      <nav className="sidebar__nav">
        {topRoutes.map(([key, route]) => {
          const active = location.pathname === route.path;
          return (
            <Link
              key={key}
              to={route.path}
              className={`sidebar__link ${active ? "sidebar__link--active" : ""}`}
              title={collapsed ? route.label : undefined}
            >
              <i className={`ti ${route.icon} sidebar__link-icon`} aria-hidden="true" />
              {!collapsed && <span className="sidebar__link-label">{route.label}</span>}
              {!collapsed && active && <span className="sidebar__link-dot" />}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar__spacer" />

      {/* ── Upgrade card ── */}
      {!collapsed && (
        <div className="sidebar__upgrade">
          <div className="sidebar__upgrade-label">
            <i className="ti ti-sparkles" aria-hidden="true" /> Pro plan
          </div>
          <p className="sidebar__upgrade-desc">Unlock all AI features and premium problems.</p>
          <Link to="/pricing" className="sidebar__upgrade-btn">Upgrade Now</Link>
        </div>
      )}

      {/* ── Bottom ── */}
      <div className="sidebar__bottom">
        {bottomRoutes.map(([key, route]) => {
          const active = location.pathname === route.path;
          return (
            <Link
              key={key}
              to={route.path}
              className={`sidebar__link ${active ? "sidebar__link--active" : ""}`}
              title={collapsed ? route.label : undefined}
            >
              <i className={`ti ${route.icon} sidebar__link-icon`} aria-hidden="true" />
              {!collapsed && <span className="sidebar__link-label">{route.label}</span>}
            </Link>
          );
        })}

        <div className={`sidebar__bottom-row ${collapsed ? "sidebar__bottom-row--col" : ""}`}>
          <ThemeToggle />

          <div className="sidebar__avatar-wrap">
            <button
              ref={avatarRef}
              className={`sidebar__avatar ${showPopup ? "sidebar__avatar--active" : ""}`}
              onClick={() => setShowPopup(v => !v)}
              aria-label="Open profile menu"
              aria-expanded={showPopup}
            >
              {USER.avatar}
            </button>

            {showPopup && (
              <ProfilePopup
                onClose={() => setShowPopup(false)}
                anchorRef={avatarRef}
                collapsed={collapsed}
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
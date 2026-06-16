import { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import "../styles/sidebar.css";
import "../styles/profile.css";

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
  settings:     { label: "Settings",     path: "/settings",     icon: "ti-settings" },
};

const BOTTOM_KEYS = ["settings"];

/* ─── User data (swap with real auth context) ─── */
const USER = {
  name: "Arjun Sharma",
  handle: "@arjun_codes",
  avatar: "AS",
  plan: "Free",
};

/* ─── Profile popup menu ─── */
function ProfilePopup({ onClose, collapsed }) {
  const navigate = useNavigate();
  const ref = useRef(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);

  const go = (path) => { navigate(path); onClose(); };

  return (
    <div
      ref={ref}
      className={`prof-popup ${collapsed ? "prof-popup--collapsed" : ""}`}
    >
      {/* Identity header */}
      <div className="prof-popup__header">
        <div className="prof-popup__avatar">{USER.avatar}</div>
        <div className="prof-popup__info">
          <span className="prof-popup__name">{USER.name}</span>
          <span className="prof-popup__handle">{USER.handle}</span>
        </div>
      </div>

      <div className="prof-popup__plan">
        <i className="ti ti-sparkles" aria-hidden="true" />
        {USER.plan} Plan
        <Link to="/pricing" className="prof-popup__upgrade" onClick={onClose}>
          Upgrade
        </Link>
      </div>

      <div className="prof-popup__divider" />

      {/* Navigation items */}
      <div className="prof-popup__section">
        <button className="prof-popup__item" onClick={() => go("/profile")}>
          <i className="ti ti-user" aria-hidden="true" />
          View Profile
        </button>
        <button className="prof-popup__item" onClick={() => go("/progress")}>
          <i className="ti ti-chart-line" aria-hidden="true" />
          My Progress
        </button>
        <button className="prof-popup__item" onClick={() => go("/bookmarks")}>
          <i className="ti ti-bookmark" aria-hidden="true" />
          Bookmarks
        </button>
        <button className="prof-popup__item" onClick={() => go("/certificates")}>
          <i className="ti ti-certificate" aria-hidden="true" />
          Certificates
        </button>
      </div>

      <div className="prof-popup__divider" />

      <div className="prof-popup__section">
        <button className="prof-popup__item" onClick={() => go("/settings")}>
          <i className="ti ti-settings" aria-hidden="true" />
          Settings
        </button>
        <button className="prof-popup__item" onClick={() => go("/settings/notifications")}>
          <i className="ti ti-bell" aria-hidden="true" />
          Notifications
        </button>
        <button className="prof-popup__item" onClick={() => go("/settings/billing")}>
          <i className="ti ti-credit-card" aria-hidden="true" />
          Billing
        </button>
      </div>

      <div className="prof-popup__divider" />

      <div className="prof-popup__section">
        <button
          className="prof-popup__item prof-popup__item--danger"
          onClick={() => { onClose(); /* call your auth logout here */ }}
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>
  );
}

/* ─── Main Sidebar ─── */
export default function Sidebar({ routes = routeMap }) {
  const location  = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

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

          {/* Avatar — opens popup, does NOT navigate directly */}
          <div className="sidebar__avatar-wrap">
            <button
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
                collapsed={collapsed}
              />
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import "../styles/profile-popup.css";

const USER = {
  name: "Arjun Sharma",
  handle: "@arjun_codes",
  avatar: "AS",
  plan: "Free",
};

export default function ProfilePopup({ onClose, anchorRef, collapsed }) {
  const popupRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!anchorRef?.current || !popupRef.current) return;

    const position = () => {
      const rect = anchorRef.current.getBoundingClientRect();
      const popup = popupRef.current;
      const popupHeight = popup.offsetHeight;
      const popupWidth = popup.offsetWidth;

      let left = rect.right + 8;
      let top = rect.bottom - popupHeight;

      // clamp so it never overflows the viewport
      if (left + popupWidth > window.innerWidth)
        left = rect.left - popupWidth - 8;
      if (top < 8) top = 8;

      popup.style.left = `${left}px`;
      popup.style.top = `${top}px`;
    };

    position();
    window.addEventListener("resize", position);
    return () => window.removeEventListener("resize", position);
  }, [anchorRef, collapsed]);

  useEffect(() => {
    const handler = (e) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(e.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose, anchorRef]);

  const go = (path) => {
    navigate(path);
    onClose();
  };

  return createPortal(
    <div
      ref={popupRef}
      className="prof-popup"
      style={{ position: "fixed", zIndex: 9999 }}
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
        <button
          className="prof-popup__item"
          onClick={() => go("/certificates")}
        >
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
        <button
          className="prof-popup__item"
          onClick={() => go("/settings/notifications")}
        >
          <i className="ti ti-bell" aria-hidden="true" />
          Notifications
        </button>
        <button
          className="prof-popup__item"
          onClick={() => go("/settings/billing")}
        >
          <i className="ti ti-credit-card" aria-hidden="true" />
          Billing
        </button>
      </div>

      <div className="prof-popup__divider" />

      <div className="prof-popup__section">
        <button
          className="prof-popup__item prof-popup__item--danger"
          onClick={() => {
            onClose();
            /* call your auth logout here */
          }}
        >
          <i className="ti ti-logout" aria-hidden="true" />
          Log out
        </button>
      </div>
    </div>,
    document.body,
  );
}

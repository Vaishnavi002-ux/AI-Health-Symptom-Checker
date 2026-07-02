import React from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiActivity } from 'react-icons/fi';

const PAGE_TITLES = {
  '/dashboard': 'Dashboard',
  '/checker': 'AI Symptom Checker',
  '/diseases': 'Disease Information Library',
  '/medicines': 'Medicine Information Guide',
  '/health-tips': 'Health Tips',
  '/reports': 'AI Health Report Generator',
  '/history': 'Consultation History',
  '/emergency': 'Emergency Help',
};

function TopBar({ onToggleSidebar, darkMode, onToggleDark }) {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] || 'HealthAI';

  return (
    <header className="topbar">
      <button
        className="btn btn-ghost btn-icon"
        onClick={onToggleSidebar}
        aria-label="Toggle sidebar"
      >
        <FiMenu size={18} />
      </button>

      <div className="topbar-title">
        {title}
        <span className="topbar-badge">IBM Granite</span>
      </div>

      <div className="topbar-actions">
        {/* Status indicator */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '.35rem',
            fontSize: '.75rem',
            color: 'var(--text-secondary)',
            padding: '.3rem .7rem',
            background: 'var(--ibm-green-light)',
            borderRadius: '999px',
            color: 'var(--ibm-green)',
            fontWeight: 600,
          }}
        >
          <FiActivity size={12} />
          AI Online
        </div>

        <button
          className="btn btn-ghost btn-icon"
          onClick={onToggleDark}
          aria-label="Toggle dark mode"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>
      </div>
    </header>
  );
}

export default TopBar;

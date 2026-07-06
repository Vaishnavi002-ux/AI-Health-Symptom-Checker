import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FiMenu, FiSun, FiMoon, FiBell, FiZap } from 'react-icons/fi';

const PAGE_META = {
  '/dashboard':    { title: 'Dashboard',              crumb: 'Home'       },
  '/checker':      { title: 'AI Symptom Checker',     crumb: 'Checker'    },
  '/diseases':     { title: 'Disease Library',        crumb: 'Knowledge'  },
  '/medicines':    { title: 'Medicine Guide',         crumb: 'Knowledge'  },
  '/health-tips':  { title: 'Health Tips',            crumb: 'Wellness'   },
  '/reports':      { title: 'Health Reports',         crumb: 'Reports'    },
  '/history':      { title: 'Consultation History',   crumb: 'Reports'    },
  '/emergency':    { title: 'Emergency Help',         crumb: 'Safety'     },
  '/hospitals':    { title: 'Nearby Hospitals',       crumb: 'Safety'     },
  '/bmi':          { title: 'BMI Calculator',         crumb: 'Tools'      },
  '/water':        { title: 'Water Intake Tracker',   crumb: 'Tools'      },
  '/sleep':        { title: 'Sleep Tracker',          crumb: 'Tools'      },
  '/analytics':    { title: 'Health Analytics',       crumb: 'Tools'      },
  '/mental':       { title: 'Mental Wellness',        crumb: 'Wellness'   },
  '/reminders':    { title: 'Medicine Reminders',     crumb: 'Management' },
  '/appointments': { title: 'Appointment Scheduler',  crumb: 'Management' },
  '/family':       { title: 'Family Profiles',        crumb: 'Management' },
  '/profile':      { title: 'My Profile',             crumb: 'Account'    },
  '/settings':     { title: 'Settings',               crumb: 'Account'    },
  '/faq':          { title: 'FAQ',                    crumb: 'Help'       },
  '/about':        { title: 'About Project',          crumb: 'Info'       },
};

const LANGS = ['EN', 'हि', 'मर'];

function TopBar({ onToggleSidebar, darkMode, onToggleDark }) {
  const { pathname } = useLocation();
  const meta = PAGE_META[pathname] || { title: 'HealthAI', crumb: 'App' };
  const [lang, setLang] = useState('EN');

  return (
    <header className="topbar" role="banner">
      <button className="topbar-menu-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
        <FiMenu size={17} />
      </button>

      {/* Breadcrumb */}
      <div className="topbar-breadcrumb">
        <span className="topbar-crumb-home">HealthAI</span>
        <span className="topbar-crumb-sep">/</span>
        <span className="topbar-crumb-current">{meta.title}</span>
      </div>

      {/* IBM badge */}
      <div className="topbar-ibm-badge">
        <FiZap size={11} />IBM Granite
      </div>

      <div className="topbar-actions">
        {/* AI Status */}
        <div className="ai-status-pill">
          <span className="ai-status-dot" />AI Online
        </div>

        {/* Language Switcher */}
        <select
          className="lang-selector"
          value={lang}
          onChange={e => setLang(e.target.value)}
          title="Language"
        >
          {LANGS.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        {/* Notifications */}
        <button className="topbar-icon-btn" aria-label="Notifications" title="Notifications">
          <FiBell size={16} />
          <span className="notif-dot" aria-hidden="true" />
        </button>

        {/* Dark mode */}
        <button
          className="topbar-icon-btn"
          onClick={onToggleDark}
          aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <FiSun size={16} /> : <FiMoon size={16} />}
        </button>

        {/* Avatar */}
        <div className="topbar-avatar" role="img" aria-label="User profile" title="Health User">HU</div>
      </div>
    </header>
  );
}

export default TopBar;

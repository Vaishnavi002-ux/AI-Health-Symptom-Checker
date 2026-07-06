import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiActivity, FiBook, FiPackage, FiFileText, FiClock,
  FiAlertTriangle, FiHeart, FiInfo, FiUser, FiSettings,
  FiHelpCircle, FiTrendingUp, FiCalendar, FiDroplet, FiMoon,
  FiZap, FiUsers, FiRadio, FiStar
} from 'react-icons/fi';

const NAV = [
  {
    section: 'Core',
    items: [
      { to: '/dashboard',    icon: <FiGrid size={16}/>,       label: 'Dashboard'           },
      { to: '/checker',      icon: <FiActivity size={16}/>,   label: 'Symptom Checker', badge: 'AI' },
    ],
  },
  {
    section: 'Health Tools',
    items: [
      { to: '/bmi',          icon: <FiTrendingUp size={16}/>, label: 'BMI Calculator'      },
      { to: '/water',        icon: <FiDroplet size={16}/>,    label: 'Water Tracker'       },
      { to: '/sleep',        icon: <FiMoon size={16}/>,       label: 'Sleep Tracker'       },
      { to: '/analytics',    icon: <FiRadio size={16}/>,      label: 'Health Analytics'    },
      { to: '/mental',       icon: <FiStar size={16}/>,       label: 'Mental Wellness'     },
    ],
  },
  {
    section: 'Knowledge',
    items: [
      { to: '/diseases',     icon: <FiBook size={16}/>,       label: 'Disease Library'     },
      { to: '/medicines',    icon: <FiPackage size={16}/>,    label: 'Medicine Guide'      },
      { to: '/health-tips',  icon: <FiHeart size={16}/>,      label: 'Health Tips'         },
    ],
  },
  {
    section: 'Management',
    items: [
      { to: '/reminders',    icon: <FiCalendar size={16}/>,   label: 'Med Reminders'       },
      { to: '/appointments', icon: <FiCalendar size={16}/>,   label: 'Appointments'        },
      { to: '/family',       icon: <FiUsers size={16}/>,      label: 'Family Profiles'     },
    ],
  },
  {
    section: 'Reports',
    items: [
      { to: '/reports',      icon: <FiFileText size={16}/>,   label: 'Health Reports'      },
      { to: '/history',      icon: <FiClock size={16}/>,      label: 'Consultation History'},
    ],
  },
  {
    section: 'More',
    items: [
      { to: '/profile',      icon: <FiUser size={16}/>,       label: 'My Profile'          },
      { to: '/settings',     icon: <FiSettings size={16}/>,   label: 'Settings'            },
      { to: '/faq',          icon: <FiHelpCircle size={16}/>, label: 'FAQ'                 },
      { to: '/about',        icon: <FiInfo size={16}/>,       label: 'About Project'       },
    ],
  },
];

function Sidebar({ open, mobileOpen, onClose }) {
  const collapsed = !open;
  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`} aria-label="Main navigation">
      {/* Brand */}
      <NavLink to="/dashboard" className="sidebar-brand" onClick={() => onClose && onClose()}>
        <div className="brand-icon">
          <FiZap size={17} color="#fff" />
        </div>
        <div className="brand-text-wrap">
          <div className="brand-name">Health<span style={{ color: '#58a6ff' }}>AI</span></div>
          <div className="brand-sub">IBM Granite · watsonx.ai</div>
        </div>
      </NavLink>

      {/* Navigation */}
      <nav className="sidebar-nav" role="navigation">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => onClose && onClose()}
                title={collapsed ? item.label : undefined}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.badge && <span className="nav-badge-pill">{item.badge}</span>}
              </NavLink>
            ))}
          </div>
        ))}

        <div className="sidebar-section-label">Safety</div>
        <NavLink
          to="/emergency"
          className={({ isActive }) => `nav-item emergency-nav${isActive ? ' active' : ''}`}
          onClick={() => onClose && onClose()}
          title={collapsed ? 'Emergency Help' : undefined}
        >
          <span className="nav-icon"><FiAlertTriangle size={16} /></span>
          <span className="nav-label">Emergency Help</span>
        </NavLink>
        <NavLink
          to="/hospitals"
          className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          onClick={() => onClose && onClose()}
          title={collapsed ? 'Nearby Hospitals' : undefined}
        >
          <span className="nav-icon"><FiRadio size={16} /></span>
          <span className="nav-label">Nearby Hospitals</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-content">
          <div className="ai-online-dot" />
          <div className="sidebar-footer-text">
            <div style={{ fontWeight: 700, fontSize: '.72rem', color: '#58a6ff' }}>IBM Granite AI</div>
            <div>ibm/granite-3-8b · Online</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

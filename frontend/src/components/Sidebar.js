import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FiGrid, FiActivity, FiBook, FiPackage, FiFileText,
  FiClock, FiAlertTriangle, FiHeart, FiCpu
} from 'react-icons/fi';

const NAV = [
  {
    section: 'Main',
    items: [
      { to: '/dashboard',  icon: <FiGrid />,         label: 'Dashboard' },
      { to: '/checker',    icon: <FiActivity />,     label: 'Symptom Checker' },
    ],
  },
  {
    section: 'Knowledge',
    items: [
      { to: '/diseases',   icon: <FiBook />,         label: 'Disease Library' },
      { to: '/medicines',  icon: <FiPackage />,      label: 'Medicine Guide' },
      { to: '/health-tips',icon: <FiHeart />,        label: 'Health Tips' },
    ],
  },
  {
    section: 'Reports',
    items: [
      { to: '/reports',    icon: <FiFileText />,     label: 'AI Report Generator' },
      { to: '/history',    icon: <FiClock />,        label: 'Consultation History' },
    ],
  },
];

function Sidebar({ open, mobileOpen, onClose }) {
  const collapsed = !open;

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <FiCpu size={20} color="#78a9ff" />
        <span className="brand-text">Health<strong style={{ color: '#78a9ff' }}>AI</strong></span>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {NAV.map(group => (
          <div key={group.section}>
            <div className="sidebar-section-label">{group.section}</div>
            {group.items.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' active' : ''}`
                }
                onClick={() => onClose && onClose()}
                title={collapsed ? item.label : undefined}
              >
                {item.icon}
                <span className="nav-label">{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}

        {/* Emergency — always visible */}
        <div className="sidebar-section-label">Safety</div>
        <NavLink
          to="/emergency"
          className={({ isActive }) =>
            `nav-item emergency-nav${isActive ? ' active' : ''}`
          }
          onClick={() => onClose && onClose()}
          title={collapsed ? 'Emergency Help' : undefined}
        >
          <FiAlertTriangle />
          <span className="nav-label">Emergency Help</span>
        </NavLink>
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-footer-text">
          Powered by IBM Granite
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

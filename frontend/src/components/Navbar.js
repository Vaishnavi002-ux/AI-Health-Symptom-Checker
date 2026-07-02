import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FiSun, FiMoon, FiActivity } from 'react-icons/fi';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/checker', label: 'Symptom Checker' },
  { to: '/emergency', label: 'Emergency' },
  { to: '/history', label: 'History' },
  { to: '/contact', label: 'Contact' },
];

function Navbar({ darkMode, toggleDark }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-inner">
          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <FiActivity />
            <span>Health<b style={{ color: 'var(--primary)' }}>AI</b></span>
          </Link>

          {/* Desktop navigation */}
          <ul className={`navbar-nav ${menuOpen ? 'open' : ''}`}>
            {NAV_LINKS.map(link => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="navbar-actions">
            <button
              className="btn-icon"
              onClick={toggleDark}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <Link to="/checker" className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
              Check Symptoms
            </Link>
            {/* Hamburger */}
            <button
              className="hamburger"
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle navigation"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

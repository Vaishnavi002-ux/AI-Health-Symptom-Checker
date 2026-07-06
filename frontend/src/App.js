import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

// Existing pages (preserved)
import DashboardPage from './pages/DashboardPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import DiseaseLibraryPage from './pages/DiseaseLibraryPage';
import MedicineGuidePage from './pages/MedicineGuidePage';
import ReportGeneratorPage from './pages/ReportGeneratorPage';
import ConsultationHistoryPage from './pages/ConsultationHistoryPage';
import EmergencyPage from './pages/EmergencyPage';
import HealthTipsPage from './pages/HealthTipsPage';
import AboutPage from './pages/AboutPage';

// New feature pages
import BMIPage from './pages/BMIPage';
import WaterTrackerPage from './pages/WaterTrackerPage';
import SleepTrackerPage from './pages/SleepTrackerPage';
import HealthAnalyticsPage from './pages/HealthAnalyticsPage';
import MentalWellnessPage from './pages/MentalWellnessPage';
import MedicineRemindersPage from './pages/MedicineRemindersPage';
import AppointmentSchedulerPage from './pages/AppointmentSchedulerPage';
import FamilyProfilesPage from './pages/FamilyProfilesPage';
import NearbyHospitalsPage from './pages/NearbyHospitalsPage';
import UserProfilePage from './pages/UserProfilePage';
import SettingsPage from './pages/SettingsPage';
import FAQPage from './pages/FAQPage';

import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('healthai-theme') === 'dark'
  );
  const [sidebarOpen, setSidebarOpen]   = useState(true);
  const [sidebarMobile, setSidebarMobile] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('healthai-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handler = () => {
      if (window.innerWidth < 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
        setSidebarMobile(false);
      }
    };
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const toggleSidebar = () => {
    if (window.innerWidth < 900) {
      setSidebarMobile(o => !o);
    } else {
      setSidebarOpen(o => !o);
    }
  };

  return (
    <Router>
      <div className={`app-shell ${sidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {sidebarMobile && (
          <div className="sidebar-overlay" onClick={() => setSidebarMobile(false)} />
        )}

        <Sidebar
          open={sidebarOpen}
          mobileOpen={sidebarMobile}
          onClose={() => setSidebarMobile(false)}
        />

        <div className="app-main">
          <TopBar
            onToggleSidebar={toggleSidebar}
            darkMode={darkMode}
            onToggleDark={() => setDarkMode(d => !d)}
          />
          <div className="app-content">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* ── Core ─────────────────────────────── */}
              <Route path="/dashboard"    element={<DashboardPage />} />
              <Route path="/checker"      element={<SymptomCheckerPage />} />

              {/* ── Knowledge ────────────────────────── */}
              <Route path="/diseases"     element={<DiseaseLibraryPage />} />
              <Route path="/medicines"    element={<MedicineGuidePage />} />
              <Route path="/health-tips"  element={<HealthTipsPage />} />

              {/* ── Health Tools (new) ────────────────── */}
              <Route path="/bmi"          element={<BMIPage />} />
              <Route path="/water"        element={<WaterTrackerPage />} />
              <Route path="/sleep"        element={<SleepTrackerPage />} />
              <Route path="/analytics"    element={<HealthAnalyticsPage />} />
              <Route path="/mental"       element={<MentalWellnessPage />} />

              {/* ── Management (new) ─────────────────── */}
              <Route path="/reminders"    element={<MedicineRemindersPage />} />
              <Route path="/appointments" element={<AppointmentSchedulerPage />} />
              <Route path="/family"       element={<FamilyProfilesPage />} />

              {/* ── Reports ──────────────────────────── */}
              <Route path="/reports"      element={<ReportGeneratorPage />} />
              <Route path="/history"      element={<ConsultationHistoryPage />} />

              {/* ── Safety ───────────────────────────── */}
              <Route path="/emergency"    element={<EmergencyPage />} />
              <Route path="/hospitals"    element={<NearbyHospitalsPage />} />

              {/* ── Account & More ───────────────────── */}
              <Route path="/profile"      element={<UserProfilePage />} />
              <Route path="/settings"     element={<SettingsPage />} />
              <Route path="/faq"          element={<FAQPage />} />
              <Route path="/about"        element={<AboutPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

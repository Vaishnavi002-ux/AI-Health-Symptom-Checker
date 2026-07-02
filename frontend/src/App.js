import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import DashboardPage from './pages/DashboardPage';
import SymptomCheckerPage from './pages/SymptomCheckerPage';
import DiseaseLibraryPage from './pages/DiseaseLibraryPage';
import MedicineGuidePage from './pages/MedicineGuidePage';
import ReportGeneratorPage from './pages/ReportGeneratorPage';
import ConsultationHistoryPage from './pages/ConsultationHistoryPage';
import EmergencyPage from './pages/EmergencyPage';
import HealthTipsPage from './pages/HealthTipsPage';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('healthai-theme') === 'dark'
  );
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarMobile, setSidebarMobile] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('healthai-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Collapse sidebar on small screens
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
        {/* Mobile overlay */}
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
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/checker" element={<SymptomCheckerPage />} />
              <Route path="/diseases" element={<DiseaseLibraryPage />} />
              <Route path="/medicines" element={<MedicineGuidePage />} />
              <Route path="/reports" element={<ReportGeneratorPage />} />
              <Route path="/history" element={<ConsultationHistoryPage />} />
              <Route path="/emergency" element={<EmergencyPage />} />
              <Route path="/health-tips" element={<HealthTipsPage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;

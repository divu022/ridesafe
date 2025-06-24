import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppProvider, useApp } from './contexts/AppContext';
import Navbar from './components/Layout/Navbar';
import HomePage from './components/Home/HomePage';
import BookingPage from './components/Booking/BookingPage';
import SettingsPage from './components/Settings/SettingsPage';
import ProfilePage from './components/Profile/ProfilePage';
import AuthPage from './components/Auth/AuthPage';
import SOSButton from './components/SOS/SOSButton';

const AppContent: React.FC = () => {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Apply theme to body
    document.body.className = state.theme === 'dark' ? 'dark' : '';
  }, [state.theme]);

  if (!state.isAuthenticated) {
    return <AuthPage />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage />;
      case 'book':
        return <BookingPage />;
      case 'settings':
        return <SettingsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className={`font-sans ${state.theme === 'dark' ? 'dark' : ''}`}>
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main>
        {renderActiveTab()}
      </main>
      <SOSButton />
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;
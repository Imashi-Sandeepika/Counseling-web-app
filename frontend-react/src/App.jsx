import React from 'react';
import { useStore } from './context/StoreContext';
import Header from './components/Header';
import LandingLogin from './views/LandingLogin';
import Home from './views/Home';
import Resources from './views/Resources';
import Chat from './views/Chat';
import Counselors from './views/Counselors';
import Settings from './views/Settings';
import Notifications from './views/Notifications';
import RegisterCounselor from './views/RegisterCounselor';
import Feedback from './views/Feedback';
import ForgotPassword from './views/ForgotPassword';
import AdminDashboard from './views/AdminDashboard';
import CounselorDashboard from './views/CounselorDashboard';


import Privacy from './views/Privacy';
import Terms from './views/Terms';
import CounselorTask from './views/CounselorTask';
import LiveSession from './views/LiveSession';

const App = () => {
  const { activeView } = useStore();

  const renderView = () => {
    switch (activeView) {
      case 'landing-login': return <LandingLogin />;
      case 'home': return <Home />;
      case 'notifications': return <Notifications />;
      case 'resources': return <Resources />;
      case 'chat': return <Chat />;
      case 'counselors': return <Counselors />;
      case 'settings': return <Settings />;
      case 'register-counselor': return <RegisterCounselor />;
      case 'feedback': return <Feedback />;
      case 'forgot-password': return <ForgotPassword />;
      case 'admin-dashboard': return <AdminDashboard />;
      case 'counselor-dashboard': return <CounselorDashboard />;

      case 'privacy': return <Privacy />;
      case 'terms': return <Terms />;
      case 'counselor-task': return <CounselorTask />;
      case 'live-session': return <LiveSession />;

      default: return <LandingLogin />;
    }
  };

  return (
    <div className="app-container">
      <Header />
      <main>
        {renderView()}
      </main>
      <footer>
        <div style={{ marginBottom: '10px' }}>&copy; 2026 PsyCare Mental Health Platform</div>
        <div style={{ fontSize: '0.8em', color: 'var(--muted)' }}>
          Life decisions? App advice is just a guide. Always think twice.
        </div>
      </footer>
    </div>
  );
};

export default App;

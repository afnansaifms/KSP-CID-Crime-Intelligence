import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Login    from './pages/Login';
import Dashboard from './pages/Dashboard';
import Chat     from './pages/Chat';
import Network  from './pages/Network';
import Heatmap  from './pages/Heatmap';
import Analytics from './pages/Analytics';
import Profile  from './pages/Profile';
import Forecast from './pages/Forecast';
import Financial from './pages/Financial';

function Guard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Guard><AppLayout /></Guard>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat"      element={<Chat />} />
          <Route path="network"   element={<Network />} />
          <Route path="heatmap"   element={<Heatmap />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="profile"   element={<Profile />} />
          <Route path="forecast"  element={<Forecast />} />
          <Route path="financial" element={<Financial />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
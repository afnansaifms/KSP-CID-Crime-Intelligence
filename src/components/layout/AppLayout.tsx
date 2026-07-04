import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function AppLayout() {
  return (
    <div style={{ display:'flex', height:'100vh', overflow:'hidden', background:'var(--bg-base)' }}>
      <Sidebar />
      <div style={{ display:'flex', flexDirection:'column', flex:1, overflow:'hidden' }}>
        <Header />
        <main style={{ flex:1, overflowY:'auto', padding:'28px 28px' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
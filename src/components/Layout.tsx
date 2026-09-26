import { Link, Outlet, useLocation } from 'react-router-dom';
import { Package, LayoutDashboard, ArrowRightLeft, History, LogOut, User } from 'lucide-react';

const Layout = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard /> },
    { name: 'Products', path: '/products', icon: <Package /> },
    { name: 'Operations', path: '/operations', icon: <ArrowRightLeft /> },
    { name: 'Move History', path: '/history', icon: <History /> },
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <Package size={28} color="var(--primary)" />
          <span>StockMaster</span>
        </div>
        
        <ul className="nav-list">
          {navItems.map((item) => (
            <li className="nav-item" key={item.name}>
              <Link 
                to={item.path} 
                className={`nav-link ${location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/') ? 'active' : ''}`}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: 'auto', padding: '0 16px' }}>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            <User /> My Profile
          </Link>
          <Link to="/login" className="nav-link text-muted" style={{ marginTop: '4px' }}>
            <LogOut /> Logout
          </Link>
        </div>
      </aside>

      <main className="main-content">
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;

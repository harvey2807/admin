import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users } from 'lucide-react';
import '../styles/Admin.css';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        ADMIN PANEL
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/admin" className="nav-item">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/accounts" className="nav-item">
          <Users size={20} />
          <span>Quản lý Account</span>
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
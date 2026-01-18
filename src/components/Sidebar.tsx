import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut, UserCircle } from 'lucide-react';
import '../styles/Admin.css';
import { PATHS } from '../constants/paths';

const Sidebar: React.FC = () => {
  const [isUsername, setUserName] = useState<string | null >(null)
  const navigate = useNavigate();

   const logout = async () => {
      if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
        try {
          localStorage.clear();
          alert("Đăng xuất thành công!");
          navigate(PATHS.LOGIN);
        } catch (error) {
          alert("Đăng xuất thất bai!");
        }
      }
    };

  useEffect( ()=>{
    setUserName(localStorage.getItem("username"));
  }, [])

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        ADMIN PANEL
      </div>

      {/* Phần thông tin User */}
      <div className="user-profile">
        <UserCircle size={40} strokeWidth={1.5} />
        <div className="user-info">
          <p className="user-name">{isUsername || 'Admin'}</p>
          <p className="user-role">Quản trị viên</p>
        </div>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/admin" className="nav-item" end>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/accounts" className="nav-item">
          <Users size={20} />
          <span>Quản lý Account</span>
        </NavLink>
      </nav>

      {/* Nút Logout nằm dưới cùng */}
      <div className="sidebar-footer">
        <button className="logout-button" onClick={logout}>
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
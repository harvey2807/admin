import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import '../styles/Admin.css';

const AdminLayout: React.FC = () => {
  return (
    <div className="admin-container">
      <Sidebar />

      <div className="main-content">
        <main className="page-body">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Accounts from './features/users/Accounts';
import { PATHS } from './constants/paths';
import LoginPage from './features/auth/LoginPage';
import type { JSX } from 'react';

// Thành phần bảo vệ Route
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem("userToken");
  
  // Nếu không có token, chuyển hướng về trang login ngay lập tức
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  return children;
};
const Dashboard = () => <h1>Chào mừng tới Dashboard</h1>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={PATHS.LOGIN} element={<LoginPage />} />

        {/* Route cha */}
        <Route 
          path={PATHS.ADMIN} 
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
        </Route>

        <Route path="*" element={<Navigate to="/admin/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
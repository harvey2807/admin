import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authController } from "../../features/auth/authController";
import "../../styles/LoginPage.css";

const LoginPage: React.FC = () => {
    const [user, setUser] = useState("");
    const [pass, setPass] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!user || !pass) return alert("Vui lòng nhập đủ thông tin");
        setLoading(true);
        const result = await authController.handleLogin(user, pass);
        setLoading(false);
        if (result.success) {
            navigate("/admin");
        } else {
            alert("Sai tài khoản hoặc mật khẩu");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Hệ thống Quản trị Modis</h2>

                <div className="login-form">
                    <div className="form-group">
                        <label id="labelUsername">Username</label>
                        <input
                            className="login-input"
                            placeholder="Username"
                            value={user}
                            onChange={(e) => setUser(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label id="labelPwd">Password</label>
                        <input
                            className="login-input"
                            type="password"
                            placeholder="Password"
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                        />
                    </div>
                </div>

                <button 
                    className="login-button" 
                    onClick={handleLogin} 
                    disabled={loading}
                >
                    {loading ? "Đang xác thực..." : "Đăng nhập"}
                </button>

                <p className="login-footer">
                    Quên mật khẩu? <Link to="/forgot-password">Liên hệ Admin</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
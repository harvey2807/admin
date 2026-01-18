import { authService } from "../../features/auth/authService";
import type { LoginRequest } from "../../types/auth";


export const authController = {
    handleLogin: async (username: string, password: string) => {
        try {
            const rq: LoginRequest = { username, password };
            const data = await authService.login(rq);
            if (!data?.token) {
            return { success: false, message: 'Dữ liệu trả về không hợp lệ' };
            }
            localStorage.setItem("userToken", data.token);
            localStorage.setItem("userId", data.userId);
            localStorage.setItem("username", data.username);
            return { success: true };
        }  catch (error: any) {
            const msg =
            error.response?.data?.message ||
            'Tài khoản hoặc mật khẩu không chính xác';
            return { success: false, message: msg };
        }
    }
};
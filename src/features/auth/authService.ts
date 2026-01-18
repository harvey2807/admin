import apiClient from "../../api/config";
import type { LoginRequest, LoginResponse } from "../../types/auth";

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        console.log("URL đang gọi:", apiClient.defaults.baseURL + "/login"); 
        const response = await apiClient.post('/login', data);
        return response.data; 
    },

    register: async (userData: any) => {
        const response = await apiClient.post("register", userData);
        return response.data;
    }
};
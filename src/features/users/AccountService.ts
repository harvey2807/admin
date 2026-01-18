import apiClient from '../../api/config';

export const userService = {
    getAll: async () => {
        const response = await apiClient.get(`/accounts/getAccounts`)
        return response.data;
    },

    // Xóa tài khoản
    delete: async (id: string) => {
        const response = await apiClient.delete(`admin/accounts/${id}`)
        return response.data;
    }
};
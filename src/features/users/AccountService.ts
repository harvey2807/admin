import apiClient from '../../api/config';

export const userService = {
    getAll: async () => {
        const response = await apiClient.get(`/accounts/getAccounts`)
        return response.data;
    },

    // Xóa tài khoản
    delete: async (id: string) => {
        const response = await apiClient.delete(`accounts/${id}`)
        return response.data;
    },

    updateUser: async (id: string, formData: FormData) => {
        try {
        const response = await apiClient.put(`/accounts/updateUser/${id}`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
        } catch (error) {
            console.error("Service Error - Update:", error);
        throw error;
     }
    },
};
import { userService } from '../users/AccountService';

export const accountController = {
    getUsers: async () => {
        try {
            return await userService.getAll();
        } catch (error) {
            console.error("Controller Error - fetch:", error);
            throw error;
        }
    },

    deleteUser: async (id: string) => {
        try {
            return await userService.delete(id);
        } catch (error) {
            console.error("Controller Error - delete:", error);
            throw error;
        }
    },

    updateUser: async (id: string) => {
        try {
            return await userService.getAll();
        } catch (error) {
            console.error("Controller Error - fetch:", error);
            throw error;
        }
    },

};
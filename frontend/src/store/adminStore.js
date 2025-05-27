import { create } from 'zustand';
import { adminAPI } from '@/api/api';

export const useAdminStore = create((set) => ({
  users: [],
  isLoading: false,
  error: null,

  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.getAllUsers();
      set({ users: response.data.data, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  changeRole: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await adminAPI.changeRole(userId);
      return response;
    } catch (error) {
      set({ error, isLoading: false });
      console.error('Error changing user role:', error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 
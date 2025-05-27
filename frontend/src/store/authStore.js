import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { authAPI } from "@/api/api";

export const useAuthStore = create(
  persist(
    (set) => ({
      authUser: null,
      isSigningUp: false,
      isLoggingIn: false,
      isCheckingAuth: false,

      checkAuth: async () => {
        set({ isCheckingAuth: true });
        try {
          const response = await authAPI.checkAuth();
          set({ authUser: response.data.userData });
        } catch (error) {
          console.error("Auth check error:", error);
          set({ authUser: null });
        } finally {
          set({ isCheckingAuth: false });
        }
      },

      signup: async (userData) => {
        set({ isSigningUp: true });
        try {
          const response = await authAPI.signup(userData);
          set({ authUser: response.data.userData });
          toast.success("Signup successful");
        } catch (error) {
          console.error("Signup error:", error);
          toast.error(error.response?.data?.message || "Signup failed");
          throw error;
        } finally {
          set({ isSigningUp: false });
        }
      },

      login: async (userData) => {
        set({ isLoggingIn: true });
        try {
          const response = await authAPI.login(userData);
          set({ authUser: response.data.userData });
          toast.success("Login successful");
        } catch (error) {
          console.error("Login error:", error);
          toast.error(error.response?.data?.message || "Login failed");
          throw error;
        } finally {
          set({ isLoggingIn: false });
        }
      },

      logout: async () => {
        try {
          await authAPI.logout();
          set({ authUser: null });
          toast.success("Logout successful");
        } catch (error) {
          console.error("Logout error:", error);
          toast.error("Logout failed");
          throw error;
        }
      },
    }),
    {
      name: "auth-storage", // unique name for localStorage
      partialize: (state) => ({ authUser: state.authUser }), // only persist authUser
    }
  )
);

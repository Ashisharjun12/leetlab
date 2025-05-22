import { axiosInstance } from "@/api/api";
import { create } from "zustand";
import { toast } from "sonner";

export const useAuthStore = create((set) => ({
  authUser: null,
  isSigniUp: false,
  isLoggingIn: false,
  isCheckingAuth: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const response = await axiosInstance.get("/auth/check");
      console.log("response check auth", response.data);
      set({ authUser: response.data.userData });
    } catch (error) {
      console.log("error", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (userData) => {
    set({ isSigningUp: true });
    try {
      const response = await axiosInstance.post("/auth/register", userData);
      set({ authUser: response.data.userData });
      toast.success("Signup successful");
      console.log("response signup", response.data);
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const response = await axiosInstance.post("/auth/login", userData);
      set({ authUser: response.data.userData });
      console.log("lognin red",response)
      toast.success("Login successful");
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logout successful");
    } catch (error) {
      console.log("error", error);
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));

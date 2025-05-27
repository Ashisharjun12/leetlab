import { create } from "zustand";
import { problemAPI } from "@/api/api";
import { toast } from "sonner";

export const useProblemStore = create((set) => ({
  problems: [],
  currentProblem: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isLoading: false,

  createProblem: async (problemData) => {
    set({ isCreating: true });
    try {
      const response = await problemAPI.createProblem(problemData);
      toast.success("Problem created successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating problem");
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  updateProblem: async (id, problemData) => {
    set({ isUpdating: true });
    try {
      const response = await problemAPI.updateProblem(id, problemData);
      toast.success("Problem updated successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating problem");
      throw error;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteProblem: async (id) => {
    set({ isDeleting: true });
    try {
      const response = await problemAPI.deleteProblem(id);
      toast.success("Problem deleted successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting problem");
      throw error;
    } finally {
      set({ isDeleting: false });
    }
  },

  getProblem: async (id) => {
    set({ isLoading: true });
    try {
      const response = await problemAPI.getProblem(id);
      set({ currentProblem: response.data.data });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching problem");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  getAllProblems: async () => {
    set({ isLoading: true });
    try {
      const response = await problemAPI.getAllProblems();
      set({ problems: response.data.data });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching problems");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
}));

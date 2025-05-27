import { create } from "zustand";
import { companyAPI } from "@/api/api";
import { toast } from "sonner";

export const useCompanyStore = create((set) => ({
  companies: [],
  isCreating: false,
  isLoading: false,

  createCompany: async (companyData) => {
    set({ isCreating: true });
    try {
      const response = await companyAPI.createCompany(companyData);
      toast.success("Company created successfully");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error creating company");
      throw error;
    } finally {
      set({ isCreating: false });
    }
  },

  getAllCompanies: async () => {
    set({ isLoading: true });
    try {
      const response = await companyAPI.getAllCompanies();
      set({ companies: response.data.data });
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching companies");
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
})); 
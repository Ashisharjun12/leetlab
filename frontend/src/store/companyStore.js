import { create } from "zustand";
import { persist } from "zustand/middleware";
import { companyAPI } from "@/api/api";
import { toast } from "sonner";

export const useCompanyStore = create(
  persist(
    (set, get) => ({
      companies: [],
      companyMap: {}, // Map of companyId to company details
      isCreating: false,
      isLoading: false,

      createCompany: async (companyData) => {
        set({ isCreating: true });
        try {
          const response = await companyAPI.createCompany(companyData);
          const newCompany = response.data.data;
          
          // Update both companies array and companyMap
          set((state) => ({
            companies: [...state.companies, newCompany],
            companyMap: {
              ...state.companyMap,
              [newCompany.id]: {
                name: newCompany.name,
                url: newCompany.companyUrl?.url?.url || null
              }
            }
          }));
          
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
          const companies = response.data.data;
          
          // Create companyMap from companies array
          const companyMap = companies.reduce((acc, company) => {
            acc[company.id] = {
              name: company.name,
              url: company.companyUrl?.url?.url || null
            };
            return acc;
          }, {});
          
          set({ companies, companyMap });
          return response.data;
        } catch (error) {
          toast.error(error.response?.data?.message || "Error fetching companies");
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Get company details by ID (from cache or fetch if needed)
      getCompanyById: async (companyId) => {
        // Check if we already have the company data
        if (get().companyMap[companyId]) {
          return get().companyMap[companyId];
        }

        try {
          const response = await companyAPI.getCompanyById(companyId);
          const company = response.data.data;
          
          // Update companyMap with new company data
          set((state) => ({
            companyMap: {
              ...state.companyMap,
              [companyId]: {
                name: company.name,
                url: company.companyUrl?.url?.url || null
              }
            }
          }));
          
          return {
            name: company.name,
            url: company.companyUrl?.url?.url || null
          };
        } catch (error) {
          console.error("Error fetching company by id", companyId, error);
          return null;
        }
      },

      // Get company details from cache
      getCompanyFromCache: (companyId) => {
        return get().companyMap[companyId] || null;
      },

      // Clear company data
      clearCompanyData: () => {
        set({ companies: [], companyMap: {} });
      }
    }),
    {
      name: 'company-storage', // unique name for localStorage
      partialize: (state) => ({ 
        companies: state.companies,
        companyMap: state.companyMap
      })
    }
  )
); 
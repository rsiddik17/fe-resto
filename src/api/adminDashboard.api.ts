import { axiosInstance } from "../lib/axios";

export interface DashboardFilters {
 startDate?: string;   // ← ganti dari start_date
  endDate?: string;
}

export const adminDashboardAPI = {
  // Get dashboard summary & top menus
  getDashboard: async (filters?: DashboardFilters) => {
    const response = await axiosInstance.get("/admin/dashboard", {
      params: filters,
    });
    return response.data;
  },
};
import { axiosInstance } from "../lib/axios";

export interface ReportFilters {
  reportCategory?: "orders" | "revenue" | "menu";
  type?: "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  months?: number[];  // multiple bulan
  page?: number;
  limit?: number;
}

export const adminReportsAPI = {
  getReports: async (filters?: ReportFilters) => {
    const params: any = { ...filters };
    
    // Handle months array menjadi multiple parameter
     if (params.months && Array.isArray(params.months)) {
      // Hapus months dari params, lalu tambahkan masing-masing sebagai parameter terpisah
      const monthsArray = [...params.months];
      delete params.months;
      // Tambahkan setiap bulan sebagai parameter 'months' yang terpisah
      monthsArray.forEach(month => {
        if (!params.months) params.months = [];
        params.months.push(month);
      });
    }
    
    const response = await axiosInstance.get("/admin/reports", {
      params,
    });
    return response.data;
  },
};
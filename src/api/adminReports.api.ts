import { axiosInstance } from "../lib/axios";

export interface ReportFilters {
  reportCategory?: "orders" | "revenue" | "menu";
  type?: "daily" | "weekly" | "monthly";
  startDate?: string;
  endDate?: string;
  month?: number;
  year?: number;
  months?: number[];
  page?: number;
  limit?: number;
}

export const adminReportsAPI = {
  getReports: async (filters?: ReportFilters) => {
    const params: any = {};
    
    if (filters) {
      Object.keys(filters).forEach(key => {
        const value = filters[key as keyof ReportFilters];
        
        if (key === 'months' && Array.isArray(value) && value.length > 0) {
          // 🔥 PERBAIKAN: Untuk multi bulan, kirim sebagai multiple parameter (months=3&months=4)
          // Jangan pakai array, karena axios akan mengirim months[]=3&months[]=4
          value.forEach(month => {
            if (!params.months) params.months = [];
            params.months.push(month);
          });
        } else if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }
    
    console.log("📡 Sending params:", params);
    
    const response = await axiosInstance.get("/admin/reports", {
      params,
      paramsSerializer: (params) => {
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
          if (key === 'months' && Array.isArray(params[key])) {
            // ✅ KIRIM SEBAGAI months=3&months=4 (tanpa kurung siku)
            params[key].forEach((value: number) => {
              searchParams.append('months', value.toString());
            });
          } else if (params[key] !== undefined && params[key] !== null) {
            searchParams.append(key, params[key].toString());
          }
        });
        console.log("🔗 Final URL params:", searchParams.toString());
        return searchParams.toString();
      }
    });
    
    return response.data;
  },
};
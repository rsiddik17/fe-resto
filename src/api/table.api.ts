import { axiosInstance } from "../lib/axios";

export interface TableData {
  id: number;
  table_number: string;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "DIRTY";
}

export const tableAPI = {
  // Ambil semua meja
  getAllTables: async () => {
    const response = await axiosInstance.get("/table/");
    return response.data;
  },

  getTableByNumber: async (tableNumber: string) => {
    const response = await axiosInstance.get("/table/", {
      params: { table_number: tableNumber }
    });
    return response.data;
  },

  // Tambah meja baru (Khusus Kasir)
  createTable: async (payload: { table_number: string; capacity: number; status: string }) => {
    const response = await axiosInstance.post("/table/create-tables", payload);
    return response.data;
  },

  // Update meja (Khusus Kasir & Waiter)
  updateTable: async (id: number, payload: Partial<TableData>) => {
    const response = await axiosInstance.put(`/table/update-tables/${id}`, payload);
    return response.data;
  },

  // Hapus meja (Khusus Kasir)
  deleteTable: async (id: number) => {
    const response = await axiosInstance.delete(`/table/delete-tables/${id}`);
    return response.data;
  }
};
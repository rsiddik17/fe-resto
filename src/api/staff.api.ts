import { axiosInstance } from "../lib/axios";

export const staffAPI = {
  getAllStaff: async () => {
    const response = await axiosInstance.get("/admin/staff");
    return response.data;
  },

  getStaffById: async (id: string) => {
    const response = await axiosInstance.get(`/admin/staff/${id}`);
    return response.data;
  },
  createStaff: async (payload: any) => {
    const response = await axiosInstance.post("/admin/register-staff", payload);
    return response.data;
  },

  updateStaff: async (id: string, payload: any) => {
    const response = await axiosInstance.put(
      `/admin/update-staff/${id}`,
      payload,
    );
    return response.data;
  },

  deleteStaff: async (id: string) => {
    const response = await axiosInstance.delete(`/admin/staff/${id}`);
    return response.data;
  },

  getProfile: async () => {
    const response = await axiosInstance.get("/profile/profile-staff");
    return response.data;
  },

  getStaffDetail: async (id: string) => {
    const response = await axiosInstance.get(`/admin/staff/${id}`);
    return response.data;
  },

  updateStaffPassword: async (
    id: string,
    payload: { old_password: string; new_password: string },
  ) => {
    const response = await axiosInstance.patch(
      `/admin/update-staff-password/${id}`,
      payload,
    );
    return response.data;
  },
};

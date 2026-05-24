import { axiosInstance } from "../lib/axios";

export const profileAPI = {
  getStaffProfile: async () => {
    const response = await axiosInstance.get("/profile/profile-staff");
    return response.data;
  },
};
import axiosInstance from '../utils/axiosInstance';

const sortRequests = {
  getTaskCount: async () => {
    const data = await axiosInstance.get(`/drag-drop-content-types/count`);
    return data;
  },
  getSettings: async () => {
    const data = await axiosInstance.get(`/drag-drop-content-types/settings`);
    return data;
  },
  setSettings: async data => {
    return await axiosInstance.post(`/drag-drop-content-types/settings`, {
      body: data,
    });
  },
};
export default sortRequests;
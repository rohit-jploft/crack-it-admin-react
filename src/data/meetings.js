import Axios from 'axios';
import { BASE_URL } from '../constant';

export const getAllMeeting = async (status, limit, page, search) => {
  const meetingData = await Axios.get(`${BASE_URL}booking/get-all?status=${status}&search=${search}&limit=${limit}&page=${page}`);

  return meetingData.data;
};
export const enterChatAdmin = async (meetingId) => {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userId = localStorage.getItem('user');
  const meetingData = await Axios.post(
    `${BASE_URL}chat/enter/admin?meetingId=${meetingId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return meetingData.data;
};
export const getSingleBookingDetail = async (bookingId) => {
  try {
    const res = await Axios.get(`${BASE_URL}booking/single/${bookingId}`);
    return res.data;
  } catch (error) {
    return error;
  }
};

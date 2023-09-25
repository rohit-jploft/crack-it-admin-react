import Axios from 'axios';
import { BASE_URL } from '../constant';

export const getAllMeeting = async (status, limit,page) => {
  const meetingData = await Axios.get(`${BASE_URL}booking/get-all?status=${status}&limit=${limit}&page=${page}`);

  return meetingData.data;
};

import Axios from 'axios';
import { BASE_URL } from '../constant';

export const getBookingPayments = async (status, limit, page) => {
  // if(status) query = query + `?status=${status}`
  const res = await Axios.get(`${BASE_URL}booking/payments?status=${status}&limit=${limit}&page=${page}`);
  return res.data;
};
export const getBookingPaymentsStats = async () => {
  // if(status) query = query + `?status=${status}`
  const res = await Axios.get(`${BASE_URL}admin/payments/stats`);
  return res.data.data;
};

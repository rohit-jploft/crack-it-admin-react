import Axios from 'axios';
import { BASE_URL } from '../constant';

export const getCommission = async () => {
    const data = await Axios.get(`${BASE_URL}commission/get-all?type=FIXED`);
    return data.data.data;
}
export const updateAmount = async (id, amount) => {
    const update = await Axios.put(`${BASE_URL}commission/update/${id}`, {amount})
    return update.data;
}
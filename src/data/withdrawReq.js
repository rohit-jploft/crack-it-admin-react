import Axios from 'axios'
import { BASE_URL } from '../constant';


export const createWithdrawRequest = async (data) => {
    try {
        const res = await Axios.post(`${BASE_URL}wallet/withdrawal/request/create`, {...data}) 
        return res.data;
    } catch (error) {
        return error
    }
}
export const getAllWithDrawal = async (status, page, limit) => {
    try {
        const res = await Axios.get(`${BASE_URL}wallet/withdrawal/get/all?status=${status}&limit=${limit}&page=${page}`) 
        return res.data;
    } catch (error) {
        return error
    }
}
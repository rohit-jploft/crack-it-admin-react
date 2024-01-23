import Axios from 'axios';
import { BASE_URL } from '../constant';


export const getAllTickets = async (status, search) => {
    try {
        const res = await Axios.get(`${BASE_URL}ticket/get-all?status=${status}&search=${search}`)
        return res.data
    } catch (error) {
        return error
    }
}
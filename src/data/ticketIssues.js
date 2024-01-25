import Axios from 'axios';
import { BASE_URL } from '../constant';


export const getAllTickets = async (status, search, page, limit) => {
    try {
        const res = await Axios.get(`${BASE_URL}ticket/get-all?status=${status}&search=${search}&page=${page}$limit=${limit}`)
        return res.data
    } catch (error) {
        return error
    }
}
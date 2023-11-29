import Axios from 'axios'

import { BASE_URL } from "../constant";


export const getAllContactLeads = async (search, page, limit) => {
    try {
        const url = `${BASE_URL}contacts/get/all?search=${search}&limit=${limit}&page=${page}`
        const res = await Axios.get(url) 
        return res.data;
    } catch (error) {
        return error
    }
}
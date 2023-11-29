import Axios from 'axios';
import { BASE_URL } from '../constant';

export const getAllPromoCodes = async (search, isActive, page, limit) => {
  try {
    let url = `${BASE_URL}promo/code/get/all?search=${search}`;
    if (isActive) url += `&isActive=${isActive}`;
    if (limit) url += `&limit=${limit}`;
    if (page) url += `&page=${page}`;
    console.log(url);
    const data = await Axios.get(url);
    return data.data;
  } catch (error) {
    return error;
  }
};
export const createNewPromoCode = async (data) => {
  try {
    const add = await Axios.post(`${BASE_URL}promo/code/create`, { ...data });
    return add.data;
  } catch (error) {
    return error;
  }
};
export const getSinglePromoCodeDetail = async (promoId) => {
  try {
    const add = await Axios.get(`${BASE_URL}promo/code/get/single/${promoId}`);
    return add.data;
  } catch (error) {
    return error;
  }
};
export const updatePromoCode = async (codeId, body) => {
  try {
    const url = `${BASE_URL}promo/code/update/${codeId}`;
    const data = await Axios.put(url, body);
    return data.data;
  } catch (error) {
    return error;
  }
};
export const makeActive = async (codeId, body) => {
  try {
    const url = `${BASE_URL}promo/code/active/${codeId}`;
    const data = await Axios.put(url, body);
    return data.data;
  } catch (error) {
    return error;
  }
};
export const deletePromo = async (codeId, body) => {
  try {
    const url = `${BASE_URL}promo/code/delete/${codeId}`;
    const data = await Axios.put(url, body);
    return data.data;
  } catch (error) {
    return error;
  }
};

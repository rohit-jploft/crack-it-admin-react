import Axios from 'axios';
import { BASE_URL } from '../constant';

export const createCategory = async (data) => {
  const res = Axios.post(`${BASE_URL}category/create`, data);
  return res;
};
export const getCategories = async (parent, search, limit, page) => {
  let url = `${BASE_URL}category/get-all`;
  if (parent && search) {
    url += `?parent=${parent}&search=${search}`;
  }
  if (parent && !search) {
    url += `?parent=${parent}`;
  }
  if (!parent && search) {
    url += `?search=${search}`;
  }
  if (!parent && !search) {
    url += `?limit=${limit}&page=${page}`;
  }
  if (parent || search) url += `&limit=${limit}&page=${page}`;
  console.log(url, 'url');
  const categoriesData = await Axios.get(url);
  return categoriesData?.data;
};

export const deleteCategory = async (categoryId) => {
  let res;
  if (categoryId) {
    res = await Axios.put(`${BASE_URL}category/delete/${categoryId}`);
  }
  return res.data;
};
export const updateCategory = async (id, data) => {
  let res;
  if (id) {
    res = await Axios.put(`${BASE_URL}category/update/${id}`, { title: data.title, parent: data.parent });
  }
  return res;
};

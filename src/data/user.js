import { faker } from '@faker-js/faker';
import Axios from 'axios';
import { sample } from 'lodash';
import { BASE_URL } from '../constant';

// ----------------------------------------------------------------------
export const getUsers = async (role, search, limit, page, isAdmin) => {
  const users = await Axios.get(
    `${BASE_URL}auth/users/all?role=${role}&search=${search}&limit=${limit}&page=${page}&isAdmin=${isAdmin}`
  );
  return users.data;
};
export const createUser = async (data, dailCode, isAdmin) => {
  const body = { ...data, countryCode: `+${dailCode}` };
  if (isAdmin) body.role = 'ADMIN';
  else body.role = 'EXPERT';

  try {
    const createUser = await Axios.post(`${BASE_URL}auth/user/signup`, body);
    return createUser.data;
  } catch (error) {
    return error;
  }
};
export const createNewAgency = async (data, dailCode) => {
  const body = { ...data, countryCode: `+${dailCode}` };
  body.role = 'AGENCY';

  try {
    const createUser = await Axios.post(`${BASE_URL}auth/agency/signup`, body);
    return createUser.data;
  } catch (error) {
    return error;
  }
};
export const isAdmin =  () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  // if (token) {
  //   const userDetail = await Axios.get(`${BASE_URL}auth/user/detail`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   console.log(userDetail, "userDetails")
  //   if (userDetail && userDetail?.data && userDetail?.data?.data.role === 'ADMIN') {
  //     // console.log("isAdmin", true)
  //     return true;
  //   }
  //   return false;
  // }
  // return false;
  if (role === 'ADMIN') {
    return true;
  } 
    return false;

};
export const isSuperAdmin =  () => {
  // const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  // if (token) {
  //   const userDetail = await Axios.get(`${BASE_URL}auth/user/detail`, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  //   if (userDetail && userDetail?.data && userDetail?.data?.data?.role === 'SUPER_ADMIN') {
  //     return true;
  //   }
  //   return false;
  // }
  // return false;
  if (role === 'SUPER_ADMIN') {
    return true;
  } 
    return false;

};
export const suspendAccount = async (userId, isDeleted) => {
  try {
    console.log('isDleted', isDeleted);
    const suspendAccount = await Axios.put(`${BASE_URL}auth/user/delete/${userId}`, {
      isDeleted: !isDeleted,
    });
    return suspendAccount.data;
  } catch (error) {
    return error;
  }
};

export const changePasswordApi = async (data) => {
  const token = localStorage.getItem('token');
  console.log(token);
  if (token) {
    const res = await Axios.post(
      `${BASE_URL}auth/user/change-password`,
      { oldPassword: data.oldPassword, password: data.newPassword },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data;
  }
  return { message: 'Token is missing' };
};

export const getAgencyProfile = async (userId) => {
  try {
    const data = await Axios.get(`${BASE_URL}agency/profile/${userId}`);
    return data.data;
  } catch (error) {
    return error.message;
  }
};
export const getExpertProfile = async (userId) => {
  try {
    const data = await Axios.get(`${BASE_URL}expert/get/profile/${userId}`);
    return data.data;
  } catch (error) {
    return error.message;
  }
};

const users = [...Array(24)].map((_, index) => ({
  id: faker.datatype.uuid(),
  avatarUrl: `/assets/images/avatars/avatar_${index + 1}.jpg`,
  name: faker.name.fullName(),
  company: faker.company.name(),
  isVerified: faker.datatype.boolean(),
  status: sample(['active', 'banned']),
  role: sample([
    'Leader',
    'Hr Manager',
    'UI Designer',
    'UX Designer',
    'UI/UX Designer',
    'Project Manager',
    'Backend Developer',
    'Full Stack Designer',
    'Front End Developer',
    'Full Stack Developer',
  ]),
}));

export default users;

import Axios from 'axios';
import { BASE_URL } from '../constant';

export const getConversation = async () => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    const res = await Axios.get(`${BASE_URL}chat/conversation/user/${userId}`);
    return res.data.data;
  }
  return [];
};
export const sendMessage = async (convoId, msg, audio) => {
  const sender = localStorage.getItem('userId');
  const newFormData = new FormData();
  if (audio) {
    newFormData.append('chat', convoId);
    newFormData.append('sender', sender);
    newFormData.append('type', audio.type);
    newFormData.append('content', msg);
    newFormData.append('audio', audio);
  }
  if (sender) {
    const res = await Axios.post(
      `${BASE_URL}chat/message/send`,
      audio ? newFormData : { chat: convoId, sender, content: msg }
    );
    return res.data.data;
  }
  return [];
};
export const getConvoMessage = async (convoId) => {
  if (convoId) {
    const res = await Axios.get(`${BASE_URL}chat/conversation/messages/${convoId}`);
    return res.data.data;
  }
  return [];
};
export const searchConvoApi = async (search) => {
  if (search) {
    const res = await Axios.get(`${BASE_URL}chat/search?search=${search}`);
    return res.data.data;
  }
  return [];
};

export const getChatFromMeetingId = async (meetingId) => {
  try {
    const res = await Axios.get(`${BASE_URL}chat/get/from/meeting/${meetingId}`)
    console.log(res)
    return res;
  } catch (error) {
    return error
  }
}

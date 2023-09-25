import io from 'socket.io-client';
import { BASE_URL } from '../constant';

const socket = io(BASE_URL); // Replace with your server's URL

export default socket;
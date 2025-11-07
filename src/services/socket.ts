import { io } from "socket.io-client";

const CONECTION_BACK = import.meta.env.VITE_URL_BACK

const socket= io(CONECTION_BACK);

export default socket
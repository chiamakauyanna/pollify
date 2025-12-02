import axios from "axios";

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});


publicApi.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject(error)
);

export default publicApi;

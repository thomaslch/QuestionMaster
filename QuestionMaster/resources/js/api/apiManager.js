import axios from "axios";

let url = "https://thomas-ubuntu.local";



const instance = axios.create({
  baseURL: url
});


instance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

export default instance;
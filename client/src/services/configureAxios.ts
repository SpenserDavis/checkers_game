import axios from "axios";

const configureAxios = (): void => {
  axios.defaults.baseURL = "http://localhost:3090/api";
};

export default configureAxios;

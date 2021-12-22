import axios from "axios";

export const api = axios.create({
  baseURL: "https://rentx-mobile-server.herokuapp.com",
});

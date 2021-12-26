import axios from "axios";

export const api = axios.create({
  // baseURL: "https://rentx-mobile-server.herokuapp.com",
  baseURL: "http://10.0.0.117:3333",
});

import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getRealtors = (page, per_page, token) =>
  instance.post("/getRealtors?page=" + page + "&per_page=" + per_page, {
    token,
  });

export const signin = (username, password) =>
  instance.post("/signin", { username, password });

export const getUserFromToken = (token) =>
  instance.post("/getUserFromToken", { token });

export const getAgentFromId = (id, token) =>
  instance.post("/getAgentFromId", { id, token });

export const updateAgentInfo = (token, id, data) =>
  instance.put("/updateAgentInfo", { token, id, data });

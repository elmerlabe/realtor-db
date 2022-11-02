import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getRealtors = (token, page, per_page, city, state, search) =>
  instance.post(
    "/getRealtors?page=" +
      page +
      "&per_page=" +
      per_page +
      "&city=" +
      city +
      "&state=" +
      state +
      "&search=" +
      search,
    { token }
  );

export const signin = (username, password) =>
  instance.post("/signin", { username, password });

export const getUserFromToken = (token) =>
  instance.post("/getUserFromToken", { token });

export const getAgentFromId = (id, token) =>
  instance.post("/getAgentFromId", { id, token });

export const updateAgentInfo = (token, id, data) =>
  instance.put("/updateAgentInfo", { token, id, data });

export const removeAgent = (token, id) =>
  instance.post("/removeAgent", { token, id });

export const addNewAgent = (token, data) =>
  instance.post("/addNewAgent", { token, data });

export const getStates = () => instance.get("/getStates");

export const getCities = (stateId) =>
  instance.get("/getCities?stateId=" + stateId);

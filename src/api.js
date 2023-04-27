import axios from "axios";

export const apiInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const getRealtors = (
  page,
  per_page,
  city,
  state,
  search,
  selectedColumn
) =>
  apiInstance.post(
    "/getRealtors?page=" +
      page +
      "&per_page=" +
      per_page +
      "&city=" +
      city +
      "&state=" +
      state +
      "&search=" +
      search +
      "&selectedColumn=" +
      selectedColumn
  );

export const signin = (username, password) =>
  apiInstance.post("/signin", { username, password });

export const getUserFromToken = (token) =>
  apiInstance.post("/getUserFromToken", { token });

export const getAgentFromId = (id, token) =>
  apiInstance.post("/getAgentFromId", { id, token });

export const updateAgentInfo = (token, id, data) =>
  apiInstance.put("/updateAgentInfo", { token, id, data });

export const removeAgent = (token, id) =>
  apiInstance.post("/removeAgent", { token, id });

export const addNewAgent = (token, data) =>
  apiInstance.post("/addNewAgent", { token, data });

export const getStates = () => apiInstance.get("/getStates");

export const getCities = (state) =>
  apiInstance.get("/getCities?state=" + state);

export const updateUser = (token, data) =>
  apiInstance.post("/updateUser", { token, data });

export const emailCheck = (email) =>
  apiInstance.get("/emailCheck?email=" + email);

export const getDatabaseSummary = () => apiInstance.get("/getDatabaseSummary");

export const getAgentsPerState = () => apiInstance.get("/getAgentsPerState");

export const getAgentsByState = (state) =>
  apiInstance.get("/getAgentsByState?state=" + state);

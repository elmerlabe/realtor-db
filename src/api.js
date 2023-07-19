import axios from 'axios';

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
    '/getRealtors?page=' +
      page +
      '&per_page=' +
      per_page +
      '&city=' +
      city +
      '&state=' +
      state +
      '&search=' +
      search +
      '&selectedColumn=' +
      selectedColumn
  );

export const signin = (username, password) =>
  apiInstance.post('/signin', { username, password });

export const getUserFromToken = (token) =>
  apiInstance.post('/getUserFromToken', { token });

export const getAgentFromId = (id) =>
  apiInstance.post('/getAgentFromId', { id });

export const updateAgentInfo = (id, data) =>
  apiInstance.put('/updateAgentInfo', { id, data });

export const removeAgent = (id) => apiInstance.post('/removeAgent', { id });

export const addNewAgent = (data) => apiInstance.post('/addNewAgent', { data });

export const getStates = () => apiInstance.get('/getStates');

export const getCities = (state) =>
  apiInstance.get('/getCities?state=' + state);

export const updateUser = (token, data) =>
  apiInstance.post('/updateUser', { token, data });

export const emailCheck = (email) =>
  apiInstance.get('/emailCheck?email=' + email);

export const getDatabaseSummary = () => apiInstance.get('/getDatabaseSummary');

export const getAgentsPerState = (state) =>
  apiInstance.get('/getAgentsPerState/' + state);

export const getAgentsByState = (state) =>
  apiInstance.get('/getAgentsByState?state=' + state);

export const getEmailDomainsCount = (domains) =>
  apiInstance.post('/getEmailDomainsCount', { domains });

export const getStateAgentsCount = (states) =>
  apiInstance.post('/getStateAgentsCount', { states });

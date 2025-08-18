import axios from 'axios';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
})

instance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export const apiGet = (url, params) => {
  return instance.get(url, { params })
}

export const apiPost = (url, data) => {
  return instance.post(url, data);
};

export const apiPut = (url, data) => {
  return instance.put(url, data);
};

export const apiDelete = (url, params) => {
  return instance.delete(url, { params });
};

export const apiPostFormData = (url, data) => {
  return instance.post(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};

export const apiPutFormData = (url, data) => {
  return instance.put(url, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': "*",
      'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
      'Access-Control-Allow-Credentials': true
    },
  });
};




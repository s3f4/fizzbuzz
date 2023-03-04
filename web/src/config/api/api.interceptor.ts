import { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

export const onRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
  const accessToken = localStorage.getItem("accessToken");

  let contentType = "application/json";
  if (config.data instanceof FormData) {
    contentType = "multipart/form-data";
  } else if (config.data instanceof URLSearchParams) {
    contentType = "application/x-www-form-urlencoded";
  }

  if (accessToken) {
    const token = JSON.parse(accessToken)
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    };
  } else {
    config.headers = {
      "Content-Type": contentType,
    };
  }
  return config;
};

export const onRequestError = (error: AxiosError): Promise<AxiosError> => {
  return Promise.reject(error.response);
};

export const onResponse = (response: AxiosResponse): AxiosResponse => {
  return response.data as any;
};

export const onResponseError = (error: AxiosError): Promise<AxiosError> | AxiosError => {
  // toast.error(error.message);
  return Promise.reject(error.message);
};

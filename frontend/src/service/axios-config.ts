import axios, {AxiosError, AxiosResponse, HttpStatusCode} from 'axios';
import translate from '../locale/message.ts';
import {showToast, ToastFactory} from '../component/toast/toast.ts';

export const SERVER_URL = import.meta.env.VITE_REACT_APP_SERVER_URL;
export const FULL_URL = SERVER_URL.startsWith('http')
  ? SERVER_URL
  : `${window.location.origin}${SERVER_URL}`;

const axiosInstance = axios.create({baseURL: SERVER_URL});

interface ErrorResponseData {
  errorCode: number;
  message?: string;
}

const responseErrorInterceptor = async (error: AxiosError<ErrorResponseData>) => {
  if (error.response) {
    const {status, data} = error.response;
    console.log(status, data);

    responseHandler(status);
  } else {
    showToast(ToastFactory.error(translate('connectionError')));
  }
  return Promise.reject(error.response?.data);
};

const responseHandler = (status: number) => {
  switch (status) {
    case HttpStatusCode.ExpectationFailed:
      console.error('handleExpectationFailed');
      break;

    case HttpStatusCode.Unauthorized:
    case HttpStatusCode.Forbidden:
      showToast(ToastFactory.error(translate('unauthorized')));
      break;

    case HttpStatusCode.Ok:
      break;

    default:
      showToast(ToastFactory.error(`${translate('unknownError')}: ${status}`));
      break;
  }
};

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  responseErrorInterceptor
);

export const {get, post, put, delete: del} = axiosInstance;
export default axiosInstance;

import axios from "axios";
import base_Url from "";
import { base_Url } from "../constants/Apibase";

// config-1
// ----------------------------------------------------------------------

// export const URL = "http://localhost:3000/"
// export const URL = "baseurl";
// export const IMG_URL = URL;
// export const callApi = ({
//   path,
//   method = "GET",
//   isForm,
//   url = null,
//   body = null,
//   token = null,
// }) => {
//   let urlString = URL + path;
//   let headers = {
//     ...(isForm
//       ? {}
//       : {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//       }),
//   };
//   let options = {
//     method,
//   };
//   if (token) headers["Authorization"] = "Bearer " + token;
//   options.headers = headers;
//   if (body) options.data = body;
//   if (url) urlString = url;
//   options.url = urlString;
//   return axios(options).then((res) => {
//     if (res.status === 200) {
//       return res.data;
//     }
//     return { status: res.status, ...res.data };
//   });
// };

// config-2
// ----------------------------------------------------------------------

const axiosInstance = axios.create({
  // https://baseurl: "baseurl",
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    );
  }
);

export default axiosInstance;

// config-3
// ---------------------------------------------------------------------

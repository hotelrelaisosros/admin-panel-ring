import Axios from "axios";
import { base_Url } from "../constants/Apibase";


export default class ApiCaller {
  static BearerHeaders = (token) => {
    return token
      ? { Authorization: `Bearer ${token}` }
      : {};
  };

  static async Get(
    url = "",
    token,
    customUrl = ""
  ) {
    try {
      const response = await Axios.get( `${base_Url}${url}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Accept: "application/json",
          ...ApiCaller.BearerHeaders(token),
        },
      });
      return response;
    } catch (err) {
      return err.response;
    }
  }

  static async Post(
    endPoint = "",
    body = {},
    token,
    customUrl = ""
  ) {
    try {


      const response = await Axios.post( `${base_Url}${endPoint}`, body, {
        headers: {
          "Content-Type": "application/json",

          ...ApiCaller.BearerHeaders(token),
        },
      });
    
      return response;
    } catch (err) {
      return err.response;
    }
  }

  static async Put(
    url = "",
    body = {},
    token
  ) {
    try {
      const response = await Axios.put(`${base_Url}${url}`, body, {
        headers: {
          "Content-Type": "application/json",
          ...ApiCaller.BearerHeaders(token),
        },
      });
      return response;
    } catch (err) {
      return err.response;
    }
  }

  static async Delete(
    url = "",
    body = {},
    token
  ) {
    try {
      const response = await Axios.delete(`${base_Url}${url}`, {
        headers: {
          "Content-Type": "application/json",
          ...ApiCaller.BearerHeaders(token),
        },
        data: body,
      });
      return response;
    } catch (err) {
      return err.response;
    }
  }
}

import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setExpirePackage, setPackage } from "./packageSlice";

export class PackageMiddleware extends Component {
  static GetPackage(token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get("/api/package", BearerHeaders);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setPackage(res?.data));
            dispatch(setNetworkError(false));
            console.log("packages found success =>", res);
          } else {
            dispatch(setLoading(false));
            dispatch(setPackage(res?.data));
            dispatch(setNetworkError(false));
            reject(res);
            console.log("packages found error =>", res);
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
  static CreatePackage(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/add/package",
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            resolve(res);
            dispatch(setNetworkError(false));
          } else {
            reject(res);
            dispatch(setNetworkError(false));
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
  static UpdatePackage(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/update/package",
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            resolve(res);

            dispatch(setNetworkError(false));
          } else {
            reject(res);

            dispatch(setNetworkError(false));
          }
        } catch (error) {
          reject(false);
          dispatch(setNetworkError(true));
        }
      });
    };
  }
  static DeletePackage({ id }, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/delete/package",
            { id: id },
            BearerHeaders
          );
          if (res.data.status) {
            resolve(res);

            dispatch(setNetworkError(false));
          } else {
            reject(res);

            dispatch(setNetworkError(false));
          }
        } catch (error) {
          reject(false);
          dispatch(setNetworkError(true));
        }
      });
    };
  }
  static ExpirePackage(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
          "/api/subscription/expired",
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setExpirePackage(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setExpirePackage(res?.data));

            dispatch(setNetworkError(false));
          }
        } catch (error) {
          reject(false);
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
        }
      });
    };
  }
}

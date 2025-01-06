import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setImages } from "./homePageImageSlice";

export class HomeImageMiddleware extends Component {
  static GetHomeImage({ section, is_app, role }, token) {
    console.log(is_app);
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/api/homePageImage/${section}/${is_app}/${role}`,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setImages(res?.data));

            dispatch(setNetworkError(false));
            console.log("Home image found success =>", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setImages(res?.data));

            dispatch(setNetworkError(false));
            console.log("Home image found error =>", res);
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
  static AddHomeImage(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/add/homePageImage",
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
  static UpdateHomeImage(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/update/homePageImage",
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
  static DeleteHomeImage({ id }, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/delete/homePageImage",
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
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
}

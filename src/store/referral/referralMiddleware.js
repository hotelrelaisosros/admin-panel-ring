import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setReferrals } from "./referralSlice";

export class ReferralMiddleware extends Component {
  static GetReferralUser(token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get("/api/referralUser", BearerHeaders);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setReferrals(res?.data));
            console.log("referral fetched =>", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            console.log("referral not fetched =>", res);
          }
        } catch (error) {
          reject(false);
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
        }
      });
    };
  }
  static AddReferralUser(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/add/referralUser",
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
  static UpdateReferralUser(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/update/referralUser",
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
  static DeleteReferral({ id }, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/api/delete/referralUser/${id}`,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setReferrals(res?.data));
            console.log("referral fetched After Delete =>", res);
            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setReferrals(res?.data));
            console.log("referral not fetched After Delete=>", res);
            dispatch(setNetworkError(false));
            console.log("res", res);
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
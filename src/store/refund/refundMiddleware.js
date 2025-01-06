import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setRefund } from "./refundSlice";

export class RefundMiddleware extends Component {
  static GetRefundUser(token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get("/api/get/refund/order", BearerHeaders);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setRefund(res?.data));
            console.log("refund fetched =>", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            console.log("refund not fetched =>", res);
          }
        } catch (error) {
          reject(false);
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
        }
      });
    };
  }

  static RefundCard(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/jazzcash/card/refund",
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

  static RefundMobile(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/jazzcash/mobile/refund",
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
}

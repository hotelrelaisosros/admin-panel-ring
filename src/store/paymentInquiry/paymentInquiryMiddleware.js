import { Component } from "react";
import ApiCaller from "../../utils/ApiCaller";
import { setLoading, setNetworkError } from "../common/commonSlice";
import { setPaymentInquiry } from "./paymentInquirySlice";

export class paymentInquiryMiddleware extends Component {
  static GetInquiryData(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/api/payment/inquiry`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setPaymentInquiry(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setPaymentInquiry(res?.data));

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

  static StatusInquiry(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/jazzcash/status/inquiry",
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

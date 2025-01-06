import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setProducts } from "./deletedProductsSlice";

export class DeletedProductsMiddleware extends Component {
  // static GetDeletedProducts(token) {
  //     return async (dispatch) => {
  //         return new Promise(async (resolve, reject) => {
  //             try {
  //                 dispatch(setLoading(true));
  //                 const BearerHeaders = ApiCaller.BearerHeaders(token)
  //                 let res = await ApiCaller.Get('/api/show/delete/product', BearerHeaders);
  //                 if (res.data.status) {
  //                     dispatch(setLoading(false));
  //                     resolve(res?.data);
  //                     dispatch(setProducts(res?.data))
  //                     console.log("pack fetched =>", res);
  //                 } else {
  //                     dispatch(setLoading(false));
  //                     reject(res);
  //                     console.log("pack not fetched =>", res);
  //                 }
  //             } catch (error) {
  //                 reject(false);
  //                 dispatch(setLoading(false));
  //             }
  //         });
  //     };
  // }
  static GetProducts({ id }, token) {
    console.log(id, "idssssssssssssssss");
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/shop/product",
            { id: id },
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setProducts(res?.data));
            console.log("pack fetched =>", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            console.log("pack not fetched =>", res);
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
  static DeleteProductsById(id, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/delete/product",
            { id: id },
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setProducts(res?.data));
            console.log("pack fetched =>", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            console.log("pack not fetched =>", res);
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
  static GetApproveProductsById(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `api/status/change/product`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setProducts(res?.data));
            console.log("pack fetched =>", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            console.log("pack not fetched =>", res);
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

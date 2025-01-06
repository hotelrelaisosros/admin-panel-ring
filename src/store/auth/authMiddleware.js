import { Component } from "react";
import { setLoading, setNetworkError, setToken } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import {
  setCurrentUser,
  setRetailers,
  setWholesalers,
  setUsers,
  setOrders,
  setApprovalProducts,
  setDeletedProducts,
  setUserReport,
} from "./authSlice";
import { setUploadedProducts } from "../products/deletedProductsSlice";

export class AuthMiddleware extends Component {
  static UserLogin(formData) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          // const BearerHeaders = ApiCaller.BearerHeaders()
          let res = await ApiCaller.Post(`/login`, formData);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setCurrentUser(res?.data.user));
            dispatch(setToken(res?.data.token));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);

            dispatch(setNetworkError(false));
          }
        } catch (error) {
          dispatch(setLoading(false));
          reject(false);
          dispatch(setNetworkError(error));
          console.log("error=>", error);
        }
      });
    };
  }
  static UserForgetPassword(formData) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          // const BearerHeaders = ApiCaller.BearerHeaders()
          let res = await ApiCaller.Post(`/forgot`, formData);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setCurrentUser(res?.data.user));
            dispatch(setToken(res?.data.token));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
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
  static UserResetPassword(formData) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          // const BearerHeaders = ApiCaller.BearerHeaders()
          let res = await ApiCaller.Post(`/reset`, formData);
          console.log("res==>", res);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setCurrentUser(res?.data.user));
            dispatch(setToken(res?.data.token));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
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
  static GetUsers(formData, { role }, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/${role}`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUsers(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUsers(res?.data));

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
  static GetWholeSalers(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/wholesalers",
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setWholesalers(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
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
  static GetRetailers(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/retailers",
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setRetailers(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
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
  static GetAdminProfile(token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(`/profile`, BearerHeaders);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setCurrentUser(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setCurrentUser(res?.data));

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
  static UpdateProfile(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/profile/update`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
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
  static BlockUserAccount({ id, blockMessage }, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/user/block/${id}/${blockMessage}`,
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
  static GetApprovalProducts(formData, token) {
    // Print all key-value pairs from formData
   
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/show/admin/products`,
            formData,
            BearerHeaders
          );
          console.log("formData", formData);
          console.log("res", res);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setApprovalProducts(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setApprovalProducts(res?.data));

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
  static GetApprovalProductsByRole(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/show/admin/products`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setApprovalProducts(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setApprovalProducts(res?.data));

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
  static ProductStatusChange(token, formData) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/status/change/product`,
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
  static GetDeletedProducts(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/show/delete/product`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setDeletedProducts(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setDeletedProducts(res?.data));

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
  static GetUploadedProducts({ id }, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/shop/product`,
            { id: id },
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUploadedProducts(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUploadedProducts(res?.data));

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
  static GetReport(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/report`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUserReport(res));

            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUserReport(res));

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
  static GetReportDetails(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/reports`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUserReport(res));

            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUserReport(res));

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
  static GetProfileReport({ id }, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(`/show/shop/${id}`, BearerHeaders);
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUserReport(res));

            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUserReport(res));

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
  // static ViewDetailReport({ id: id }, token) {
  //   return async (dispatch) => {
  //     dispatch(setLoading(true));
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         const BearerHeaders = ApiCaller.BearerHeaders(token);
  //         let res = await ApiCaller.Get(`/report/${id}`, BearerHeaders);
  //         if (res.data.status) {
  //           dispatch(setLoading(false));
  //           resolve(res);
  //           dispatch(setUserReport(res));

  //           dispatch(setNetworkError(false));
  //           console.log("res", res);
  //         } else {
  //           dispatch(setLoading(false));
  //           reject(res);
  //           dispatch(setUserReport(res));

  //           dispatch(setNetworkError(false));
  //           console.log("res", res);
  //         }
  //       } catch (error) {
  //         dispatch(setLoading(false));
  //         dispatch(setNetworkError(true));
  //         reject(false);
  //       }
  //     });
  //   };
  // }
  static DeleteReport({ id }, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/delete/report/${id}`,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUserReport(res));

            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUserReport(res));

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
  static DeleteReportId({ id }, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/delete/report/${id}`,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUserReport(res));

            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUserReport(res));

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
  static DeleteAllReport(token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/delete/all/report`,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setUserReport(res));

            dispatch(setNetworkError(false));
            console.log("res", res);
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setUserReport(res));

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
  static DeleteSpecificProduct(id , token) {
    console.log(id)
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = {
            ...ApiCaller.BearerHeaders(token),
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          };
          let res = await ApiCaller.Post(
            `/delete/product`, // Added /api prefix to match other endpoints
            {id:id},
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

  static DeleteAllProduct(token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/all/hard/delete/product`,
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

  static GetOrder(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          
          // Assuming that formData will be passed as query parameters
          const queryParams = new URLSearchParams(formData).toString();
          
          // Modify URL to include query parameters
          let res = await ApiCaller.Get(`/get/order?${queryParams}`, BearerHeaders);
  
          // Check if the API call was successful and orders are returned
          if (res.data.status && res.data.Orders.length > 0) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setOrders(res?.data.Orders));  // Set orders in Redux store
            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            dispatch(setOrders([]));  // Set empty array if no orders are found
            dispatch(setNetworkError(false));
            if (res.data.Message) {
              // Optionally handle the "Order not found" message
              console.log(res.data.Message);  // Or show it in a notification
            }
            reject(res);
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
        }
      });
    };
  }
  
  

  static GetOrderByRole(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/get/order`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setOrders(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setOrders(res?.data));

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

  static ChangeOrderStatus(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/status/change/order`,
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

  static GetTranding(id, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Get(
            `/status/trending/product/${id}`,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res);
            dispatch(setOrders(res?.data));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            dispatch(setOrders(res?.data));

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
            "/jazzcash/status/inquiry",
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

import { Component } from "react";
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setVariation,setRing, setMetal, setGem } from "./variationSlice";
import { setImages } from "./productImageSlice";

export class VariationMiddleware extends Component {
    static GetVariation(formData,token) {
        return async (dispatch) => {
          dispatch(setLoading(true));
          return new Promise(async (resolve, reject) => {
            try {
              const BearerHeaders = ApiCaller.BearerHeaders(token);
              let res = await ApiCaller.Post("/api/v1/variations/getall", 
                formData,
                BearerHeaders);
              
              if (res.data.status) {
                dispatch(setLoading(false));
                resolve(res?.data);
                dispatch(setVariation(res?.data.product_variations));
                dispatch(setRing(res?.data.isRing));
                // Assuming you want to dispatch variations here
                dispatch(setNetworkError(false));
              } else {
                dispatch(setLoading(false));
                reject(res?.data);
                dispatch(setNetworkError(false));
              }
            } catch (error) {
              dispatch(setLoading(false));
              dispatch(setNetworkError(true));
              reject(error); // Rejecting the actual error
              console.log("VARIATION ERROR =>", error);
            }
          });
        };
      }

      static getMetalType(token) {
        return async (dispatch) => {
          dispatch(setLoading(true));
          return new Promise(async (resolve, reject) => {
            try {
              const BearerHeaders = ApiCaller.BearerHeaders(token);
              let res = await ApiCaller.Get("/api/v1/products/metal_type_category", 
                BearerHeaders);
              
              if (res.data.status) {
                dispatch(setLoading(false));
                resolve(res?.data);
                dispatch(setMetal(res?.data.metal_types));
                // Assuming you want to dispatch variations here
                dispatch(setNetworkError(false));
              } else {
                dispatch(setLoading(false));
                reject(res?.data);
                dispatch(setNetworkError(false));
              }
            } catch (error) {
              dispatch(setLoading(false));
              dispatch(setNetworkError(true));
              reject(error); // Rejecting the actual error
              console.log("METAL TYPE ERROR =>", error);
            }
          });
        };
      }

      static getGemShape(id,token) {
        return async (dispatch) => {
          dispatch(setLoading(true));
          return new Promise(async (resolve, reject) => {
            try {
              const BearerHeaders = ApiCaller.BearerHeaders(token);
              let res = await ApiCaller.Get("/api/v1/products/gemshapes", 
                BearerHeaders);
              
              if (res.data.status) {
                dispatch(setLoading(false));
                resolve(res?.data);
                dispatch(setGem(res?.data.gemshapes));
                // Assuming you want to dispatch variations here
                dispatch(setNetworkError(false));
              } else {
                dispatch(setLoading(false));
                reject(res?.data);
                dispatch(setNetworkError(false));
              }
            } catch (error) {
              dispatch(setLoading(false));
              dispatch(setNetworkError(true));
              reject(error); // Rejecting the actual error
              console.log("VARIATION ERROR =>", error);
            }
          });
        };
      }
  static AddVariation(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/v1/variations",
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
  static UpdateVariation(id,formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/api/v1/variations/update/"+id,
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
  static DeleteVariation( id , token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          dispatch(setLoading(true));
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Delete(
            "/api/v1/variations/"+id,
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
}

export class ImageMiddleware extends Component {
  static GetImages(formData, token) {
    return async (dispatch) => {
      dispatch(setLoading(true));
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            `/image/search_variation_product`,
            formData,
            BearerHeaders
          );
          if (res.data.status) {
            dispatch(setLoading(false));
            resolve(res?.data);
            dispatch(setImages(res?.data?.images));

            dispatch(setNetworkError(false));
          } else {
            dispatch(setLoading(false));
            reject(res);
            // dispatch(setImages(res?.data));
            dispatch(setNetworkError(false));
          }
        } catch (error) {
          dispatch(setLoading(false));
          dispatch(setNetworkError(true));
          reject(false);
          console.log("SUB-CATEGORY ERROR =>", error);
        }
      });
    };
  }

  static DeleteOneImageRecord(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/delete/images/one_image",
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
  
  static AddImage(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/add/image",
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

  static AddSingleImage(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/add/images/one_image",
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
  static DeleteAllImages(formData, token) {
    return async (dispatch) => {
      return new Promise(async (resolve, reject) => {
        try {
          const BearerHeaders = ApiCaller.BearerHeaders(token);
          let res = await ApiCaller.Post(
            "/delete/image",
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
}

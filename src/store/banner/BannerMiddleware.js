import { Component } from 'react';
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setBanner } from './BannerSlice';

export class BannerMiddleware extends Component {
    static GetBanner(selectSec, token) {
        return async (dispatch) => {
            dispatch(setLoading(true));
            return new Promise(async (resolve, reject) => {
                try {
                    const BearerHeaders = ApiCaller.BearerHeaders(token)
                    let res = await ApiCaller.Get(`/api/banners/${selectSec}`, BearerHeaders);
                    if (res.data.status) {
                        dispatch(setLoading(false));
                        resolve(res?.data);
                        dispatch(setBanner(res?.data))

                        dispatch(setNetworkError(false));
                    } else {
                        dispatch(setLoading(false));
                        reject(res?.data);
                        dispatch(setBanner(res?.data))

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
    static AddBanner(formData, token) {
        return async (dispatch) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const BearerHeaders = ApiCaller.BearerHeaders(token)
                    let res = await ApiCaller.Post('/api/add/banner', formData, BearerHeaders);
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
    static UpdateBanner(formData, token) {
        return async (dispatch) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const BearerHeaders = ApiCaller.BearerHeaders(token)
                    let res = await ApiCaller.Post('/api/update/banner', formData, BearerHeaders);
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
    static DeleteBanner({ id }, token) {
        return async (dispatch) => {
            return new Promise(async (resolve, reject) => {
                try {
                    const BearerHeaders = ApiCaller.BearerHeaders(token)
                    let res = await ApiCaller.Post('/api/delete/banner', { id: id }, BearerHeaders);
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
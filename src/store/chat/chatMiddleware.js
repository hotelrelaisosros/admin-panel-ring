import { Component } from 'react';
import { setLoading, setNetworkError } from "../common/commonSlice";
import ApiCaller from "../../utils/ApiCaller";
import { setChat } from './chatSlice';

export class ChatMiddleware extends Component {
    static GetChat({ id }, token) {
        console.log(id, "message id");
        return async (dispatch) => {
            return new Promise(async (resolve, reject) => {
                try {
                    dispatch(setLoading(true));
                    const BearerHeaders = ApiCaller.BearerHeaders(token)
                    let res = await ApiCaller.Get(`/api/adminShowChat/${id}`, BearerHeaders);
                    if (res.data.status) {
                        dispatch(setLoading(false));
                        resolve(res?.data);
                        dispatch(setChat(res?.data))

                        dispatch(setNetworkError(false));
                        console.log("pack fetched =>", res);
                    } else {
                        dispatch(setLoading(false));
                        reject(res);
                        dispatch(setNetworkError(false));
                        console.log("pack not fetched =>", res);
                    }
                } catch (error) {
                    reject(false);
                    dispatch(setLoading(false));
                    dispatch(setNetworkError(true));
                }
            });
        };
    }
    // static GetChatById({ id }, token) {
    //     console.log(id, "specific chat id");
    //     return async (dispatch) => {
    //         return new Promise(async (resolve, reject) => {
    //             try {
    //                 dispatch(setLoading(true));
    //                 const BearerHeaders = ApiCaller.BearerHeaders(token)
    //                 let res = await ApiCaller.Post(`/api/chats`, { receiver_id: id }, BearerHeaders);
    //                 if (res.data.status) {
    //                     dispatch(setLoading(false));
    //                     resolve(res?.data);
    //                     dispatch(setChat(res?.data))
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
}
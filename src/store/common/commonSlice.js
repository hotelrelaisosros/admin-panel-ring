import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
    name: "common",
    initialState: {
        token: null,
        loading: false,
        networkError: {},
    },
    reducers: {
        setLoading: (state, { payload }) => {
            state.loading = payload
        },
        setToken: (state, { payload }) => {
            state.token = payload
        },
        setNetworkError: (state, { payload }) => {
            state.networkError = payload
        },
    }
})

export const { setLoading, setToken, setNetworkError } = commonSlice.actions
export default commonSlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const packageSlice = createSlice({
    name: "package",
    initialState: {
        packages: [],
        expirePackages: []
    },
    reducers: {
        setPackage: (state, { payload }) => {
            state.packages = payload
        },
        setExpirePackage: (state, { payload }) => {
            state.expirePackages = payload
        },
    }
})

export const { setPackage, setExpirePackage } = packageSlice.actions
export default packageSlice.reducer
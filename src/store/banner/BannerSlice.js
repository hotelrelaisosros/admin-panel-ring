import { createSlice } from "@reduxjs/toolkit";

const bannerSlice = createSlice({
    name: "banner",
    initialState: {
        banners: [],
    },
    reducers: {
        setBanner: (state, { payload }) => {
            state.banners = payload
        },
    }
})

export const { setBanner } = bannerSlice.actions
export default bannerSlice.reducer
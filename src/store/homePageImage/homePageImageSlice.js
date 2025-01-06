import { createSlice } from "@reduxjs/toolkit";

const homeImageSlice = createSlice({
    name: "images",
    initialState: {
        images: [],
    },
    reducers: {
        setImages: (state, { payload }) => {
            state.images = payload
        },
    }
})

export const { setImages } = homeImageSlice.actions
export default homeImageSlice.reducer
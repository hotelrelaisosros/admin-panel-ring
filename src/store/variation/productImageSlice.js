import { createSlice } from "@reduxjs/toolkit";

const imageSlice = createSlice({
    name: "images",
    initialState: {
        images: [], 
    },
    reducers: {
        setImages: (state, { payload }) => {
            state.images = payload;
        },
    }
});

export const { setImages } = imageSlice.actions;
export default imageSlice.reducer;
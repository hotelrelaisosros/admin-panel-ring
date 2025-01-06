import { createSlice } from "@reduxjs/toolkit";

const categorySlice = createSlice({
    name: "category",
    initialState: {
        categories: [],
    },
    reducers: {
        setCategory: (state, { payload }) => {
            state.categories = payload
        },
    }
})

export const { setCategory } = categorySlice.actions
export default categorySlice.reducer
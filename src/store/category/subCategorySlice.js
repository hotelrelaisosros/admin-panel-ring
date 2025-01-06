import { createSlice } from "@reduxjs/toolkit";

const subCategorySlice = createSlice({
    name: "sub-category",
    initialState: {
        subCategories: [],
    },
    reducers: {
        setSubCategory: (state, { payload }) => {
            state.subCategories = payload
        },
    }
})

export const { setSubCategory } = subCategorySlice.actions
export default subCategorySlice.reducer
import { createSlice } from "@reduxjs/toolkit";

const deletedProductsSlice = createSlice({
    name: "products",
    initialState: {
        products: [],
        deletedProducts: [],
        uploadedProducts: [],
    },
    reducers: {
        setProducts: (state, { payload }) => {
            state.products = payload
        },
        setDeletedProducts: (state, { payload }) => {
            state.deletedProducts = payload
        },
        setUploadedProducts: (state, { payload }) => {
            state.uploadedProducts = payload
        },
    }
})

export const { setProducts, setUploadedProducts } = deletedProductsSlice.actions
export default deletedProductsSlice.reducer
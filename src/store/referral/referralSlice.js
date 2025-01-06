import { createSlice } from "@reduxjs/toolkit";

const referralSlice = createSlice({
    name: "referrals",
    initialState: {
        referrals: [],
    },
    reducers: {
        setReferrals: (state, { payload }) => {
            state.referrals = payload
        },
    }
})

export const { setReferrals } = referralSlice.actions
export default referralSlice.reducer
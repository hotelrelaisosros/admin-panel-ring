import { createSlice } from "@reduxjs/toolkit";

const referralSlice = createSlice({
  name: "refund",
  initialState: {
    refund: [],
  },
  reducers: {
    setRefund: (state, { payload }) => {
      state.refund = payload;
    },
  },
});

export const { setRefund } = referralSlice.actions;
export default referralSlice.reducer;

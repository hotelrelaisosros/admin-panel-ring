import { createSlice } from "@reduxjs/toolkit";

const paymentInquirySlice = createSlice({
  name: "auth",
  initialState: {
    paymentInquiry: {},
  },
  reducers: {
    setPaymentInquiry: (state, { payload }) => {
      state.paymentInquiry = payload;
    },
  },
});

export const { setPaymentInquiry } = paymentInquirySlice.actions;
export default paymentInquirySlice.reducer;

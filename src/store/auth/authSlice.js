import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    currentUser: {},
    users: [],
    wholesalers: [],
    retailers: [],
    orders: [],
    approvalProducts: [],
    deletedProducts: [],
    userReport: [],
    reportProfileDetails: [],
  },
  reducers: {
    setCurrentUser: (state, { payload }) => {
      state.currentUser = payload;
    },
    setUsers: (state, { payload }) => {
      state.users = payload;
    },
    setWholesalers: (state, { payload }) => {
      state.wholesalers = payload;
    },
    setRetailers: (state, { payload }) => {
      state.retailers = payload;
    },
    setOrders: (state, { payload }) => {
      state.orders = payload;
    },
    setApprovalProducts: (state, { payload }) => {
      state.approvalProducts = payload;
    },
    setDeletedProducts: (state, { payload }) => {
      state.deletedProducts = payload;
    },
    setUserReport: (state, { payload }) => {
      state.userReport = payload;
    },
    setReportProfileDetails: (state, { payload }) => {
      state.reportProfileDetails = payload;
    },
  },
});

export const {
  setCurrentUser,
  setUsers,
  setWholesalers,
  setRetailers,
  setOrders,
  setApprovalProducts,
  setDeletedProducts,
  setUserReport,
  setReportProfileDetails,
} = authSlice.actions;
export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const currentAppToken = createSlice({
  name: "AppToken",
  initialState: {
    appToken: null,
  },
  reducers: {
    setAppToken: (state, { payload }) => {
      state.appToken = payload;
    },
  },
});

export const { setAppToken } = currentAppToken.actions;
export default currentAppToken.reducer;

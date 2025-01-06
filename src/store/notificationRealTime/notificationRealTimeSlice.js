import { createSlice } from "@reduxjs/toolkit";

const notificationRealTimeSlice = createSlice({
  name: "notificationsRealTime",
  initialState: {
    notificationsRealTime: [],
  },
  reducers: {
    setNotificationsRealTime: (state, { payload }) => {
      state.notificationsRealTime = payload;
    },
  },
});

export const { setNotificationsRealTime } = notificationRealTimeSlice.actions;
export default notificationRealTimeSlice.reducer;

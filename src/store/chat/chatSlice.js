import { createSlice } from "@reduxjs/toolkit";

export const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chat: []
    },
    reducers: {
        setChat: (state, { payload }) => {
            state.chat = payload
        }
    }
})

export const { setChat } = chatSlice.actions;
export default chatSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  userChatId: string | null;
} = {
  userChatId: null,
};

const chatSlice = createSlice({
  name: "chating",
  initialState,
  reducers: {
    setUserChating: (state, action) => {
      state.userChatId = action.payload;
    },
    clearUserChatId: (state) => {
      state.userChatId = null;
    },
  },
});

export const { setUserChating, clearUserChatId } = chatSlice.actions;
export default chatSlice.reducer;

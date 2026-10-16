// import { createSlice } from "@reduxjs/toolkit";

// const initialState: {
//   user: null;
//   token: null;
// } = {
//   user: null,
//   token: null,
// };

// const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       console.log("============action", action.payload.user);
//       state.user = action.payload.user;
//       state.token = action.payload.token;
//     },
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//     },
//   },
// });

// export const { setUser, logout } = userSlice.actions;
// export default userSlice.reducer;
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  image?: string | null;
  googleId?: string | null;
  isGoogleLogin?: boolean;
  fcmTokens?: string[];
  createdAt?: string;
  updatedAt?: string;
  businesses?: unknown[];
  businessId?: string | null;
}

interface UserState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  refreshToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<{
        user: User;
        token: string;
        refreshToken?: string;
      }>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken ?? null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;

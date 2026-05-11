import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlanType = "monthly" | "annually";

interface PaymentState {
  plan: null;
}

const initialState: PaymentState = {
  plan: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPlan: (state, action) => {
      state.plan = action.payload;
    },

    // NEW: store client secret
    // setClientSecret: (state, action: PayloadAction<string>) => {
    //   console.log(action.payload);
    //   state.plan = action.payload;
    // },
    resetPlan: () => initialState,
  },
});

export const { setPlan, resetPlan } = paymentSlice.actions;
export default paymentSlice.reducer;


import { createSlice } from "@reduxjs/toolkit";

interface CustomerId {
    customerId: string;
}
const initialState: CustomerId = {
    customerId: ""
}

const customerIdSlice = createSlice({
    name: "customerId",
    initialState,
    reducers: {
        setCustomerId: (state, action) => {
            state.customerId = action.payload
        }
    },
});

export const { setCustomerId } = customerIdSlice.actions;
export default customerIdSlice.reducer;

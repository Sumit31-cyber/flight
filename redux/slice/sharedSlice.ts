import { AirportData } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  departingFrom: AirportData | null;
  flyingTo: AirportData | null;
}

const initialState: InitialState = {
  departingFrom: null,
  flyingTo: null,
};

const sharedSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setDepartingFrom: (state, action) => {
      state.departingFrom = action.payload;
    },
    setFlyingTo: (state, action) => {
      state.flyingTo = action.payload;
    },
  },
});

export const { setDepartingFrom, setFlyingTo } = sharedSlice.actions;

// Export the reducer
export default sharedSlice.reducer;

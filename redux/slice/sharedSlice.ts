import { AirportData } from "@/utils/types";
import { createSlice } from "@reduxjs/toolkit";

const today = new Date().toISOString();
const nextDay = new Date();
nextDay.setDate(new Date().getDate() + 1);
const returnDate = nextDay.toISOString();

interface InitialState {
  departingFrom: AirportData | null;
  flyingTo: AirportData | null;
  departureDate: string;
  returnDate: string;
  travelers: number;
}

const initialState: InitialState = {
  departingFrom: null,
  flyingTo: null,
  departureDate: today,
  returnDate: returnDate,
  travelers: 1,
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
    setDepartureDate: (state, action) => {
      state.departureDate = action.payload;
    },
    setReturnDate: (state, action) => {
      state.returnDate = action.payload;
    },
    updateTravelerCount: (state, action) => {
      const { type } = action.payload;

      if (type === "increment") {
        state.travelers += 1;
      } else {
        if (state.travelers === 1) return;
        state.travelers -= 1;
      }
    },
  },
});

export const {
  setDepartingFrom,
  setFlyingTo,
  setDepartureDate,
  setReturnDate,
  updateTravelerCount,
} = sharedSlice.actions;

// Export the reducer
export default sharedSlice.reducer;

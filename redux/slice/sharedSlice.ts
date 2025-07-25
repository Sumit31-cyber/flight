import { AirportData, Itinerary } from "@/utils/types";
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
  myFlights: Itinerary[] | null;
}

const initialState: InitialState = {
  departingFrom: null,
  flyingTo: null,
  departureDate: today,
  returnDate: returnDate,
  travelers: 1,
  myFlights: null,
};

const sharedSlice = createSlice({
  name: "shared",
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
    setMyFlights: (state, action) => {
      const existingItemIndex = state.myFlights?.findIndex(
        (item) => item.id == action.payload.id
      );

      if (existingItemIndex === -1) {
        if (state.myFlights) {
          state.myFlights = [action.payload, ...state.myFlights];
        } else {
          state.myFlights = action.payload;
        }
      }
    },

    clearMyFlights: (state, action) => {
      state.myFlights = [];
    },
  },
});

export const {
  setDepartingFrom,
  setFlyingTo,
  setDepartureDate,
  setReturnDate,
  updateTravelerCount,
  setMyFlights,
  clearMyFlights,
} = sharedSlice.actions;

// Export the reducer
export default sharedSlice.reducer;

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
  myFlights: Itinerary[];
}

const initialState: InitialState = {
  departingFrom: null,
  flyingTo: null,
  departureDate: today,
  returnDate: returnDate,
  travelers: 1,
  myFlights: [],
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
      // Initialize myFlights as empty array if it doesn't exist
      if (!state.myFlights) {
        state.myFlights = [];
      }

      if (Array.isArray(action.payload)) {
        if (state.myFlights.length === 0) {
          state.myFlights = action.payload;
        } else {
          action.payload.forEach((newFlight) => {
            const existingIndex = state.myFlights!.findIndex(
              (item) => item.id === newFlight.id
            );
            if (existingIndex === -1) {
              state.myFlights!.unshift(newFlight);
            }
          });
        }
      } else {
        const existingItemIndex = state.myFlights.findIndex(
          (item) => item.id === action.payload.id
        );

        if (existingItemIndex === -1) {
          state.myFlights.unshift(action.payload);
        }
      }
    },

    clearMyFlights: (state, action) => {
      state.myFlights = [];
    },

    clearDataOnLogout: (state, action) => {
      state.departingFrom = null;
      state.flyingTo = null;
      state.departureDate = today;
      state.returnDate = returnDate;
      state.travelers = 1;
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
  clearDataOnLogout,
} = sharedSlice.actions;

// Export the reducer
export default sharedSlice.reducer;

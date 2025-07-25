import { createSlice } from "@reduxjs/toolkit";

interface InitialState {
  isLoggedIn: boolean;
}

const initialState: InitialState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action) => {
      state.isLoggedIn = true;
    },
    signOut: (state, action) => {
      state.isLoggedIn = false;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;

// Export the reducer
export default authSlice.reducer;

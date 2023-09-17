import { createSlice } from "@reduxjs/toolkit";

export const cryptoSlice = createSlice({
  name: "crypto",
  initialState: {
    data: [],
    isLoggedIn: !!localStorage.getItem("isLoggedIn"),
  },
  reducers: {
    addPair: (state, action) => {
      const index = state.data.findIndex(
        (pair) => pair.name === action.payload.name
      );
      if (index === -1) {
        state.data.push(action.payload);
      } else {
        state.data[index] = action.payload;
      }
    },
    updatePair: (state, action) => {
      const index = state.data.findIndex(
        (pair) => pair.channelId === action.payload.channelId
      );
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload };
      }
    },
    login: (state, action) => {
      state.isLoggedIn = true;
    },
  },
});

export const { addPair, updatePair, login } = cryptoSlice.actions;
export default cryptoSlice.reducer;

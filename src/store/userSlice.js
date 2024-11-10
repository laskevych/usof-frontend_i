import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authToken: null,
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.authToken = action.payload.authToken;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.authToken = null;
      state.user = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
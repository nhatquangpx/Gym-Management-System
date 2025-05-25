import { createSlice } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";

const initialState = {
  user: null,
  token: null,
  isLoggedIn: false
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      
      // Lưu token và thông tin người dùng vào localStorage
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      // Remove the persisted state
      storage.removeItem("persist:root");
      // Clear localStorage tokens
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
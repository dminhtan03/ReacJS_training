import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  id: string | null;
  email: string | null;
  role: string | null;
  firstName: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  id: null,
  email: null,
  role: null,
  firstName: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        id: string;
        email: string;
        role: string;
        firstName: string;
      }>
    ) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.firstName = action.payload.firstName;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.id = null;
      state.email = null;
      state.role = null;
      state.firstName = null;
      state.isAuthenticated = false;
      localStorage.removeItem("reduxState");
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;

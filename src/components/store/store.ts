import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";

function saveToLocalStorage(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch (e) {
    console.warn(e);
  }
}

function loadFromLocalStorage() {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState);
  } catch (e) {
    console.warn(e);
    return undefined;
  }
}

const persistedState = loadFromLocalStorage();

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  preloadedState: persistedState,
});

// Lắng nghe thay đổi state và lưu vào localStorage
store.subscribe(() => {
  saveToLocalStorage({
    auth: store.getState().auth,
  });
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

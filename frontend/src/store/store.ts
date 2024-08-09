import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web
import cartReducer from "./cartSlice";

// Configure persist settings
const persistConfig = {
  key: "root",
  storage,
};

// Wrap your reducer with persistReducer
const persistedCartReducer = persistReducer(persistConfig, cartReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
  },
});

export const persistor = persistStore(store); // Create the persistor object

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

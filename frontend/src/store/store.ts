import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";

// Configure persist settings for cart
const cartPersistConfig = {
  key: "cart",
  storage,
};

// Configure persist settings for auth
const authPersistConfig = {
  key: "auth",
  storage,
};

// Wrap your reducers with persistReducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    auth: persistedAuthReducer,
  },
});

export const persistor = persistStore(store); // Create the persistor object

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

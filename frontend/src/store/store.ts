import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Default to localStorage for web
import cartReducer from "./cartSlice";
import authReducer from "./authSlice";
import favReducer from "./favSlice";

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

const favPersistConfig = {
  key: "favourites",
  storage,
};

// Wrap your reducers with persistReducer
const persistedCartReducer = persistReducer(cartPersistConfig, cartReducer);
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedFavReducer = persistReducer(favPersistConfig, favReducer);

const store = configureStore({
  reducer: {
    cart: persistedCartReducer,
    auth: persistedAuthReducer,
    fav: persistedFavReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
      // serializableCheck: {
      //   // Ignore these redux-persist actions to prevent non-serializable warnings
      //   ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      // },
    }),
});

export const persistor = persistStore(store); // Create the persistor object

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

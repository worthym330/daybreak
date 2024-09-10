import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: any = {
  favorites: [],
  hotel: {},
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<any>) => {
      state.favorites.push(action.payload);
    },
    removeFavorite: (state, action: PayloadAction<string>) => {
      state.favorites = state.favorites.filter(
        (hotel: any) => hotel._id !== action.payload
      );
    },
    addHotel: (state, action: PayloadAction<any>) => {
      state.hotel = action.payload;
    },
    removeHotel: (state) => {
      state.hotel = {};
    },
  },
});

export const { addFavorite, removeFavorite, addHotel, removeHotel } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: any[];
  error: boolean;
  date?: any;
}

const initialState: CartState = {
  items: [],
  error: false,
  date: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      const newItem = action.payload;
      const existingProductIndex = state.items.findIndex(
        (item) =>
          item.product.title === newItem.product.title &&
          item.hotel._id === newItem.hotel._id
      );

      if (existingProductIndex !== -1) {
        state.items[existingProductIndex] = newItem;
      } else {
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const itemIdToRemove = action.payload;
      state.items = state.items.filter(
        (item) => item.product.title !== itemIdToRemove
      );
    },
    clearCart: (state) => {
      state.items = [];
    },
    setError(state, action) {
      state.error = action.payload;
    },
    setDate(state, action) {
      state.date = action.payload;
    },
  },
});

export const { addToCart, clearCart, setError, setDate, removeFromCart } =
  cartSlice.actions;
export default cartSlice.reducer;

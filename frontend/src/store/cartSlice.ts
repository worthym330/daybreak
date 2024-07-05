import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  product: any;
  hotel: any;
  adultCount: number;
  childCount: number;
  total: number;
  date: string;
}

interface CartState {
  items: CartItem[];
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
    addToCart: (state, action: PayloadAction<CartItem>) => {
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

export const { addToCart, clearCart, setError, setDate } = cartSlice.actions;
export default cartSlice.reducer;

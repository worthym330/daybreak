import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
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
  },
});

export const { addToCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

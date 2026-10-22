import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalAmount: 0,
  itemsCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action) {
      state.items = action.payload.items || [];
      state.totalAmount = action.payload.totalAmount || 0;
      state.itemsCount = action.payload.itemsCount || 0;
    },

    clearCart(state) {
      state.items = [];
      state.totalAmount = 0;
      state.itemsCount = 0;
    },
  },
});

export const { setCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

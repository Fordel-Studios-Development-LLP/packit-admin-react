// admin/src/modules/products/presentation/state/ProductSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import { ProductEntity } from "../../domain/entity/product.entity";

interface ProductState {
  products: ProductEntity[];
}

const initialState: ProductState = {
  products: [],
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (product) {
        product.name = action.payload.name;
        product.price = action.payload.price;
        product.description = action.payload.description;
      }
    },
    deleteProduct: (state, action) => {
      const product = state.products.find(
        (product) => product.id === action.payload.id
      );
      if (product) {
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
      }
    },
  },
});

export const { addProduct, updateProduct, deleteProduct } =
  productSlice.actions;

export default productSlice.reducer;

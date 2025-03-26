import { productSlice } from "../modules/products/presentation/state/ProductSlice";
import { configureStore } from "@reduxjs/toolkit";

// Import other reducers as needed

const store = configureStore({
  reducer: {
    product: productSlice.reducer,
    // Add other reducers here as you develop more modules
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for file objects
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;

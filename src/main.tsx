import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ProductProvider } from "./modules/products/presentation/providers/ProductProvider";
import ProductView from "./modules/products/presentation/views/ProductView";
import "./index.css"; // Make sure to import your CSS
import React from "react";

// Create a Layout component that includes your providers
const RootLayout = () => {
  return (
    <div className="app-root">
      <ProductProvider>
        <Outlet />
      </ProductProvider>
    </div>
  );
};

// Create the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <ProductView />,
      },
      // Add other routes here
    ],
  },
]);

// Create the root element
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

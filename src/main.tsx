// src/main.tsx
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
} from "react-router-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import { ProductProvider } from "./modules/products/presentation/providers/ProductProvider";
import ProductView from "./modules/products/presentation/views/ProductView";
import "./index.css";
import React from "react";
import { AdminLayout } from "./commons/layout/adminLayout/AdminLayout";

// Create the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/admin",
    element: (
      <ProductProvider>
        <AdminLayout />
      </ProductProvider>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <div>Dashboard Content</div>,
      },
      {
        path: "products",
        element: <ProductView />,
      },
      {
        path: "orders",
        element: <div>Orders Content</div>,
      },
      {
        path: "customers",
        element: <div>Customers Content</div>,
      },
      {
        path: "e-commerce",
        children: [
          {
            index: true,
            element: <Navigate to="/admin/e-commerce/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <div>E-commerce Dashboard</div>,
          },
          {
            path: "products",
            element: <ProductView />,
          },
          {
            path: "products/detail",
            element: <div>Product Detail</div>,
          },
          {
            path: "products/new",
            element: <div>Add Product</div>,
          },
          {
            path: "orders",
            element: <div>Order List</div>,
          },
          {
            path: "orders/detail",
            element: <div>Order Detail</div>,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <div>Login Page</div>,
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

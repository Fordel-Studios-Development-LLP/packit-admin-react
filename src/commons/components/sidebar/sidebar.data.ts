import {
  IconLayoutDashboard,
  IconShoppingBag,
  IconShoppingCart,
  IconTruckDelivery,
  IconUsers,
  IconBoxMultiple,
} from "@tabler/icons-react";
import { Layers } from "lucide-react";
import { SidebarData } from "./sidebar.types";

export const adminSidebarData: SidebarData = {
  teams: [
    {
      name: "Shadcn UI Kit",
      logo: Layers,
      plan: "Pro",
    },
  ],
  navGroups: [
    {
      title: "DASHBOARDS",
      items: [
        {
          title: "Default",
          url: "/admin/dashboard",
          icon: IconLayoutDashboard,
        },
        {
          title: "E-commerce",
          url: "/admin/e-commerce",
          icon: IconShoppingBag,
          items: [
            {
              title: "Dashboard",
              url: "/admin/e-commerce/dashboard",
            },
            {
              title: "Product List",
              url: "/admin/e-commerce/products",
            },
            {
              title: "Product Detail",
              url: "/admin/e-commerce/products/detail",
            },
            {
              title: "Add Product",
              url: "/admin/e-commerce/products/new",
            },
            {
              title: "Order List",
              url: "/admin/e-commerce/orders",
            },
            {
              title: "Order Detail",
              url: "/admin/e-commerce/orders/detail",
            },
          ],
        },
      ],
    },
    {
      title: "MANAGEMENT",
      items: [
        {
          title: "Products",
          url: "/admin/products",
          icon: IconBoxMultiple,
        },
        {
          title: "Orders",
          url: "/admin/orders",
          icon: IconShoppingCart,
        },
        {
          title: "Customers",
          url: "/admin/customers",
          icon: IconUsers,
        },
        {
          title: "Shipping",
          url: "/admin/shipping",
          icon: IconTruckDelivery,
        },
      ],
    },
  ],
  user: {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "/avatars/user.png",
  },
};

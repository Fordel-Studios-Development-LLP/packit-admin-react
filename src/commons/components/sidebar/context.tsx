// src/components/sidebar/context.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SidebarData } from "./sidebar.types";

interface SidebarContextType {
  data: SidebarData;
  openGroups: { [key: string]: boolean };
  toggleGroup: (title: string) => void;
  isActiveRoute: (url: string) => boolean;
  isMobile: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  openMobileMenu: boolean;
  setOpenMobileMenu: (open: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

interface SidebarProviderProps {
  children: React.ReactNode;
  data: SidebarData;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({
  children,
  data,
}) => {
  const location = useLocation();
  const [openGroups, setOpenGroups] = useState<{ [key: string]: boolean }>({});
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // Initialize openGroups based on active items
  useEffect(() => {
    const initialOpenGroups: { [key: string]: boolean } = {};

    data.navGroups.forEach((group) => {
      group.items.forEach((item) => {
        if (item.items) {
          const hasActiveChild = item.items.some(
            (subItem) => subItem.isActive || location.pathname === subItem.url
          );
          if (hasActiveChild) {
            initialOpenGroups[item.title] = true;
          }
        }
      });
    });

    setOpenGroups(initialOpenGroups);
  }, [data, location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);

      // Auto-collapse sidebar on small screens
      if (window.innerWidth < 1024 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const isActiveRoute = (url: string) => {
    return location.pathname === url;
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const value: SidebarContextType = {
    data,
    openGroups,
    toggleGroup,
    isActiveRoute,
    isMobile,
    isCollapsed,
    toggleCollapse,
    openMobileMenu,
    setOpenMobileMenu,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
};

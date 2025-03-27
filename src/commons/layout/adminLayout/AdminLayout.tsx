import { Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/commons/components/sidebar/Sidebar"; // Fixed import path
import { SidebarProvider } from "@/commons/components/sidebar/context"; // Proper import for context
import { adminSidebarData } from "@/commons/components/sidebar/sidebar.data";

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    // Handle logout logic here
    console.log("Logging out...");
    // For example: clear token from localStorage
    localStorage.removeItem("auth_token");
    // Navigate to login page
    navigate("/login");
  }, [navigate]);

  return (
    <SidebarProvider data={adminSidebarData}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex h-14 lg:h-[56px] items-center justify-between border-b bg-background px-6">
            <h1 className="text-lg font-semibold">Admin Dashboard</h1>
            <Button onClick={handleLogout} variant="ghost">
              Logout
            </Button>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

// src/components/sidebar/Sidebar.tsx
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebar } from "./context";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const {
    isMobile,
    isCollapsed,
    toggleCollapse,
    openMobileMenu,
    setOpenMobileMenu,
  } = useSidebar();

  // Mobile sidebar
  if (isMobile) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden fixed top-4 left-4 z-40"
          onClick={() => setOpenMobileMenu(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Sheet open={openMobileMenu} onOpenChange={setOpenMobileMenu}>
          <SheetContent side="left" className="p-0 w-72">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={cn(
        "h-screen border-r bg-background transition-all duration-300 relative ",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div
        className={cn("absolute top-2 right-2", isCollapsed ? "-right-5" : "")}
      >
        <Button
          className="bg-slate-100"
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
      <SidebarContent />
    </div>
  );
}

function SidebarContent() {
  const { data, openGroups, toggleGroup, isActiveRoute, isCollapsed } =
    useSidebar();

  // Get the first team for display (since we're now using teams array)
  const activeTeam = data.teams && data.teams.length > 0 ? data.teams[0] : null;

  return (
    <div className="flex h-full flex-col">
      {/* Header/Logo */}
      <div className="flex h-14 items-center border-b px-4">
        <div className="flex items-center gap-2 overflow-hidden">
          {activeTeam && activeTeam.logo && (
            <activeTeam.logo className="h-6 w-6 flex-shrink-0" />
          )}
          {!isCollapsed && activeTeam && (
            <span className="font-semibold truncate">{activeTeam.name}</span>
          )}
        </div>
      </div>

      {/* Navigation area */}
      <ScrollArea className="flex-1">
        <div className="px-2 py-2">
          {data.navGroups.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-4">
              {!isCollapsed && (
                <h3 className="px-2 py-1 text-sm font-medium text-muted-foreground">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item, itemIndex) => {
                  // Check if it has subitems
                  if (item.items && item.items.length > 0) {
                    return (
                      <Collapsible
                        key={itemIndex}
                        open={openGroups[item.title]}
                        onOpenChange={() => toggleGroup(item.title)}
                        disabled={isCollapsed}
                      >
                        <CollapsibleTrigger asChild>
                          <div
                            className="flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent"
                            role="button"
                          >
                            <div className="flex items-center gap-2 overflow-hidden">
                              {item.icon && (
                                <item.icon className="h-4 w-4 flex-shrink-0" />
                              )}
                              {!isCollapsed && <span>{item.title}</span>}
                            </div>
                            {!isCollapsed && (
                              <>
                                {openGroups[item.title] ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                              </>
                            )}
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-6 pt-1">
                          {!isCollapsed &&
                            item.items.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href={subItem.url}
                                className={cn(
                                  "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                                  (subItem.isActive ||
                                    isActiveRoute(subItem.url || "")) &&
                                    "bg-accent font-medium"
                                )}
                              >
                                {subItem.icon && (
                                  <subItem.icon className="h-4 w-4" />
                                )}
                                <span>{subItem.title}</span>
                              </a>
                            ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  }
                  // Regular item without subitems
                  return (
                    <a
                      key={itemIndex}
                      href={item.url}
                      className={cn(
                        "flex items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-accent",
                        (item.isActive || isActiveRoute(item.url || "")) &&
                          "bg-accent font-medium"
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {item.icon && (
                          <item.icon className="h-4 w-4 flex-shrink-0" />
                        )}
                        {!isCollapsed && <span>{item.title}</span>}
                      </div>
                      {!isCollapsed && item.badge && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                          {item.badge}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* User profile */}
      {data.user && (
        <div
          className={cn(
            "flex items-center gap-2 border-t p-4",
            isCollapsed && "justify-center"
          )}
        >
          <Avatar className="h-8 w-8 flex-shrink-0">
            <AvatarImage src={data.user.avatar} />
            <AvatarFallback>
              {data.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <>
              <div className="flex flex-1 flex-col text-sm overflow-hidden">
                <span className="font-medium truncate">{data.user.name}</span>
                <span className="text-xs text-muted-foreground truncate">
                  {data.user.email}
                </span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ChevronDown className="h-4 w-4 cursor-pointer text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>
      )}
    </div>
  );
}

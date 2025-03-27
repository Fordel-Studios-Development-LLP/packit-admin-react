// commons/components/types.ts
import { LucideIcon } from "lucide-react";
import { ComponentType } from "react";

// For supporting both Tabler icons and Lucide icons
type IconComponent =
  | LucideIcon
  | ComponentType<{ className?: string; size?: number }>;

export interface SidebarItem {
  title: string;
  url?: string;
  icon?: IconComponent;
  badge?: string;
  items?: SidebarItem[];
  isActive?: boolean;
}

export interface NavGroup {
  title: string;
  items: SidebarItem[];
}

export interface Team {
  name: string;
  logo: LucideIcon;
  plan: string;
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export interface SidebarData {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
}

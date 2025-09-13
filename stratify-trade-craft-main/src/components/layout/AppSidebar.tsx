import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  TrendingUp,
  Bot,
  BarChart3,
  Users,
  FileText,
  Briefcase,
  MessageSquare,
  Settings,
  Heart,
  LogOut,
  LifeBuoy,   // Assistance icon
  Layers,     // Algorithm Trading Levels icon
  PlayCircle, // ✅ Simulator icon
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Trading Engine", url: "/dashboard", icon: TrendingUp },
  { title: "Strategy Builder", url: "/strategy-builder", icon: Bot },
  { title: "Backtesting Engine", url: "/backtesting", icon: BarChart3 },
  { title: "Social Trading", url: "/social-trading", icon: Users },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Portfolio", url: "/portfolio", icon: Briefcase },
  { title: "Strategy Copilot", url: "/copilot", icon: MessageSquare },
  { title: "Fund Management", url: "/fund-management", icon: Settings },
  { title: "Wishlist", url: "/wishlist", icon: Heart },
  { title: "Assistance", url: "/assistance", icon: LifeBuoy },
  { title: "Algorithm Trading Levels", url: "/algorithm-trading-levels", icon: Layers },
  { title: "Simulator", url: "/simulator", icon: PlayCircle }, // ✅ New item
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "";

  const handleLogout = () => {
    logout();        // clear user
    navigate("/login"); // redirect
  };

  return (
    <Sidebar className={isCollapsed ? "w-14" : "w-60"} collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg gradient-primary">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          {!isCollapsed && (
            <span className="text-xl font-bold gradient-text">Stratify</span>
          )}
        </div>
      </SidebarHeader>

      {/* Nav Items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Trading Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-sidebar-border p-4">
        {!isCollapsed && user && (
          <div className="mb-2">
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-2">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
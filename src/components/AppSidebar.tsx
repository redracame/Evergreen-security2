import { Home, BookOpen, FileText, Shield, BarChart3, Settings, LogOut } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import evergreen from "@/assets/evergreen-logo.jpeg";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: Home, roles: ['employee', 'manager','admin'] },
  { title: "Training", url: "/training", icon: BookOpen, roles: ['employee', 'manager', 'admin'] },
  { title: "Policies", url: "/policies", icon: FileText, roles: ['employee', 'manager', 'admin'] },
  { title: "Compliance", url: "/compliance", icon: Shield, roles: ['manager', 'admin'] },
  { title: "Reports", url: "/reports", icon: BarChart3, roles: ['manager', 'admin'] },
  { title: "Admin Panel", url: "/admin", icon: Settings, roles: ['admin'] },
];

export function AppSidebar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const visibleItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'employee')
  );

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <img src={evergreen} alt="Evergreen Group" className="h-8 w-8" />
          <div>
            <h2 className="font-semibold text-primary">Evergreen Group</h2>
            <p className="text-xs text-muted-foreground">Training Portal</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) =>
                        `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent text-foreground'
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        <div className="space-y-2">
          <div className="text-sm">
            <p className="font-medium">{user?.name}</p>
            <p className="text-xs text-muted-foreground capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
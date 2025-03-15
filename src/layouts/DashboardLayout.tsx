
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  BarChart, 
  MessageSquareText, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const sidebarItems = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    path: "/"
  },
  {
    title: "Ad Performance",
    icon: <BarChart className="w-5 h-5" />,
    path: "/ad-performance"
  },
  {
    title: "Conversations",
    icon: <MessageSquareText className="w-5 h-5" />,
    path: "/conversations"
  },
  {
    title: "Segmentation",
    icon: <Users className="w-5 h-5" />,
    path: "/segmentation"
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    path: "/settings"
  }
];

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const isMobile = useIsMobile();

  const SidebarContent = () => (
    <div className={cn(
      "h-full flex flex-col bg-sidebar border-r",
      collapsed ? "w-[60px]" : "w-[240px]"
    )}>
      <div className="p-4 flex items-center justify-between border-b">
        {!collapsed && (
          <div className="font-bold text-lg text-sidebar-foreground">
            CTWA Analytics
          </div>
        )}
        {!isMobile && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>
      
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => (
            <li key={item.title}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  isActive 
                    ? "bg-sidebar-primary text-sidebar-primary-foreground" 
                    : "text-sidebar-foreground",
                  collapsed && "justify-center"
                )}
              >
                {item.icon}
                {!collapsed && <span>{item.title}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t text-xs text-sidebar-foreground">
        {!collapsed && <div>Netcore WhatsApp Module</div>}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full">
      {isMobile ? (
        <>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[240px]">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <main className="flex-1 overflow-auto pt-16 pb-4 px-4">
            <Outlet />
          </main>
        </>
      ) : (
        <>
          <SidebarContent />
          <main className="flex-1 overflow-auto py-4 px-6">
            <Outlet />
          </main>
        </>
      )}
    </div>
  );
};

export default DashboardLayout;

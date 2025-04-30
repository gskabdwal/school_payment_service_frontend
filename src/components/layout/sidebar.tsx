
import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { 
  CreditCard, 
  FileText, 
  LogOut, 
  School2
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const navItems = [
    { 
      name: "Transactions", 
      href: "/transactions", 
      icon: CreditCard 
    },
    { 
      name: "By School", 
      href: "/by-school", 
      icon: School2 
    },
    { 
      name: "Status Check", 
      href: "/status-check", 
      icon: FileText 
    }
  ];

  return (
    <aside className={cn("pb-12 w-64 bg-sidebar border-r flex-shrink-0", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <Link to="/" className="flex items-center gap-2 px-2">
            <div className="h-8 w-8 rounded-full bg-scholar-600 flex items-center justify-center">
              <School2 size={18} className="text-white" />
            </div>
            <h2 className="text-lg font-semibold tracking-tight">
              ScholarPay
            </h2>
          </Link>
        </div>
        <div className="px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  isActive(item.href) 
                    ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-auto px-3 py-2 border-t">
        <div className="space-y-1 mt-4">
          <button
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={() => {
              // Handle logout
              localStorage.removeItem('token');
              window.location.href = '/sign-in';
            }}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

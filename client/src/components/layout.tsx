import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, Users, PlusCircle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", icon: PlusCircle, label: "New Report" },
    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/reports", icon: FileText, label: "All Reports" },
    { href: "/customers", icon: Users, label: "Customers" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-sidebar border-r border-border flex-shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2 font-bold text-xl text-sidebar-primary-foreground">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>SalesTracker</span>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  location === item.href
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-sidebar-border">
          <div className="text-xs text-sidebar-foreground/60">
            Mockup Mode • v1.0
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b flex items-center justify-between bg-sidebar">
         <div className="flex items-center gap-2 font-bold text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            <span>SalesTracker</span>
          </div>
      </div>
      
      {/* Mobile Bottom Nav (optional, simplifed for now) */}

      <main className="flex-1 overflow-y-auto bg-background">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}

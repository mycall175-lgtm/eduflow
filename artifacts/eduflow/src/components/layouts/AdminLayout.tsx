import React from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, BookOpen, Video, MessageSquare, User, LogOut, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { admin, logoutAdmin } = useAuth();

  const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Playlists", href: "/admin/playlists", icon: BookOpen },
    { name: "Content", href: "/admin/content", icon: Video },
    { name: "Comments", href: "/admin/comments", icon: MessageSquare },
    { name: "Profile", href: "/admin/profile", icon: User },
  ];

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="px-4 py-4 border-b">
        <Link href="/admin" className="font-bold text-primary">
          EduFlow Admin
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
              location === item.href || (location.startsWith(item.href) && item.href !== '/admin')
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="p-3 border-t">
        <div className="text-sm font-medium truncate mb-1">{admin?.name}</div>
        <div className="text-xs text-muted-foreground truncate mb-3">{admin?.email}</div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => logoutAdmin()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  );

  return (
    <div className="grid min-h-screen md:grid-cols-[220px_1fr]">
      <div className="hidden border-r md:block bg-background">
        <SidebarContent />
      </div>
      <div className="flex flex-col">
        <header className="flex h-12 items-center gap-3 border-b px-4 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[220px] p-0">
              <SidebarContent />
            </SheetContent>
          </Sheet>
          <span className="font-medium text-sm">EduFlow Admin</span>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

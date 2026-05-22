import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Menu } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, logoutStudent } = useAuth();
  const [location] = useLocation();

  const navLinks = [
    { href: "/courses", label: "Courses" },
    { href: "/teachers", label: "Teachers" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="border-b bg-white dark:bg-background">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-lg text-primary">
            EduFlow
          </Link>
          <nav className="hidden md:flex gap-6 text-sm">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition-colors hover:text-foreground ${
                  location === href ? "text-foreground font-medium" : "text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                  <UserIcon className="h-4 w-4" />
                  {user.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="px-2 py-1.5 text-sm text-muted-foreground">{user.email}</div>
                <DropdownMenuItem asChild>
                  <Link href="/bookmarks" className="cursor-pointer w-full">Bookmarks</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => logoutStudent()} className="cursor-pointer text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">Log in</Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {navLinks.map(({ href, label }) => (
                <DropdownMenuItem key={href} asChild>
                  <Link href={href} className="w-full">{label}</Link>
                </DropdownMenuItem>
              ))}
              {!user ? (
                <>
                  <DropdownMenuItem asChild><Link href="/login" className="w-full">Log in</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link href="/register" className="w-full">Sign up</Link></DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild><Link href="/bookmarks" className="w-full">Bookmarks</Link></DropdownMenuItem>
                  <DropdownMenuItem onClick={() => logoutStudent()} className="text-destructive">Log out</DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} EduFlow. All rights reserved.
        <span className="mx-2">·</span>
        <Link href="/admin/login" className="text-primary hover:underline">Tutor login</Link>
      </footer>
    </div>
  );
}

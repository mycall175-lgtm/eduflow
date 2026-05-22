import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { StudentLayout } from "@/components/layouts/StudentLayout";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import NotFound from "@/pages/not-found";

import Home from "@/pages/Home";
import Courses from "@/pages/Courses";
import CourseDetail from "@/pages/CourseDetail";
import WatchVideo from "@/pages/WatchVideo";
import Teachers from "@/pages/Teachers";
import TeacherDetail from "@/pages/TeacherDetail";
import Bookmarks from "@/pages/Bookmarks";
import Search from "@/pages/Search";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminPlaylists from "@/pages/admin/Playlists";
import AdminPlaylistForm from "@/pages/admin/PlaylistForm";
import AdminContent from "@/pages/admin/Content";
import AdminContentForm from "@/pages/admin/ContentForm";
import AdminComments from "@/pages/admin/Comments";
import AdminProfile from "@/pages/admin/Profile";
import { useEffect } from "react";

const queryClient = new QueryClient();

function ProtectedStudentRoute({ component: Component, ...rest }: any) {
  const { user, isLoadingStudent } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoadingStudent && !user) {
      setLocation("/login");
    }
  }, [user, isLoadingStudent, setLocation]);

  if (isLoadingStudent) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return null;

  return <Component {...rest} />;
}

function ProtectedAdminRoute({ component: Component, ...rest }: any) {
  const { admin, isLoadingAdmin } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoadingAdmin && !admin) {
      setLocation("/admin/login");
    }
  }, [admin, isLoadingAdmin, setLocation]);

  if (isLoadingAdmin) return <div className="p-8 text-center">Loading...</div>;
  if (!admin) return null;

  return <Component {...rest} />;
}

function Router() {
  const [location] = useLocation();
  const isAdmin = location.startsWith("/admin");

  if (isAdmin) {
    if (location === "/admin/login") {
      return (
        <Switch>
          <Route path="/admin/login" component={AdminLogin} />
        </Switch>
      );
    }
    
    return (
      <AdminLayout>
        <Switch>
          <Route path="/admin">
            {(params) => <ProtectedAdminRoute component={AdminDashboard} />}
          </Route>
          <Route path="/admin/playlists">
            {(params) => <ProtectedAdminRoute component={AdminPlaylists} />}
          </Route>
          <Route path="/admin/playlists/new">
            {(params) => <ProtectedAdminRoute component={AdminPlaylistForm} />}
          </Route>
          <Route path="/admin/playlists/:id/edit">
            {(params) => <ProtectedAdminRoute component={AdminPlaylistForm} params={params} />}
          </Route>
          <Route path="/admin/content">
            {(params) => <ProtectedAdminRoute component={AdminContent} />}
          </Route>
          <Route path="/admin/content/new">
            {(params) => <ProtectedAdminRoute component={AdminContentForm} />}
          </Route>
          <Route path="/admin/content/:id/edit">
            {(params) => <ProtectedAdminRoute component={AdminContentForm} params={params} />}
          </Route>
          <Route path="/admin/comments">
            {(params) => <ProtectedAdminRoute component={AdminComments} />}
          </Route>
          <Route path="/admin/profile">
            {(params) => <ProtectedAdminRoute component={AdminProfile} />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </AdminLayout>
    );
  }

  return (
    <StudentLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/courses" component={Courses} />
        <Route path="/courses/:id" component={CourseDetail} />
        <Route path="/watch/:id" component={WatchVideo} />
        <Route path="/teachers" component={Teachers} />
        <Route path="/teachers/:id" component={TeacherDetail} />
        <Route path="/search" component={Search} />
        <Route path="/login" component={Login} />
        <Route path="/register" component={Register} />
        <Route path="/about" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/bookmarks">
          {(params) => <ProtectedStudentRoute component={Bookmarks} />}
        </Route>
        <Route component={NotFound} />
      </Switch>
    </StudentLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="eduflow-theme">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;

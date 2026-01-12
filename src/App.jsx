import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Switch, Route } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";

const queryClient = new QueryClient();

function Router() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('=== ROUTER DEBUG ===');
    console.log('User state:', user);
    console.log('Loading state:', isLoading);
    console.log('LocalStorage user:', localStorage.getItem('user'));
    console.log('===================');
  }, [user, isLoading]);

  if (isLoading) {
    console.log('Router: Showing loading spinner');
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#90243A]">
        <Loader2 className="h-12 w-12 text-white animate-spin" />
        <div className="ml-4 text-white">Checking authentication...</div>
      </div>
    );
  }

  if (!user) {
    console.log('Router: No user found, showing login routes');
    return (
      <Switch>
        <Route path="/login" component={LoginPage} />
        <Route path="/" component={LoginPage} />
        <Route component={NotFound} />
      </Switch>
    );
  }

  console.log('Router: User found, showing dashboard routes');
  return (
    <Switch>
      <Route path="/" component={DashboardPage} />
      <Route path="/login" component={DashboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
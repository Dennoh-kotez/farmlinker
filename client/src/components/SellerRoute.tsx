import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface SellerRouteProps {
  component: React.ComponentType<any>;
  params?: Record<string, string>;
}

export default function SellerRoute({ component: Component, params }: SellerRouteProps) {
  const { isAuthenticated, isLoading, isSeller } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        const currentPath = window.location.pathname;
        setLocation(`/login?redirect=${encodeURIComponent(currentPath)}`);
      } else if (!isSeller) {
        // Redirect to dashboard if authenticated but not a seller
        setLocation("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, isSeller, setLocation]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    );
  }
  
  // Only render the component if authenticated and is a seller
  return isAuthenticated && isSeller ? <Component {...params} /> : null;
}
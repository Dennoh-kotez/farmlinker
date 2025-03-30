import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { User } from "@shared/schema";

interface AuthContextType {
  user: Omit<User, "password"> | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: any) => Promise<boolean>;
  logout: () => void;
  isSeller: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Omit<User, "password"> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("farmlinker_token");
    const storedUser = localStorage.getItem("farmlinker_user");
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user data");
        localStorage.removeItem("farmlinker_token");
        localStorage.removeItem("farmlinker_user");
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest("/api/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid email or password",
          variant: "destructive",
        });
        return false;
      }

      // Store the token and user data
      localStorage.setItem("farmlinker_token", data.token);
      localStorage.setItem("farmlinker_user", JSON.stringify(data.user));
      
      // Update state
      setUser(data.user);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${data.user.name}!`,
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await apiRequest("/api/register", {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        toast({
          title: "Registration Failed",
          description: data.message || "Could not create your account",
          variant: "destructive",
        });
        return false;
      }
      
      toast({
        title: "Registration Successful",
        description: "Your account has been created. You can now log in.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "An error occurred during registration. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("farmlinker_token");
    localStorage.removeItem("farmlinker_user");
    setUser(null);
    
    toast({
      title: "Logged Out",
      description: "You have been logged out successfully.",
    });
  };

  const isSeller = user?.role === "seller" || user?.role === "both";

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    isSeller,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
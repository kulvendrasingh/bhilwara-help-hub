import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

// Define user type
export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
};

// Define the auth context type
type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

// Generate a random ID (for demo purposes)
const generateId = () => Math.random().toString(36).substring(2, 15);

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("bhilwara-user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("bhilwara-user");
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes - in a real app, this would validate via API
      const mockUser: User = {
        id: generateId(),
        name: email.split('@')[0],
        email,
        createdAt: new Date(),
      };
      
      setUser(mockUser);
      localStorage.setItem("bhilwara-user", JSON.stringify(mockUser));
      toast.success("Login successful!");
    } catch (error) {
      toast.error("Login failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // For demo purposes - in a real app, this would register via API
      const newUser: User = {
        id: generateId(),
        name,
        email,
        createdAt: new Date(),
      };
      
      setUser(newUser);
      localStorage.setItem("bhilwara-user", JSON.stringify(newUser));
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("bhilwara-user");
    toast.success("Logged out successfully");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);

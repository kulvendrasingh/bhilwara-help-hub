
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { User as SupabaseUser } from '@supabase/supabase-js';

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
  supabaseConfigured: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  supabaseConfigured: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

// Map Supabase user to our User type
const mapSupabaseUser = (supabaseUser: SupabaseUser): User => {
  return {
    id: supabaseUser.id,
    name: supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || '',
    email: supabaseUser.email || '',
    avatar: supabaseUser.user_metadata?.avatar_url,
    createdAt: new Date(supabaseUser.created_at || Date.now()),
  };
};

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseConfigured, setSupabaseConfigured] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        setIsLoading(true);
        
        // Check if Supabase is configured
        const configured = isSupabaseConfigured();
        setSupabaseConfigured(configured);
        
        if (!configured) {
          console.warn("Supabase is not properly configured. Authentication will not work.");
          setIsLoading(false);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }
        
        if (data?.session?.user) {
          setUser(mapSupabaseUser(data.session.user));
        }
      } catch (error) {
        console.error("Session check error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth subscription
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(mapSupabaseUser(session.user));
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      if (!supabaseConfigured) {
        toast.error("Authentication is not configured. Please set up Supabase environment variables.");
        return;
      }
      
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        setUser(mapSupabaseUser(data.user));
        toast.success("Login successful!");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (name: string, email: string, password: string) => {
    try {
      if (!supabaseConfigured) {
        toast.error("Authentication is not configured. Please set up Supabase environment variables.");
        return;
      }
      
      setIsLoading(true);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data?.user) {
        toast.success("Registration successful! Please check your email to confirm your account.");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Registration failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      if (!supabaseConfigured) {
        setUser(null);
        return;
      }
      
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      toast.success("Logged out successfully");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Logout failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        supabaseConfigured,
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

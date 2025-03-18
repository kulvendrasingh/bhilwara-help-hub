
import { createClient } from '@supabase/supabase-js';

// Get Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client with default values to prevent errors when not configured
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== '' && supabaseAnonKey !== '';
};

// Helper to verify email confirmation status
export const checkEmailConfirmationStatus = async (email: string) => {
  if (!isSupabaseConfigured()) {
    return { confirmed: false, error: 'Supabase not configured' };
  }
  
  try {
    // This will return user data if the email exists and is confirmed
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false, // Don't create a new user
      },
    });
    
    // If there's no error and data exists, the email is confirmed
    return { 
      confirmed: !error && !!data, 
      error: error?.message 
    };
  } catch (error: any) {
    return { 
      confirmed: false, 
      error: error?.message || 'Failed to check email confirmation status'
    };
  }
};


import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { PageLayout } from "@/components/PageLayout";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Info } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function RegisterPage() {
  const { register, supabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!supabaseConfigured) {
      toast.error("Authentication is not configured. Please set up Supabase environment variables.");
      return;
    }

    setIsLoading(true);
    try {
      await register(values.name, values.email, values.password);
      setRegisteredEmail(values.email);
      setSuccessMessage("Account created successfully! Please check your email to confirm your account.");
      form.reset();
    } catch (error) {
      console.error("Registration error:", error);
      // Toast is already handled in the AuthContext
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout>
      <div className="container relative flex py-20 flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-gradient-to-r from-bhilwara-600 to-blue-700" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Bhilwara Help Hub
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;By joining our community, you're contributing to making Bhilwara a better place for everyone. Share your knowledge and get help when you need it.&rdquo;
              </p>
              <footer className="text-sm">Bhilwara Community Team</footer>
            </blockquote>
          </div>
        </div>
        <div className="p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to create your account
              </p>
            </div>
            
            {!supabaseConfigured && (
              <Alert className="bg-amber-50 text-amber-800 border-amber-200">
                <Info className="h-4 w-4" />
                <AlertTitle>Supabase not configured</AlertTitle>
                <AlertDescription>
                  Please set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
                </AlertDescription>
              </Alert>
            )}
            
            {successMessage ? (
              <div className="bg-green-50 p-6 rounded-md border border-green-200 animate-fade-in">
                <h3 className="font-medium text-green-800 mb-2">Account Created Successfully!</h3>
                <p className="text-green-700 text-sm mb-4">
                  We've sent a confirmation email to <strong>{registeredEmail}</strong>. 
                  Please check your inbox and click the confirmation link to activate your account.
                </p>
                <Alert className="bg-blue-50 text-blue-800 border-blue-200 mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription className="text-xs">
                    You won't be able to log in until you confirm your email address. 
                    If you don't see the email, please check your spam folder.
                  </AlertDescription>
                </Alert>
                <div className="flex gap-3">
                  <Button 
                    className="flex-1" 
                    variant="outline"
                    onClick={() => navigate("/login")}
                  >
                    Go to Login
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={() => {
                      setSuccessMessage("");
                      setRegisteredEmail("");
                    }}
                  >
                    Register Another
                  </Button>
                </div>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="name@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Creating account..." : "Create account"}
                  </Button>
                </form>
              </Form>
            )}
            
            <p className="px-8 text-center text-sm text-muted-foreground mt-4">
              Already have an account?{" "}
              <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

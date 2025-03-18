
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Mail, User, Shield, LogOut } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";

// Define schema for profile update form
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function ProfilePage() {
  const { user, logout, isLoading, supabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  // If not logged in, redirect to login page
  if (!isLoading && !user) {
    navigate("/login");
    return null;
  }

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  // Function to handle form submission
  async function onSubmit(data: ProfileFormValues) {
    setIsUpdating(true);
    try {
      // In a real app, you would update the user's profile in your database/Supabase here
      toast.success("Profile updated successfully");
      // For now, we'll just show a success message
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  }

  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <PageLayout>
      <div className="container max-w-4xl py-10">
        <div className="flex flex-col space-y-8 md:space-y-10">
          {/* Page header */}
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
            <p className="text-muted-foreground">
              Manage your account settings and profile
            </p>
          </div>

          {isLoading ? (
            // Loading state
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <p className="text-sm text-muted-foreground">Loading profile...</p>
              </div>
            </div>
          ) : !supabaseConfigured ? (
            // Supabase not configured
            <Card>
              <CardHeader>
                <CardTitle>Supabase Not Configured</CardTitle>
                <CardDescription>
                  Authentication service is not properly configured.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Please set up your Supabase environment variables:
                </p>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-2">
                  <li>VITE_SUPABASE_URL</li>
                  <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Profile content */}
              <div className="flex flex-col md:flex-row gap-8">
                {/* User info card */}
                <Card className="flex-1 min-w-[280px] max-w-[350px] h-fit">
                  <CardHeader className="pb-3">
                    <CardTitle>Your Account</CardTitle>
                    <CardDescription>View and manage your account details</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-4 pt-2">
                    <Avatar className="h-24 w-24">
                      {user?.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="text-xl bg-bhilwara-100 text-bhilwara-600">
                          {getInitials(user?.name || "")}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="text-center">
                      <h3 className="text-lg font-medium">{user?.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{user?.email}</p>
                    </div>
                    <div className="w-full pt-2">
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <Shield className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Account type</span>
                        </div>
                        <span className="text-sm font-medium">Standard</span>
                      </div>
                      <div className="flex justify-between items-center py-2">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Member since</span>
                        </div>
                        <span className="text-sm font-medium">
                          {user?.createdAt ? format(user.createdAt, 'MMM d, yyyy') : "N/A"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-center pt-2 pb-6">
                    <Button 
                      variant="outline" 
                      className="w-full text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </Button>
                  </CardFooter>
                </Card>

                {/* Tabs for different settings */}
                <div className="flex-1">
                  <Tabs defaultValue="profile" className="w-full">
                    <TabsList className="mb-4">
                      <TabsTrigger value="profile">Profile</TabsTrigger>
                      <TabsTrigger value="account">Account</TabsTrigger>
                    </TabsList>
                    
                    {/* Profile Settings */}
                    <TabsContent value="profile">
                      <Card>
                        <CardHeader>
                          <CardTitle>Profile Information</CardTitle>
                          <CardDescription>
                            Update your profile information
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                              <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Your name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <div className="flex justify-end mt-6">
                                <Button type="submit" disabled={isUpdating}>
                                  {isUpdating ? "Updating..." : "Update profile"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    {/* Account Settings */}
                    <TabsContent value="account">
                      <Card>
                        <CardHeader>
                          <CardTitle>Account Settings</CardTitle>
                          <CardDescription>
                            Manage your account settings and preferences
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-1">
                            <Label htmlFor="email">Email</Label>
                            <div className="flex">
                              <Input
                                id="email"
                                value={user?.email}
                                readOnly
                                className="bg-muted"
                              />
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Your email address is used for login and notifications
                            </p>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="space-y-1">
                            <h4 className="text-sm font-medium">Account Deletion</h4>
                            <p className="text-xs text-muted-foreground">
                              Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button variant="destructive" size="sm" className="mt-2">
                              Delete account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageLayout>
  );
}

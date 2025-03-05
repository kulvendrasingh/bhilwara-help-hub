
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DataService } from "@/lib/data-service";
import { PageLayout } from "@/components/PageLayout";
import { toast } from "@/components/ui/sonner";

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }).max(100, {
    message: "Title must be at most 100 characters."
  }),
  content: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  categoryId: z.string({
    required_error: "Please select a category.",
  }),
});

export default function NewProblemPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      categoryId: "",
    },
  });
  
  const categories = DataService.getCategories();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast.error("You must be logged in to post a problem.");
      navigate("/login");
      return;
    }
    
    setIsLoading(true);
    try {
      const newProblem = DataService.createProblem({
        title: values.title,
        content: values.content,
        categoryId: values.categoryId,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
      });
      
      toast.success("Problem posted successfully!");
      navigate(`/problem/${newProblem.id}`);
    } catch (error) {
      console.error("Error posting problem:", error);
      toast.error("Failed to post problem. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <PageLayout>
      <div className="container max-w-3xl mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Post a New Problem</h1>
          <p className="text-muted-foreground">
            Share your problem with the community to get help and solutions
          </p>
        </div>
        
        {!user ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <h3 className="font-medium text-yellow-800 mb-2">You need to be logged in</h3>
            <p className="text-yellow-700 mb-4">Please log in or create an account to post a problem.</p>
            <div className="flex gap-4">
              <Button onClick={() => navigate("/login")}>Log In</Button>
              <Button variant="outline" onClick={() => navigate("/register")}>Create Account</Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter a clear, specific title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Problem Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your problem in detail. Include what you've tried and any relevant information that might help others understand your situation."
                          className="min-h-[200px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Posting..." : "Post Problem"}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}
      </div>
    </PageLayout>
  );
}


import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataService } from "@/lib/data-service";
import { PageLayout } from "@/components/PageLayout";
import { 
  Droplet, 
  Zap, 
  Trash, 
  BookOpen, 
  Shield, 
  HelpCircle, 
  HeartPulse,
  AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import RoadIcon from "@/components/icons/RoadIcon";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<ReturnType<typeof DataService.getCategories>>([]);
  
  useEffect(() => {
    try {
      // Fetch categories safely
      const fetchedCategories = DataService.getCategories();
      setCategories(fetchedCategories);
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading categories:', error);
      setHasError(true);
      setIsLoading(false);
    }
  }, []);
  
  // Map of category icons
  const categoryIcons: Record<string, React.ReactNode> = {
    "water-supply": <Droplet size={36} className="text-blue-500" />,
    "electricity": <Zap size={36} className="text-yellow-500" />,
    "roads-transport": <RoadIcon size={36} className="text-orange-500" />,
    "waste-management": <Trash size={36} className="text-green-500" />,
    "healthcare": <HeartPulse size={36} className="text-red-500" />,
    "education": <BookOpen size={36} className="text-purple-500" />,
    "public-safety": <Shield size={36} className="text-slate-500" />,
    "others": <HelpCircle size={36} className="text-gray-500" />,
  };
  
  // Get count of problems per category
  const getProblemCount = (categoryId: string) => {
    try {
      return DataService.getProblemsByCategory(categoryId).length;
    } catch (error) {
      console.error(`Error getting problem count for category ${categoryId}:`, error);
      return 0;
    }
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <PageLayout>
        <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center items-center min-h-[50vh]">
          <p className="text-lg text-muted-foreground">Loading categories...</p>
        </div>
      </PageLayout>
    );
  }
  
  // Show error state
  if (hasError) {
    return (
      <PageLayout>
        <div className="container mx-auto py-10 px-4 md:px-6 flex flex-col justify-center items-center min-h-[50vh]">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the categories. Please try again later.
          </p>
          <Button onClick={() => window.location.reload()}>Refresh page</Button>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Browse by Category</h1>
          <p className="text-muted-foreground">
            Find problems and solutions organized by categories
          </p>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-12">
            <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h2 className="text-xl font-medium mb-2">No categories found</h2>
            <p className="text-muted-foreground">
              There are no categories available at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.id} 
                className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/category/${category.slug}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full p-4 bg-slate-100">
                      {categoryIcons[category.slug] || <HelpCircle size={36} className="text-gray-500" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {getProblemCount(category.id)} problems
                      </p>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            If your problem doesn't fit into any of these categories, you can still post it and get help from the community.
          </p>
          <Button onClick={() => navigate("/new-problem")}>Post a New Problem</Button>
        </div>
      </div>
    </PageLayout>
  );
}

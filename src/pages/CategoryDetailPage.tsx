
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, ThumbsUp, MessageSquare, AlertCircle } from "lucide-react";
import { DataService } from "@/lib/data-service";
import { PageLayout } from "@/components/PageLayout";
import { format } from "date-fns";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("all");
  
  // Get category by slug
  const category = DataService.getCategoryBySlug(slug || "");
  
  if (!category) {
    return (
      <PageLayout>
        <div className="container mx-auto py-12 px-4">
          <div className="text-center">
            <AlertCircle size={48} className="mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Category Not Found</h1>
            <p className="text-muted-foreground mb-6">The category you're looking for doesn't exist.</p>
            <Button onClick={() => navigate("/categories")}>Go Back to Categories</Button>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  // Get problems for this category
  const problems = DataService.getProblemsByCategory(category.id);
  
  // Filter problems based on tab selection
  const filteredProblems = problems.filter(problem => {
    if (selectedTab === "all") return true;
    if (selectedTab === "solved") return problem.solved;
    if (selectedTab === "unsolved") return !problem.solved;
    return true;
  });
  
  return (
    <PageLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" onClick={() => navigate("/categories")}>
              ← Back to Categories
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
              <p className="text-muted-foreground max-w-2xl">{category.description}</p>
            </div>
            <Button onClick={() => navigate("/new-problem", { state: { categoryId: category.id } })}>
              Post Problem in this Category
            </Button>
          </div>
        </div>
        
        <div className="mb-6">
          <Tabs defaultValue="all" onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="all">All Problems ({problems.length})</TabsTrigger>
              <TabsTrigger value="solved">Solved ({problems.filter(p => p.solved).length})</TabsTrigger>
              <TabsTrigger value="unsolved">Unsolved ({problems.filter(p => !p.solved).length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredProblems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-medium mb-2">No problems found</h2>
            <p className="text-muted-foreground mb-6">
              {selectedTab === "all" 
                ? "There are no problems in this category yet." 
                : `There are no ${selectedTab} problems in this category.`}
            </p>
            <Button onClick={() => navigate("/new-problem", { state: { categoryId: category.id } })}>
              Be the first to post a problem
            </Button>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredProblems.map((problem) => (
              <Card key={problem.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-2 hover:text-blue-600 cursor-pointer" onClick={() => navigate(`/problems/${problem.id}`)}>
                        {problem.title}
                      </CardTitle>
                      <CardDescription>
                        Posted by {problem.authorName} on {format(new Date(problem.createdAt), "MMMM dd, yyyy")}
                      </CardDescription>
                    </div>
                    {problem.solved && (
                      <Badge variant="default" className="bg-green-600">Solved</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{problem.content}</p>
                </CardContent>
                <CardFooter className="border-t bg-muted/30 flex gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ThumbsUp size={16} />
                    <span>{problem.upvotes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare size={16} />
                    <span>
                      {DataService.getCommentsByParent("problem", problem.id).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={16} />
                    <span>
                      {format(new Date(problem.updatedAt), "MMM dd, yyyy")}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}

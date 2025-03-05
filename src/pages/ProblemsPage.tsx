
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DataService } from "@/lib/data-service";
import { Problem } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, ThumbsUp, Eye, PlusCircle, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProblemsPage() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all');
  const [sort, setSort] = useState<'newest' | 'popular'>('newest');
  
  useEffect(() => {
    const fetchProblems = () => {
      const allProblems = DataService.getProblems();
      setProblems(allProblems);
    };
    
    fetchProblems();
    
    // Refresh problems every 30 seconds (in case of new posts)
    const intervalId = setInterval(fetchProblems, 30000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    let result = [...problems];
    
    // Apply filter
    if (filter === 'solved') {
      result = result.filter(problem => problem.solved);
    } else if (filter === 'unsolved') {
      result = result.filter(problem => !problem.solved);
    }
    
    // Apply sort
    if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'popular') {
      result.sort((a, b) => b.upvotes - a.upvotes);
    }
    
    setFilteredProblems(result);
  }, [problems, filter, sort]);
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  const getCategoryName = (categoryId: string) => {
    const category = DataService.getCategoryById(categoryId);
    return category ? category.name : 'Uncategorized';
  };
  
  return (
    <PageLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Problems</h1>
            <p className="text-muted-foreground">
              Browse through problems posted by the Bhilwara community
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Filter size={16} className="mr-2" />
                  Filter
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  All Problems
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('solved')}>
                  Solved Only
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unsolved')}>
                  Unsolved Only
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  Sort: {sort === 'newest' ? 'Newest' : 'Popular'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSort('newest')}>
                  Newest First
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSort('popular')}>
                  Most Popular
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user && (
              <Button size="sm" className="h-9" asChild>
                <Link to="/new-problem">
                  <PlusCircle size={16} className="mr-2" />
                  Post Problem
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all" onClick={() => setFilter('all')}>All Problems</TabsTrigger>
            <TabsTrigger value="solved" onClick={() => setFilter('solved')}>Solved</TabsTrigger>
            <TabsTrigger value="unsolved" onClick={() => setFilter('unsolved')}>Unsolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {filteredProblems.length === 0 ? (
              <div className="text-center py-20">
                <h3 className="text-xl font-medium mb-2">No problems found</h3>
                <p className="text-muted-foreground mb-6">Be the first to post a problem!</p>
                {user ? (
                  <Button asChild>
                    <Link to="/new-problem">Post a Problem</Link>
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/register">Create an Account</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredProblems.map((problem, index) => (
                  <Card key={problem.id} className="overflow-hidden animate-fade-in transition-shadow hover:shadow-md" style={{ animationDelay: `${index * 50}ms` }}>
                    <Link to={`/problem/${problem.id}`}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={problem.solved ? "default" : "outline"} className={problem.solved ? "bg-green-500 hover:bg-green-600" : ""}>
                                {problem.solved ? "Solved" : "Unsolved"}
                              </Badge>
                              <Badge variant="outline">{getCategoryName(problem.categoryId)}</Badge>
                            </div>
                            <CardTitle className="text-xl hover:text-bhilwara-600 transition-colors">
                              {problem.title}
                            </CardTitle>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <p className="text-muted-foreground line-clamp-2">
                          {problem.content}
                        </p>
                      </CardContent>
                      <CardFooter className="flex items-center justify-between text-sm text-muted-foreground pt-0">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <ThumbsUp size={14} /> {problem.upvotes}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare size={14} /> {DataService.getSolutionsByProblem(problem.id).length}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} /> {problem.views}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>Posted by {problem.authorName}</span>
                          <span>•</span>
                          <span>{formatDate(problem.createdAt)}</span>
                        </div>
                      </CardFooter>
                    </Link>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="solved" className="mt-0">
            {/* Content will be controlled by the filter state */}
          </TabsContent>
          
          <TabsContent value="unsolved" className="mt-0">
            {/* Content will be controlled by the filter state */}
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}

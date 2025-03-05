
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { DataService } from "@/lib/data-service";
import { Problem, Solution } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown, 
  Eye,
  Calendar,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function ProblemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [problem, setProblem] = useState<Problem | null>(null);
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [newSolution, setNewSolution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    if (id) {
      const foundProblem = DataService.getProblemById(id);
      if (foundProblem) {
        setProblem(foundProblem);
        // Increment view count
        DataService.incrementProblemViews(id);
        
        // Fetch solutions
        const problemSolutions = DataService.getSolutionsByProblem(id);
        setSolutions(problemSolutions);
      } else {
        toast.error("Problem not found");
        navigate("/problems");
      }
    }
  }, [id, navigate]);
  
  const handleSubmitSolution = () => {
    if (!user) {
      toast.error("You must be logged in to post a solution");
      return;
    }
    
    if (!newSolution.trim()) {
      toast.error("Solution cannot be empty");
      return;
    }
    
    if (!problem) return;
    
    setIsSubmitting(true);
    
    try {
      const solution = DataService.createSolution({
        content: newSolution,
        problemId: problem.id,
        authorId: user.id,
        authorName: user.name,
        authorAvatar: user.avatar,
      });
      
      setSolutions([solution, ...solutions]);
      setNewSolution("");
      toast.success("Solution posted successfully!");
    } catch (error) {
      toast.error("Failed to post solution");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleUpvoteSolution = (solutionId: string) => {
    if (!user) {
      toast.error("You must be logged in to vote");
      return;
    }
    
    const solution = DataService.getSolutionById(solutionId);
    if (solution) {
      const updatedSolution = DataService.updateSolution(solutionId, {
        upvotes: solution.upvotes + 1,
      });
      
      if (updatedSolution) {
        setSolutions(solutions.map(s => s.id === solutionId ? updatedSolution : s));
        toast.success("Upvoted solution");
      }
    }
  };
  
  const handleAcceptSolution = (solutionId: string) => {
    if (!user || !problem || user.id !== problem.authorId) {
      toast.error("Only the author can mark a solution as accepted");
      return;
    }
    
    // Update solution as accepted
    const updatedSolution = DataService.updateSolution(solutionId, { accepted: true });
    
    // Update problem as solved
    const updatedProblem = DataService.updateProblem(problem.id, { solved: true });
    
    if (updatedSolution && updatedProblem) {
      setSolutions(solutions.map(s => s.id === solutionId ? { ...s, accepted: true } : s));
      setProblem(updatedProblem);
      toast.success("Solution accepted!");
    }
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (!problem) {
    return (
      <PageLayout>
        <div className="container mx-auto py-20 text-center">
          <h2 className="text-2xl font-bold">Loading problem...</h2>
        </div>
      </PageLayout>
    );
  }
  
  const getCategoryName = (categoryId: string) => {
    const category = DataService.getCategoryById(categoryId);
    return category ? category.name : 'Uncategorized';
  };

  return (
    <PageLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-6">
          <Link to="/problems" className="text-muted-foreground hover:text-foreground">
            ← Back to all problems
          </Link>
        </div>
        
        <div className="space-y-8">
          {/* Problem details */}
          <div className="bg-card rounded-lg border shadow-sm p-6 animate-fade-in">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant={problem.solved ? "default" : "outline"} className={problem.solved ? "bg-green-500 hover:bg-green-500" : ""}>
                {problem.solved ? "Solved" : "Unsolved"}
              </Badge>
              <Badge variant="outline">{getCategoryName(problem.categoryId)}</Badge>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-bold mb-4">{problem.title}</h1>
            
            <div className="flex flex-wrap text-sm text-muted-foreground gap-4 mb-6">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Posted {formatDate(problem.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{problem.views} views</span>
              </div>
              <div>
                <span>Posted by {problem.authorName}</span>
              </div>
            </div>
            
            <div className="prose max-w-none mb-6">
              <p className="whitespace-pre-wrap">{problem.content}</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="gap-1"
                onClick={() => {
                  if (!user) {
                    toast.error("You must be logged in to upvote");
                    return;
                  }
                  
                  const updatedProblem = DataService.updateProblem(problem.id, {
                    upvotes: problem.upvotes + 1,
                  });
                  
                  if (updatedProblem) {
                    setProblem(updatedProblem);
                    toast.success("Problem upvoted");
                  }
                }}
              >
                <ThumbsUp size={16} />
                <span>{problem.upvotes}</span>
              </Button>
              
              <span className="text-muted-foreground">
                <MessageSquare size={16} className="inline mr-1" />
                {solutions.length} solutions
              </span>
            </div>
          </div>
          
          {/* Solutions section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Solutions ({solutions.length})</h2>
            </div>
            
            {/* New solution form */}
            {user ? (
              <div className="bg-card rounded-lg border p-6 animate-fade-in">
                <h3 className="text-lg font-medium mb-4">Post a Solution</h3>
                <Textarea 
                  placeholder="Share your solution or suggestion..."
                  className="mb-4 min-h-[120px]"
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button onClick={handleSubmitSolution} disabled={isSubmitting}>
                    {isSubmitting ? "Posting..." : "Post Solution"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-card rounded-lg border p-6 animate-fade-in">
                <h3 className="text-lg font-medium mb-2">Want to share a solution?</h3>
                <p className="text-muted-foreground mb-4">
                  Please log in or create an account to post a solution.
                </p>
                <div className="flex gap-4">
                  <Button onClick={() => navigate("/login")}>Log In</Button>
                  <Button variant="outline" onClick={() => navigate("/register")}>
                    Create Account
                  </Button>
                </div>
              </div>
            )}
            
            {/* Solutions list */}
            {solutions.length === 0 ? (
              <div className="text-center py-10 border rounded-lg">
                <h3 className="text-lg font-medium mb-2">No solutions yet</h3>
                <p className="text-muted-foreground mb-4">
                  Be the first to provide a solution to this problem!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {solutions.map((solution, index) => (
                  <Card key={solution.id} className="animate-fade-in overflow-hidden" style={{ animationDelay: `${index * 100}ms` }}>
                    <CardHeader className="bg-muted/40 flex flex-row justify-between items-center pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{solution.authorName}</span>
                        <span className="text-sm text-muted-foreground">
                          • {formatDate(solution.createdAt)}
                        </span>
                      </div>
                      
                      {solution.accepted && (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <CheckCircle2 size={14} className="mr-1" />
                          Accepted Solution
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="whitespace-pre-wrap">{solution.content}</p>
                    </CardContent>
                    <Separator />
                    <CardFooter className="py-3 flex justify-between">
                      <div className="flex items-center gap-3">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-muted-foreground hover:text-foreground gap-1"
                          onClick={() => handleUpvoteSolution(solution.id)}
                        >
                          <ThumbsUp size={16} />
                          <span>{solution.upvotes}</span>
                        </Button>
                      </div>
                      
                      {user && 
                        problem.authorId === user.id && 
                        !problem.solved && 
                        !solution.accepted && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="gap-1"
                          onClick={() => handleAcceptSolution(solution.id)}
                        >
                          <CheckCircle2 size={16} />
                          Accept Solution
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

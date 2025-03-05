
import { Category, Problem, Solution, Comment } from "./types";

// Helper to generate random IDs
const generateId = () => Math.random().toString(36).substring(2, 15);

// Mock categories data
const categories: Category[] = [
  {
    id: "cat-1",
    name: "Water Supply",
    slug: "water-supply",
    icon: "droplet",
    description: "Issues related to water supply, water quality, and shortages",
  },
  {
    id: "cat-2",
    name: "Electricity",
    slug: "electricity",
    icon: "zap",
    description: "Problems with electricity, power cuts, and billing issues",
  },
  {
    id: "cat-3",
    name: "Roads & Transport",
    slug: "roads-transport",
    icon: "road",
    description: "Issues related to road conditions, public transport, and traffic",
  },
  {
    id: "cat-4",
    name: "Waste Management",
    slug: "waste-management",
    icon: "trash",
    description: "Problems with garbage collection, disposal, and cleanliness",
  },
  {
    id: "cat-5",
    name: "Healthcare",
    slug: "healthcare",
    icon: "heartPulse",
    description: "Issues related to hospitals, clinics, and healthcare services",
  },
  {
    id: "cat-6",
    name: "Education",
    slug: "education",
    icon: "graduationCap",
    description: "Problems with schools, colleges, and education quality",
  },
  {
    id: "cat-7",
    name: "Public Safety",
    slug: "public-safety",
    icon: "shield",
    description: "Issues related to law enforcement, crime, and safety concerns",
  },
  {
    id: "cat-8",
    name: "Others",
    slug: "others",
    icon: "helpCircle",
    description: "Other issues not covered by the main categories",
  }
];

// Initialize local storage
const initStorage = () => {
  if (!localStorage.getItem("bhilwara-problems")) {
    localStorage.setItem("bhilwara-problems", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("bhilwara-solutions")) {
    localStorage.setItem("bhilwara-solutions", JSON.stringify([]));
  }
  
  if (!localStorage.getItem("bhilwara-comments")) {
    localStorage.setItem("bhilwara-comments", JSON.stringify([]));
  }
};

// Call init
initStorage();

// Data service methods
export const DataService = {
  // Categories
  getCategories: (): Category[] => {
    return categories;
  },
  
  getCategoryById: (id: string): Category | undefined => {
    return categories.find(c => c.id === id);
  },
  
  getCategoryBySlug: (slug: string): Category | undefined => {
    return categories.find(c => c.slug === slug);
  },
  
  // Problems
  getProblems: (): Problem[] => {
    try {
      const problems = localStorage.getItem("bhilwara-problems");
      return problems ? JSON.parse(problems) : [];
    } catch (e) {
      console.error("Error getting problems:", e);
      return [];
    }
  },
  
  getProblemById: (id: string): Problem | undefined => {
    const problems = DataService.getProblems();
    return problems.find(p => p.id === id);
  },
  
  getProblemsByCategory: (categoryId: string): Problem[] => {
    const problems = DataService.getProblems();
    return problems.filter(p => p.categoryId === categoryId);
  },
  
  getProblemsByAuthor: (authorId: string): Problem[] => {
    const problems = DataService.getProblems();
    return problems.filter(p => p.authorId === authorId);
  },
  
  createProblem: (problem: Omit<Problem, "id" | "createdAt" | "updatedAt" | "solved" | "upvotes" | "downvotes" | "views">): Problem => {
    const problems = DataService.getProblems();
    
    const newProblem: Problem = {
      ...problem,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      solved: false,
      upvotes: 0,
      downvotes: 0,
      views: 0
    };
    
    localStorage.setItem("bhilwara-problems", JSON.stringify([newProblem, ...problems]));
    return newProblem;
  },
  
  updateProblem: (id: string, updates: Partial<Problem>): Problem | undefined => {
    const problems = DataService.getProblems();
    const index = problems.findIndex(p => p.id === id);
    
    if (index === -1) return undefined;
    
    const updatedProblem = {
      ...problems[index],
      ...updates,
      updatedAt: new Date()
    };
    
    problems[index] = updatedProblem;
    localStorage.setItem("bhilwara-problems", JSON.stringify(problems));
    
    return updatedProblem;
  },
  
  incrementProblemViews: (id: string): void => {
    const problem = DataService.getProblemById(id);
    if (problem) {
      DataService.updateProblem(id, { views: problem.views + 1 });
    }
  },
  
  // Solutions
  getSolutions: (): Solution[] => {
    try {
      const solutions = localStorage.getItem("bhilwara-solutions");
      return solutions ? JSON.parse(solutions) : [];
    } catch (e) {
      console.error("Error getting solutions:", e);
      return [];
    }
  },
  
  getSolutionById: (id: string): Solution | undefined => {
    const solutions = DataService.getSolutions();
    return solutions.find(s => s.id === id);
  },
  
  getSolutionsByProblem: (problemId: string): Solution[] => {
    const solutions = DataService.getSolutions();
    return solutions.filter(s => s.problemId === problemId);
  },
  
  getSolutionsByAuthor: (authorId: string): Solution[] => {
    const solutions = DataService.getSolutions();
    return solutions.filter(s => s.authorId === authorId);
  },
  
  createSolution: (solution: Omit<Solution, "id" | "createdAt" | "updatedAt" | "accepted" | "upvotes" | "downvotes">): Solution => {
    const solutions = DataService.getSolutions();
    
    const newSolution: Solution = {
      ...solution,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      accepted: false,
      upvotes: 0,
      downvotes: 0
    };
    
    localStorage.setItem("bhilwara-solutions", JSON.stringify([newSolution, ...solutions]));
    return newSolution;
  },
  
  updateSolution: (id: string, updates: Partial<Solution>): Solution | undefined => {
    const solutions = DataService.getSolutions();
    const index = solutions.findIndex(s => s.id === id);
    
    if (index === -1) return undefined;
    
    const updatedSolution = {
      ...solutions[index],
      ...updates,
      updatedAt: new Date()
    };
    
    solutions[index] = updatedSolution;
    localStorage.setItem("bhilwara-solutions", JSON.stringify(solutions));
    
    return updatedSolution;
  },
  
  // Comments
  getComments: (): Comment[] => {
    try {
      const comments = localStorage.getItem("bhilwara-comments");
      return comments ? JSON.parse(comments) : [];
    } catch (e) {
      console.error("Error getting comments:", e);
      return [];
    }
  },
  
  getCommentById: (id: string): Comment | undefined => {
    const comments = DataService.getComments();
    return comments.find(c => c.id === id);
  },
  
  getCommentsByParent: (parentType: 'problem' | 'solution', parentId: string): Comment[] => {
    const comments = DataService.getComments();
    return comments.filter(c => c.parentType === parentType && c.parentId === parentId);
  },
  
  createComment: (comment: Omit<Comment, "id" | "createdAt">): Comment => {
    const comments = DataService.getComments();
    
    const newComment: Comment = {
      ...comment,
      id: generateId(),
      createdAt: new Date()
    };
    
    localStorage.setItem("bhilwara-comments", JSON.stringify([newComment, ...comments]));
    return newComment;
  }
};

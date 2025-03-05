
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { 
  Menu, 
  Search, 
  User,
  LogOut,
  PlusCircle
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <div className="px-7">
              <Link to="/" className="flex items-center">
                <span className="text-xl font-bold text-bhilwara-600">Bhilwara Help Hub</span>
              </Link>
            </div>
            <div className="flex flex-col gap-4 py-4">
              <div className="px-7 py-2">
                <Link to="/problems" className="block py-2 text-lg font-medium">
                  All Problems
                </Link>
                <Link to="/categories" className="block py-2 text-lg font-medium">
                  Categories
                </Link>
                <Link to="/about" className="block py-2 text-lg font-medium">
                  About
                </Link>
                {user ? (
                  <>
                    <Link to="/new-problem" className="block py-2 text-lg font-medium">
                      Post a Problem
                    </Link>
                    <Link to="/profile" className="block py-2 text-lg font-medium">
                      My Profile
                    </Link>
                    <button 
                      onClick={() => logout()} 
                      className="block py-2 text-lg font-medium text-red-500"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block py-2 text-lg font-medium">
                      Login
                    </Link>
                    <Link to="/register" className="block py-2 text-lg font-medium">
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden text-xl font-bold sm:inline-block text-bhilwara-600">Bhilwara Help Hub</span>
          <span className="text-xl font-bold sm:hidden text-bhilwara-600">BHH</span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link 
            to="/problems" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Problems
          </Link>
          <Link 
            to="/categories" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Categories
          </Link>
          <Link 
            to="/about" 
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            About
          </Link>
        </nav>
        <div className="flex items-center space-x-4 ml-auto">
          <form onSubmit={handleSearch} className="hidden sm:flex relative">
            <Input
              type="search"
              placeholder="Search problems..."
              className="w-[200px] lg:w-[300px] pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          </form>
          
          {user ? (
            <div className="flex items-center gap-4">
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => navigate("/new-problem")}
                className="hidden md:flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4 mr-1" />
                Post
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      {user.avatar ? (
                        <img src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="bg-bhilwara-100 text-bhilwara-600">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/profile")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/new-problem")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>Post a Problem</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-red-500 focus:text-red-500" 
                    onClick={() => logout()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

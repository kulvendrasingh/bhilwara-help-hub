import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Droplet, Zap, Trash, BookOpen, Shield, HelpCircle, HeartPulse } from "lucide-react";
import RoadIcon from "@/components/icons/RoadIcon";
import { PageLayout } from "@/components/PageLayout";

export default function HomePage() {
  const navigate = useNavigate();
  
  const categories = [
    { name: "Water Supply", icon: <Droplet size={24} className="text-blue-500" />, slug: "water-supply" },
    { name: "Electricity", icon: <Zap size={24} className="text-yellow-500" />, slug: "electricity" },
    { name: "Roads & Transport", icon: <RoadIcon size={24} className="text-orange-500" />, slug: "roads-transport" },
    { name: "Waste Management", icon: <Trash size={24} className="text-green-500" />, slug: "waste-management" },
    { name: "Healthcare", icon: <HeartPulse size={24} className="text-red-500" />, slug: "healthcare" },
    { name: "Education", icon: <BookOpen size={24} className="text-purple-500" />, slug: "education" },
    { name: "Public Safety", icon: <Shield size={24} className="text-slate-500" />, slug: "public-safety" },
    { name: "Others", icon: <HelpCircle size={24} className="text-gray-500" />, slug: "others" },
  ];

  return (
    <PageLayout>
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-bhilwara-50 to-blue-50 -z-10" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djIwaC0yVjM0aC0yMHYtMmgyMFYxMmgydjIwaDIwdjJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] -z-10 opacity-50" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl mx-auto text-center animate-slide-down">
            <Badge variant="outline" className="mb-4 py-1.5 backdrop-blur-sm bg-white/50 px-4 text-bhilwara-600 animate-fade-in">
              Community Problem Solving Platform
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-bhilwara-700 to-blue-700">
              Bhilwara Help Hub
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with your community to solve problems together.
              Get answers, find solutions, and make Bhilwara a better place to live.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/problems")} className="animate-fade-in [animation-delay:200ms]">
                Browse Problems
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/new-problem")} className="animate-fade-in [animation-delay:400ms]">
                Post a Problem
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center animate-fade-in [animation-delay:100ms]">
              <div className="w-16 h-16 rounded-full bg-bhilwara-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-bhilwara-600">1</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Post Your Problem</h3>
              <p className="text-muted-foreground">
                Share your problem with the community. Describe the issue in detail and select a relevant category.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in [animation-delay:300ms]">
              <div className="w-16 h-16 rounded-full bg-bhilwara-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-bhilwara-600">2</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Get Solutions</h3>
              <p className="text-muted-foreground">
                Community members will suggest solutions, share their experiences, and help you resolve your problem.
              </p>
            </div>
            <div className="flex flex-col items-center text-center animate-fade-in [animation-delay:500ms]">
              <div className="w-16 h-16 rounded-full bg-bhilwara-100 flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-bhilwara-600">3</span>
              </div>
              <h3 className="text-xl font-medium mb-2">Mark as Resolved</h3>
              <p className="text-muted-foreground">
                Once your problem is solved, mark it as resolved to help others with similar issues in the future.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2">Problem Categories</h2>
              <p className="text-muted-foreground">Find problems and solutions by category</p>
            </div>
            <Button variant="ghost" onClick={() => navigate("/categories")} className="mt-4 md:mt-0">
              View All Categories <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <Card 
                key={category.slug} 
                className="transition-all hover:shadow-md cursor-pointer animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigate(`/category/${category.slug}`)}
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-3">{category.icon}</div>
                  <h3 className="font-medium mb-1">{category.name}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-bhilwara-600 to-blue-700 -z-10" />
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:20px_20px] -z-10" />
        
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in">
            Join Our Community Today
          </h2>
          <p className="text-bhilwara-50 max-w-2xl mx-auto mb-8 animate-fade-in [animation-delay:200ms]">
            Be part of a growing community dedicated to making Bhilwara a better place.
            Share your knowledge, help others, and get help when you need it.
          </p>
          <Button 
            size="lg" 
            variant="secondary" 
            onClick={() => navigate("/register")}
            className="animate-fade-in [animation-delay:400ms]"
          >
            Create an Account
          </Button>
        </div>
      </section>
    </PageLayout>
  );
}

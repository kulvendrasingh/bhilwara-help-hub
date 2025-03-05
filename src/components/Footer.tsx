
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background py-8">
      <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between gap-4">
        <div className="flex flex-col space-y-4">
          <Link to="/" className="text-xl font-bold text-bhilwara-600">
            Bhilwara Help Hub
          </Link>
          <p className="text-sm text-muted-foreground max-w-xs">
            Connecting the community to solve problems together. 
            Share your concerns and help others in Bhilwara.
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Platform</h3>
            <Link to="/problems" className="text-sm text-muted-foreground hover:text-foreground">
              All Problems
            </Link>
            <Link to="/categories" className="text-sm text-muted-foreground hover:text-foreground">
              Categories
            </Link>
            <Link to="/new-problem" className="text-sm text-muted-foreground hover:text-foreground">
              Post a Problem
            </Link>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Resources</h3>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About Us
            </Link>
            <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </Link>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground">
              FAQ
            </Link>
          </div>
          
          <div className="flex flex-col space-y-2">
            <h3 className="font-medium">Legal</h3>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
      
      <div className="container px-4 md:px-6 mt-8 pt-4 border-t">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {currentYear} Bhilwara Help Hub. All rights reserved.
          </p>
          <div className="flex items-center space-x-4">
            <a 
              href="https://twitter.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Twitter
            </a>
            <a 
              href="https://facebook.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Facebook
            </a>
            <a 
              href="https://instagram.com"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

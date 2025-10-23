import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="text-2xl font-bold text-foreground">
              Jaaxis
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#home" className="text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#features" className="text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#resources" className="text-foreground hover:text-primary transition-colors">
              Resources
            </a>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Log In</Button>
            <Button>Sign Up</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <a href="#home" className="block text-foreground hover:text-primary transition-colors">
              Home
            </a>
            <a href="#features" className="block text-foreground hover:text-primary transition-colors">
              Features
            </a>
            <a href="#pricing" className="block text-foreground hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="#resources" className="block text-foreground hover:text-primary transition-colors">
              Resources
            </a>
            <div className="flex flex-col space-y-2 pt-4">
              <Button variant="ghost">Log In</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

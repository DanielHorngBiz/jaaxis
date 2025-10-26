import logo from "@/assets/jaxxis-logo.png";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-16 px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          {/* Left side - Logo, Copyright, Language & Social */}
          <div className="flex flex-col justify-between">
            <div>
              <img src={logo} alt="Jaaxis" className="h-8 mb-6" />
              <p className="text-muted-foreground text-sm mb-8">
                © 2025 All Rights Reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <select className="bg-background border border-border rounded-md px-3 py-1.5 text-sm text-foreground">
                <option>English</option>
              </select>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Right side - Navigation columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-12 md:gap-16">
            <div>
              <h3 className="font-semibold mb-4 text-foreground">Product</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Success stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-foreground">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Trust
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

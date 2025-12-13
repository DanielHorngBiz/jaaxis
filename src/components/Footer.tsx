import logo from "@/assets/jaxxis-logo.png";
import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 sm:gap-10 lg:gap-12">
          {/* Left side - Logo, Copyright, Language & Social */}
          <div className="flex flex-col justify-between">
            <div>
              <img src={logo} alt="Jaaxis" className="h-6 sm:h-8 mb-4 sm:mb-6" />
              <p className="text-muted-foreground text-xs sm:text-sm mb-6 sm:mb-8">
                © 2025 All Rights Reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-3 sm:gap-4">
              <select className="bg-background border border-border rounded-md px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm text-foreground">
                <option>English</option>
              </select>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Facebook className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Instagram className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-primary hover:text-primary/80 transition-colors">
                <Youtube className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Right side - Navigation columns */}
          <div className="grid grid-cols-3 gap-6 sm:gap-8 md:gap-12 lg:gap-16">
            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Product</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a href="#pricing" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Success stories
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Resources</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Guide
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base text-foreground">Company</h3>
              <ul className="space-y-2 sm:space-y-3">
                <li>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Privacy policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Terms of service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
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

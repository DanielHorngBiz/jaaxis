import { useState, useEffect, useRef } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import logo from "@/assets/jaxxis-logo.png";

// Validation schemas
const loginSchema = z.object({
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

const signupSchema = z.object({
  firstName: z.string().trim().min(1, { message: "First name is required" }).max(50),
  lastName: z.string().trim().min(1, { message: "Last name is required" }).max(50),
  email: z.string().trim().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      loginSchema.parse({ email, password });

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Fetch profile to get name
      const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('user_id', data.user.id)
        .single();

      toast({
        title: "Welcome back!",
        description: profile ? `Logged in as ${profile.first_name} ${profile.last_name}` : "Logged in successfully",
      });
      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Invalid email or password",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      signupSchema.parse({ firstName, lastName, email, password });

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: `Welcome, ${firstName} ${lastName}!`,
      });
      navigate("/dashboard");
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: error.message || "An error occurred during sign up",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const updateIndicator = () => {
      if (tabsContainerRef.current) {
        const activeButton = tabsContainerRef.current.querySelector(
          `[data-state="active"]`
        ) as HTMLElement;
        if (activeButton) {
          setIndicatorStyle({
            left: activeButton.offsetLeft,
            width: activeButton.offsetWidth,
          });
        }
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [isLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-gradient-hero relative">
      {/* Back button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-foreground/70 hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span className="text-sm font-medium">Back to home</span>
      </Link>

      <div className="w-full max-w-md animate-scale-in">
        <div className="bg-card border border-border rounded-2xl shadow-lg p-8 relative overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Jaaxis" className="h-12 animate-fade-in" />
          </div>

          {/* Tabs */}
          <div className="relative mb-6" ref={tabsContainerRef}>
            <div className="flex border-b border-border/40">
              <button
                onClick={() => {
                  setIsLogin(true);
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setPassword("");
                }}
                data-state={isLogin ? "active" : "inactive"}
                className={cn(
                  "flex-1 py-3 text-base font-medium transition-colors relative",
                  isLogin
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  setFirstName("");
                  setLastName("");
                  setEmail("");
                  setPassword("");
                }}
                data-state={!isLogin ? "active" : "inactive"}
                className={cn(
                  "flex-1 py-3 text-base font-medium transition-colors relative",
                  !isLogin
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Sign Up
              </button>
            </div>
            <div
              className="absolute bottom-0 h-0.5 bg-primary transition-all duration-300 ease-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>

          {/* Form */}
          <form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-5 animate-fade-in">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-foreground/90">First name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-foreground/90">Last name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    disabled={isLoading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-foreground/90">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1.5"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground/90">Password</Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                  placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label 
                    htmlFor="remember" 
                    className="text-sm font-normal text-foreground/70 cursor-pointer"
                  >
                    Remember me
                  </Label>
                </div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full hover:scale-[1.02] transition-transform mt-6" 
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Google SSO Button */}
          <Button 
            type="button" 
            variant="outline" 
            className="w-full hover:bg-muted/50 transition-colors"
            onClick={() => {
              toast({
                title: "Coming soon",
                description: "Google sign-in will be available soon",
              });
            }}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Auth;

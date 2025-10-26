import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { ArrowLeft } from "lucide-react";
import logo from "@/assets/jaxxis-logo.png";

// Mock account credentials
const MOCK_ACCOUNT = {
  email: "daniel@jaaxis.com",
  password: "daniel",
  firstName: "Daniel",
  lastName: "Hung",
};

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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const currentUser = sessionStorage.getItem("currentUser");
    if (currentUser) {
      navigate("/");
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate input
      loginSchema.parse({ email, password });

      // Check against mock account
      if (email === MOCK_ACCOUNT.email && password === MOCK_ACCOUNT.password) {
        sessionStorage.setItem("currentUser", JSON.stringify({
          email: MOCK_ACCOUNT.email,
          firstName: MOCK_ACCOUNT.firstName,
          lastName: MOCK_ACCOUNT.lastName,
        }));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${MOCK_ACCOUNT.firstName} ${MOCK_ACCOUNT.lastName}`,
        });
        navigate("/");
        return;
      }

      // Check session-stored accounts
      const accounts = JSON.parse(sessionStorage.getItem("accounts") || "[]");
      const account = accounts.find((acc: any) => acc.email === email && acc.password === password);

      if (account) {
        sessionStorage.setItem("currentUser", JSON.stringify({
          email: account.email,
          firstName: account.firstName,
          lastName: account.lastName,
        }));
        toast({
          title: "Welcome back!",
          description: `Logged in as ${account.firstName} ${account.lastName}`,
        });
        navigate("/");
      } else {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid email or password",
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
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

      // Check if email already exists
      const accounts = JSON.parse(sessionStorage.getItem("accounts") || "[]");
      const emailExists = accounts.some((acc: any) => acc.email === email) || email === MOCK_ACCOUNT.email;

      if (emailExists) {
        toast({
          variant: "destructive",
          title: "Sign up failed",
          description: "An account with this email already exists",
        });
        setIsLoading(false);
        return;
      }

      // Create new account
      const newAccount = { firstName, lastName, email, password };
      accounts.push(newAccount);
      sessionStorage.setItem("accounts", JSON.stringify(accounts));

      // Auto login
      sessionStorage.setItem("currentUser", JSON.stringify({
        email: newAccount.email,
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
      }));

      toast({
        title: "Account created!",
        description: `Welcome, ${firstName} ${lastName}!`,
      });
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          variant: "destructive",
          title: "Validation error",
          description: error.errors[0].message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

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

          {/* Title */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl font-bold text-foreground">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
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
                    className="mt-1.5 transition-all focus:scale-[1.02]"
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
                    className="mt-1.5 transition-all focus:scale-[1.02]"
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
                className="mt-1.5 transition-all focus:scale-[1.02]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-foreground/90">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="mt-1.5 transition-all focus:scale-[1.02]"
                placeholder={isLogin ? "Enter your password" : "Min. 6 characters"}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full hover:scale-[1.02] transition-transform mt-6" 
              disabled={isLoading}
            >
              {isLoading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
            </Button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFirstName("");
                setLastName("");
                setEmail("");
                setPassword("");
              }}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium group"
            >
              {isLogin
                ? "Don't have an account? "
                : "Already have an account? "}
              <span className="text-primary group-hover:underline">
                {isLogin ? "Sign up" : "Log in"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;

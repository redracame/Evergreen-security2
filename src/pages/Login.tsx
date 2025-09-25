import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import evergreen from '@/assets/evergreen-logo.jpeg';

// Hardcoded user database
const USERS = [
  {
    name: "Gunaratne Wickrama",
    email: "gunaratnewickrama@gmail.com",
    role: "Employee",
    password: "Sandul1@3",
    otp: "839201",
  },
  {
    name: "Kalu Athal",
    email: "kaluuathal@gmail.com",
    role: "Employee",
    password: "Kalu1@3",
    otp: "472915",
  },
  {
    name: "Yasas Nawanjana",
    email: "yasas.nawanjana@gmail.com",
    role: "Manager",
    password: "Yasas1@3",
    otp: "158637",
  },
  {
    name: "Linuka Auchithya",
    email: "linukaauchithya@gmail.com",
    role: "Admin",
    password: "Linuka1@3",
    otp: "904582",
  },
  {
    name: "N Lokuvithana",
    email: "nlokuvithana71@gmail.com",
    role: "Admin",
    password: "Nisith1@3",
    otp: "726394",
  },
];

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<"login" | "otp">("login");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Step 1: Check email + password
  const handleLoginStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = USERS.find(
      (u) => u.email === username.trim() && u.password === password
    );

    if (user) {
      setCurrentUser(user);
      setStep("otp"); // move to OTP step
    } else {
      setError("Invalid email or password.");
    }
  };

  // Step 2: Verify OTP
  const handleOtpStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (otp === currentUser?.otp) {
        await login(currentUser.email, currentUser.password, otp);
        toast({
          title: "Login successful",
          description: `Welcome ${currentUser.name} (${currentUser.role})!`,
        });
        navigate('/dashboard');
      } else {
        setError("Invalid OTP. Returning to login.");
        setStep("login");
        setOtp("");
        setPassword("");
      }
    } catch (err) {
      setError("An error occurred during login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src={evergreen} alt="Evergreen Group" className="h-16 w-16 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-primary">Evergreen Group</h1>
          <p className="text-muted-foreground">Training & Compliance Portal</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">Sign In</CardTitle>
            <CardDescription>
              {step === "login"
                ? "Enter your credentials to access the training portal"
                : `Enter the 6-digit code sent to ${currentUser?.email}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === "login" ? (
              <form onSubmit={handleLoginStep} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Email Address</Label>
                  <Input
                    id="username"
                    type="email"
                    placeholder="Enter your email address"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full">
                  Continue
                </Button>
              </form>
            ) : (
              <form onSubmit={handleOtpStep} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">Two-Factor Authentication Code</Label>
                  <Input
                    id="otp"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;

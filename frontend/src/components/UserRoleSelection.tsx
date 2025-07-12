import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserPlus, Users, ArrowLeft } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface UserRoleSelectionProps {
  onRoleSelect: (role: 'guest' | 'user' | 'admin', userData?: { email: string; name?: string }) => void;
  onBack: () => void;
}

const UserRoleSelection = ({ onRoleSelect, onBack }: UserRoleSelectionProps) => {
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'signup'>('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, signup } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // Check if this is admin or demo login
      if (loginData.email === 'admin@qa-platform.com' && loginData.password === 'admin123') {
        // Admin login - use Firebase auth
        await login(loginData.email, loginData.password);
        onRoleSelect('admin', { email: loginData.email, name: 'Admin' });
      } else if (loginData.email === '22amtics097@gmail.com') {
        // Demo user login - use Firebase auth
        await login(loginData.email, loginData.password);
        onRoleSelect('user', { email: loginData.email, name: 'Angat Shah' });
      } else {
        // Regular user login
        await login(loginData.email, loginData.password);
        onRoleSelect('user', { email: loginData.email });
      }
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.code === 'auth/user-not-found') {
        setError('No account found with this email address.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to sign in. Please check your credentials.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await signup(signupData.email, signupData.password);
      onRoleSelect('user', { email: signupData.email, name: signupData.name });
    } catch (error: any) {
      console.error('Signup error:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError('Failed to create account. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestAccess = () => {
    onRoleSelect('guest');
  };

  const resetToMain = () => {
    setCurrentView('login');
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={currentView === 'login' ? onBack : resetToMain}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Login view - ChatGPT style */}
        {currentView === 'login' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back
              </h1>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <FloatingLabelInput
                id="login-email"
                label="Email address"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <FloatingLabelInput
                id="login-password"
                label="Password"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                required
              />

              <Button 
                type="submit" 
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl transition-all duration-200 mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Continue'}
              </Button>
            </form>

            {/* Sign up link */}
            <div className="text-center mt-4 text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button 
                type="button"
                onClick={() => setCurrentView('signup')}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Continue as Guest */}
            <Button 
              type="button"
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full h-12 border-2 border-border hover:bg-muted/50 rounded-xl transition-all duration-200"
            >
              Continue as Guest
            </Button>

            {/* Terms and Privacy */}
            <div className="text-center mt-8 text-xs text-muted-foreground">
              <span>Terms of Use</span>
              <span className="mx-2">|</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        )}

        {/* Signup view - ChatGPT style */}
        {currentView === 'signup' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Create account
              </h1>
            </div>

            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Signup Form */}
            <form onSubmit={handleSignup} className="space-y-4">
              <FloatingLabelInput
                id="signup-name"
                label="Full Name"
                type="text"
                value={signupData.name}
                onChange={(e) => setSignupData(prev => ({ ...prev, name: e.target.value }))}
                required
              />

              <FloatingLabelInput
                id="signup-email"
                label="Email address"
                type="email"
                value={signupData.email}
                onChange={(e) => setSignupData(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <FloatingLabelInput
                id="signup-password"
                label="Password"
                type="password"
                value={signupData.password}
                onChange={(e) => setSignupData(prev => ({ ...prev, password: e.target.value }))}
                required
              />

              <FloatingLabelInput
                id="confirm-password"
                label="Confirm Password"
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) => setSignupData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                required
              />

              <Button 
                type="submit" 
                className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-medium rounded-xl transition-all duration-200 mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Continue'}
              </Button>
            </form>

            {/* Sign in link */}
            <div className="text-center mt-4 text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button 
                type="button"
                onClick={() => setCurrentView('login')}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </div>

            {/* Divider */}
            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-border"></div>
              <span className="px-4 text-sm text-muted-foreground">OR</span>
              <div className="flex-1 border-t border-border"></div>
            </div>

            {/* Continue as Guest */}
            <Button 
              type="button"
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full h-12 border-2 border-border hover:bg-muted/50 rounded-xl transition-all duration-200"
            >
              Continue as Guest
            </Button>

            {/* Terms and Privacy */}
            <div className="text-center mt-8 text-xs text-muted-foreground">
              <span>Terms of Use</span>
              <span className="mx-2">|</span>
              <span>Privacy Policy</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserRoleSelection;
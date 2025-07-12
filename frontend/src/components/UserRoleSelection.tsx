import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, UserPlus, Users, ArrowLeft } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";

interface UserRoleSelectionProps {
  onRoleSelect: (role: 'guest' | 'user', userData?: { email: string; name?: string }) => void;
  onBack: () => void;
}

const UserRoleSelection = ({ onRoleSelect, onBack }: UserRoleSelectionProps) => {
  const [currentView, setCurrentView] = useState<'main' | 'login' | 'signup'>('main');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRoleSelect('user', { email: loginData.email });
    setIsLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.password !== signupData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onRoleSelect('user', { email: signupData.email, name: signupData.name });
    setIsLoading(false);
  };

  const handleGuestAccess = () => {
    onRoleSelect('guest');
  };

  const resetToMain = () => {
    setCurrentView('main');
    setLoginData({ email: '', password: '' });
    setSignupData({ name: '', email: '', password: '', confirmPassword: '' });
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md z-10">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={currentView === 'main' ? onBack : resetToMain}
          className="mb-6 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            {currentView === 'login' ? 'Welcome back' : 
             currentView === 'signup' ? 'Create account' : 
             'Welcome to StackIt'}
          </h2>
          <p className="text-muted-foreground">
            {currentView === 'login' ? 'Sign in to your account' : 
             currentView === 'signup' ? 'Get started with StackIt' : 
             'Choose how you\'d like to continue'}
          </p>
        </div>

        {currentView === 'main' && (
          <div className="space-y-4 animate-fade-in">
            <Button 
              onClick={() => setCurrentView('login')}
              className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-2xl transition-all duration-200"
            >
              <User className="w-5 h-5 mr-2" />
              Sign In
            </Button>
            
            <Button 
              onClick={() => setCurrentView('signup')}
              variant="outline"
              className="w-full h-14 border-2 font-medium rounded-2xl transition-all duration-200 hover:bg-muted/50"
            >
              <UserPlus className="w-5 h-5 mr-2" />
              Sign Up
            </Button>
            
            <Button 
              onClick={handleGuestAccess}
              variant="outline"
              className="w-full h-14 border-2 font-medium rounded-2xl transition-all duration-200 hover:bg-muted/50"
            >
              <Users className="w-5 h-5 mr-2" />
              Continue as Guest
            </Button>
          </div>
        )}

        {currentView === 'login' && (
          <Card className="animate-slide-up border-2 rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-6">
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
                  className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-2xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Continue'}
                </Button>

                <div className="space-y-3 pt-4">
                  <Button 
                    type="button"
                    onClick={() => setCurrentView('signup')}
                    variant="outline"
                    className="w-full h-12 border-2 font-medium rounded-2xl transition-all duration-200 hover:bg-muted/50"
                  >
                    Sign Up
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={handleGuestAccess}
                    variant="outline"
                    className="w-full h-12 border-2 font-medium rounded-2xl transition-all duration-200 hover:bg-muted/50"
                  >
                    Continue as Guest
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {currentView === 'signup' && (
          <Card className="animate-slide-up border-2 rounded-2xl">
            <CardContent className="p-6">
              <form onSubmit={handleSignup} className="space-y-6">
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
                  className="w-full h-14 bg-primary hover:bg-primary-hover text-primary-foreground font-medium rounded-2xl transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating Account...' : 'Continue'}
                </Button>

                <div className="space-y-3 pt-4">
                  <Button 
                    type="button"
                    onClick={() => setCurrentView('login')}
                    variant="outline"
                    className="w-full h-12 border-2 font-medium rounded-2xl transition-all duration-200 hover:bg-muted/50"
                  >
                    Sign In
                  </Button>
                  
                  <Button 
                    type="button"
                    onClick={handleGuestAccess}
                    variant="outline"
                    className="w-full h-12 border-2 font-medium rounded-2xl transition-all duration-200 hover:bg-muted/50"
                  >
                    Continue as Guest
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default UserRoleSelection;
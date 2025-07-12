import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, ArrowLeft } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";

interface AdminAuthProps {
  onAdminLogin: (isAdmin: boolean) => void;
  onBack: () => void;
}

const AdminAuth = ({ onAdminLogin, onBack }: AdminAuthProps) => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin credentials (in real app, this would be handled by backend)
  const ADMIN_EMAIL = 'admin@qa-platform.com';
  const ADMIN_PASSWORD = 'admin123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        onAdminLogin(true);
      } else {
        setError('Invalid admin credentials. Please try again.');
        onAdminLogin(false);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="rounded-xl shadow-lg border-0 bg-card">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
            <p className="text-muted-foreground text-sm">
              Enter admin credentials to access the control panel
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Error Alert */}
            {error && (
              <Alert variant="destructive" className="rounded-xl">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Admin Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              <FloatingLabelInput
                id="admin-email"
                label="Admin Email"
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                required
              />
              
              <FloatingLabelInput
                id="admin-password"
                label="Admin Password"
                type="password"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                required
              />

              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 font-medium rounded-xl transition-all duration-200 mt-6"
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Access Admin Panel'}
              </Button>
            </form>

            {/* Demo Credentials Info */}
            <div className="bg-muted/30 rounded-xl p-4">
              <h4 className="font-medium text-sm mb-2">Demo Credentials:</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Email: admin@qa-platform.com</p>
                <p>Password: admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminAuth;
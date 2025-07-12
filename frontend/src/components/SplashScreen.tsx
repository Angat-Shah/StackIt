import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers, Users, MessageSquare } from "lucide-react";

interface SplashScreenProps {
  onContinue: () => void;
}

const SplashScreen = ({ onContinue }: SplashScreenProps) => {
  const [showContent, setShowContent] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowContent(true), 500);
    const timer2 = setTimeout(() => setShowButton(true), 1500);
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-background flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-accent/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="text-center z-10 px-6">
        {/* Logo Animation */}
        <div className={`transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-xl opacity-30 animate-logo-float" />
            <div className="relative bg-gradient-to-r from-primary to-accent p-6 rounded-3xl logo-glow">
              <Layers className="w-16 h-16 text-white" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            StackIt
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
            Your knowledge hub where questions meet brilliant answers
          </p>
        </div>

        {/* Feature Icons */}
        <div className={`flex justify-center gap-8 mb-12 transition-all duration-1000 delay-300 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">Ask</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <span className="text-sm text-muted-foreground">Learn</span>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-success/10 rounded-2xl flex items-center justify-center">
              <Layers className="w-6 h-6 text-success" />
            </div>
            <span className="text-sm text-muted-foreground">Share</span>
          </div>
        </div>

        {/* Continue Button */}
        <div className={`transition-all duration-1000 delay-500 ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <Button 
            onClick={onContinue}
            size="lg"
            className="btn-gradient group px-8 py-4 text-lg"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Join thousands of developers sharing knowledge
          </p>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import SplashScreen from "@/components/SplashScreen";
import UserRoleSelection from "@/components/UserRoleSelection";
import HomePage from "@/components/HomePage";
import Navigation from "@/components/Navigation";
import AskQuestionPage from "@/components/AskQuestionPage";
import NotificationsPage from "@/components/NotificationsPage";
import ProfilePage from "@/components/ProfilePage";

type AppState = 'splash' | 'role-selection' | 'home';
type UserRole = 'guest' | 'user';

interface UserData {
  email: string;
  name?: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');

  const handleSplashContinue = () => {
    setAppState('role-selection');
  };

  const handleRoleSelect = (role: UserRole, data?: UserData) => {
    setUserRole(role);
    if (data) {
      setUserData(data);
    }
    setAppState('home');
  };

  const handleBack = () => {
    setAppState('splash');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogout = () => {
    setUserRole(null);
    setUserData(null);
    setAppState('role-selection');
    setCurrentPage('home');
  };

  const handleQuestionClick = (questionId: string) => {
    console.log('Navigate to question:', questionId);
    // Handle question navigation
  };

  if (appState === 'splash') {
    return <SplashScreen onContinue={handleSplashContinue} />;
  }

  if (appState === 'role-selection') {
    return (
      <UserRoleSelection 
        onRoleSelect={handleRoleSelect}
        onBack={handleBack}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        userRole={userRole!}
        userData={userData || undefined}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        notificationCount={3}
      />
      
      <main>
        {currentPage === 'home' && (
          <HomePage
            userRole={userRole!}
            onQuestionClick={handleQuestionClick}
          />
        )}
        
        {currentPage === 'ask' && userRole === 'user' && (
          <AskQuestionPage
            onBack={() => setCurrentPage('home')}
            onSubmit={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'notifications' && userRole === 'user' && (
          <NotificationsPage
            onBack={() => setCurrentPage('home')}
            onNotificationClick={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'profile' && userRole === 'user' && (
          <ProfilePage
            userData={{
              name: userData?.name || 'User',
              email: userData?.email || '',
              joinDate: 'January 2024',
              reputation: 156,
              questionsAsked: 8,
              answersGiven: 12,
              acceptedAnswers: 3
            }}
            onBack={() => setCurrentPage('home')}
            onSettings={() => {}}
            onQuestionClick={() => setCurrentPage('home')}
          />
        )}
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;

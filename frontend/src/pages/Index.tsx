import { useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import SplashScreen from "@/components/SplashScreen";
import UserRoleSelection from "@/components/UserRoleSelection";
import HomePage from "@/components/HomePage";
import Navigation from "@/components/Navigation";
import AskQuestionPage from "@/components/AskQuestionPage";
import NotificationsPage from "@/components/NotificationsPage";
import ProfilePage from "@/components/ProfilePage";
import QuestionDetail from "@/components/QuestionDetail";

type AppState = 'splash' | 'role-selection' | 'home';
type UserRole = 'guest' | 'user';

interface UserData {
  email: string;
  name?: string;
  displayAs?: 'public' | 'anonymous';
  avatar?: string;
}

interface Answer {
  id: string;
  content: string;
  author: string;
  authorInitials: string;
  votes: number;
  timestamp: string;
  isAccepted: boolean;
  userVote?: 'up' | 'down' | null;
  questionTitle?: string;
  questionId?: string;
}

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  authorInitials: string;
  votes: number;
  answers: Answer[];
  timestamp: string;
  userVote?: 'up' | 'down' | null;
  views: number;
  isSolved?: boolean;
}

interface Notification {
  id: string;
  type: 'answer' | 'question' | 'vote';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  questionId?: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [previousState, setPreviousState] = useState<AppState>('splash');
  const [previousPage, setPreviousPage] = useState<string>('home');
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'answer',
      title: 'New Answer',
      message: 'Someone answered your question about React Router',
      timestamp: '5 minutes ago',
      read: false,
      questionId: '1'
    },
    {
      id: '2',
      type: 'vote',
      title: 'Question Upvoted',
      message: 'Your question received 5 new upvotes',
      timestamp: '1 hour ago',
      read: false,
      questionId: '2'
    },
    {
      id: '3',
      type: 'answer',
      title: 'Answer Accepted',
      message: 'Your answer was marked as accepted',
      timestamp: '2 hours ago',
      read: true,
      questionId: '3'
    }
  ]);
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: '1',
      title: 'How to implement React Router with TypeScript?',
      content: 'I\'m trying to set up React Router in my TypeScript project but getting type errors. Can someone help me with the proper types and configuration?',
      tags: ['react', 'typescript', 'routing'],
      author: 'Sarah Chen',
      authorInitials: 'SC',
      votes: 23,
      answers: [
        {
          id: 'a1',
          content: 'You need to install @types/react-router-dom and properly type your components.',
          author: 'John Doe',
          authorInitials: 'JD',
          votes: 15,
          timestamp: '1 hour ago',
          isAccepted: true,
          userVote: null
        }
      ],
      timestamp: '2 hours ago',
      userVote: null,
      views: 145
    },
    {
      id: '2',
      title: 'Best practices for API error handling in Next.js',
      content: 'What are the recommended patterns for handling API errors in Next.js applications? I need to handle both client and server-side errors gracefully.',
      tags: ['nextjs', 'javascript', 'api', 'error-handling'],
      author: 'Mike Johnson',
      authorInitials: 'MJ',
      votes: 15,
      answers: [],
      timestamp: '4 hours ago',
      userVote: null,
      views: 89
    },
    {
      id: '3',
      title: 'Understanding JavaScript closures with practical examples',
      content: 'I\'m struggling to understand how closures work in JavaScript. Can someone explain with real-world examples?',
      tags: ['javascript', 'fundamentals', 'closures'],
      author: 'Emily Rodriguez',
      authorInitials: 'ER',
      votes: 34,
      answers: [
        {
          id: 'a3',
          content: 'Closures are functions that have access to variables from their outer scope...',
          author: 'David Kim',
          authorInitials: 'DK',
          votes: 22,
          timestamp: '3 hours ago',
          isAccepted: false,
          userVote: null
        }
      ],
      timestamp: '6 hours ago',
      userVote: null,
      views: 203
    },
    {
      id: '4',
      title: 'CSS Grid vs Flexbox: When to use what?',
      content: 'I often get confused about when to use CSS Grid versus Flexbox. What are the best use cases for each?',
      tags: ['css', 'layout', 'grid', 'flexbox'],
      author: 'Alex Thompson',
      authorInitials: 'AT',
      votes: 28,
      answers: [
        {
          id: 'a4',
          content: 'Use Flexbox for one-dimensional layouts and Grid for two-dimensional layouts...',
          author: 'Lisa Park',
          authorInitials: 'LP',
          votes: 31,
          timestamp: '2 hours ago',
          isAccepted: true,
          userVote: null
        }
      ],
      timestamp: '8 hours ago',
      userVote: null,
      views: 167,
      isSolved: true
    },
    {
      id: '5',
      title: 'How to optimize React app performance?',
      content: 'My React application is getting slow as it grows. What are the best strategies for optimizing performance?',
      tags: ['react', 'performance', 'optimization'],
      author: 'Kevin Liu',
      authorInitials: 'KL',
      votes: 42,
      answers: [
        {
          id: 'a5',
          content: 'Start with React DevTools Profiler to identify bottlenecks...',
          author: 'Jennifer Wang',
          authorInitials: 'JW',
          votes: 25,
          timestamp: '5 hours ago',
          isAccepted: false,
          userVote: null
        }
      ],
      timestamp: '12 hours ago',
      userVote: null,
      views: 312
    },
    {
      id: '6',
      title: 'Database design for e-commerce application',
      content: 'I\'m designing a database schema for an e-commerce platform. What are the key considerations for products, orders, and user management?',
      tags: ['database', 'design', 'ecommerce', 'sql'],
      author: 'Maria Santos',
      authorInitials: 'MS',
      votes: 19,
      answers: [],
      timestamp: '1 day ago',
      userVote: null,
      views: 76
    },
    {
      id: '7',
      title: 'Advanced React Hooks patterns and best practices',
      content: 'Looking for advanced patterns with React Hooks like useCallback, useMemo, and custom hooks. What are the performance implications?',
      tags: ['react', 'hooks', 'performance', 'patterns'],
      author: 'Anonymous',
      authorInitials: 'AU',
      votes: 18,
      answers: [
        {
          id: 'a7',
          content: 'Here are some advanced patterns I use in production...',
          author: 'Tech Expert',
          authorInitials: 'TE',
          votes: 12,
          timestamp: '4 hours ago',
          isAccepted: false,
          userVote: null
        }
      ],
      timestamp: '1 day ago',
      userVote: null,
      views: 234
    }
  ]);

  const handleSplashContinue = () => {
    setPreviousState(appState);
    setAppState('role-selection');
  };

  const handleRoleSelect = (role: UserRole, data?: UserData) => {
    setUserRole(role);
    if (data) {
      setUserData({ ...data, displayAs: 'public' });
    }
    setPreviousState(appState);
    setAppState('home');
  };

  const handleBack = () => {
    if (previousState === 'splash') {
      setAppState('splash');
    } else {
      setAppState(previousState);
      setCurrentPage(previousPage);
    }
  };

  const handleNavigate = (page: string) => {
    setPreviousPage(currentPage);
    setCurrentPage(page);
    setSelectedQuestionId(null);
  };

  const handleLogout = () => {
    // Store current page before logout for proper back navigation
    setPreviousPage(currentPage);
    setPreviousState('home');
    setUserRole(null);
    setUserData(null);
    setAppState('role-selection');
  };

  const handleQuestionClick = (questionId: string) => {
    // Increase view count
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, views: q.views + 1 }
        : q
    ));
    setSelectedQuestionId(questionId);
    setPreviousPage(currentPage);
    setCurrentPage('question-detail');
  };

  const handleQuestionSubmit = (questionData: { title: string; content: string; tags: string[] }) => {
    const displayName = userData?.displayAs === 'anonymous' ? 'Anonymous' : (userData?.name || 'User');
    const initials = userData?.displayAs === 'anonymous' ? 'AU' : (userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U');

    const newQuestion: Question = {
      id: Date.now().toString(),
      title: questionData.title,
      content: questionData.content,
      tags: questionData.tags,
      author: displayName,
      authorInitials: initials,
      votes: 0,
      answers: [],
      timestamp: 'just now',
      userVote: null,
      views: 0
    };

    setQuestions(prev => [newQuestion, ...prev]);
    setCurrentPage('home');
  };

  const handleAnswerSubmit = (questionId: string, answerContent: string) => {
    const displayName = userData?.displayAs === 'anonymous' ? 'Anonymous' : (userData?.name || 'User');
    const initials = userData?.displayAs === 'anonymous' ? 'AU' : (userData?.name ? userData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U');

    const newAnswer: Answer = {
      id: Date.now().toString(),
      content: answerContent,
      author: displayName,
      authorInitials: initials,
      votes: 0,
      timestamp: 'just now',
      isAccepted: false,
      userVote: null
    };

    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { ...q, answers: [...q.answers, newAnswer] }
        : q
    ));
  };

  const handleAnswerEdit = (questionId: string, answerId: string, newContent: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            answers: q.answers.map(a => 
              a.id === answerId 
                ? { ...a, content: newContent }
                : a
            )
          }
        : q
    ));
  };

  const handleVote = (questionId: string, voteType: 'up' | 'down') => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            votes: q.userVote === voteType ? q.votes - 1 : q.userVote ? q.votes : q.votes + (voteType === 'up' ? 1 : -1),
            userVote: q.userVote === voteType ? null : voteType
          }
        : q
    ));
  };

  const handleAnswerVote = (questionId: string, answerId: string, voteType: 'up' | 'down') => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            answers: q.answers.map(a => 
              a.id === answerId 
                ? { 
                    ...a, 
                    votes: a.userVote === voteType ? a.votes - 1 : a.userVote ? a.votes : a.votes + (voteType === 'up' ? 1 : -1),
                    userVote: a.userVote === voteType ? null : voteType
                  }
                : a
            )
          }
        : q
    ));
  };

  const handleAcceptAnswer = (questionId: string, answerId: string) => {
    setQuestions(prev => prev.map(q => 
      q.id === questionId 
        ? { 
            ...q, 
            answers: q.answers.map(a => ({
              ...a,
              isAccepted: a.id === answerId ? !a.isAccepted : false
            })),
            isSolved: q.answers.some(a => a.id === answerId && !a.isAccepted) || q.answers.some(a => a.id !== answerId && a.isAccepted)
          }
        : q
    ));
  };

  const handleNotificationClick = (notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    const notification = notifications.find(n => n.id === notificationId);
    if (notification?.questionId) {
      handleQuestionClick(notification.questionId);
    }
  };

  const handleProfileUpdate = (updates: Partial<UserData>) => {
    if (userData) {
      setUserData({ ...userData, ...updates });
    }
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

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Get user's questions and answers for profile
  const userQuestions = questions.filter(q => {
    const authorMatch = userData?.displayAs === 'anonymous' ? 
      q.author === 'Anonymous' : 
      q.author === userData?.name;
    return authorMatch;
  });

  const userAnswers: Answer[] = [];
  questions.forEach(q => {
    q.answers.forEach(a => {
      const authorMatch = userData?.displayAs === 'anonymous' ? 
        a.author === 'Anonymous' : 
        a.author === userData?.name;
      if (authorMatch) {
        userAnswers.push({
          ...a,
          questionTitle: q.title,
          questionId: q.id
        });
      }
    });
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation
        userRole={userRole!}
        userData={userData || undefined}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        notificationCount={unreadCount}
        notifications={notifications}
        onNotificationClick={handleNotificationClick}
        hideSearch={true}
        hideHome={true}
      />
      
      <main>
        {currentPage === 'home' && (
          <HomePage
            userRole={userRole!}
            onQuestionClick={handleQuestionClick}
            questions={questions}
          />
        )}
        
        {currentPage === 'ask' && (
          <AskQuestionPage
            userRole={userRole!}
            onBack={() => setCurrentPage(previousPage)}
            onSubmit={handleQuestionSubmit}
            onSignIn={handleLogout}
          />
        )}

        {currentPage === 'question-detail' && selectedQuestion && (
          <QuestionDetail
            question={selectedQuestion}
            userRole={userRole!}
            isAuthor={userData?.name === selectedQuestion.author || (userData?.displayAs === 'anonymous' && selectedQuestion.author === 'Anonymous')}
            onBack={() => setCurrentPage(previousPage)}
            onVote={(questionId, voteType) => handleVote(questionId, voteType)}
            onAnswerVote={(answerId, voteType) => handleAnswerVote(selectedQuestion.id, answerId, voteType)}
            onAcceptAnswer={(answerId) => handleAcceptAnswer(selectedQuestion.id, answerId)}
            onAnswerSubmit={handleAnswerSubmit}
            onAnswerEdit={(answerId, content) => handleAnswerEdit(selectedQuestion.id, answerId, content)}
          />
        )}
        
        {currentPage === 'notifications' && userRole === 'user' && (
          <NotificationsPage
            onBack={() => setCurrentPage(previousPage)}
            onNotificationClick={handleNotificationClick}
          />
        )}
        
        {currentPage === 'profile' && userRole === 'user' && (
          <ProfilePage
            userData={{
              name: userData?.name || 'User',
              email: userData?.email || '',
              displayAs: userData?.displayAs || 'public',
              avatar: userData?.avatar,
              joinDate: 'January 2024',
              reputation: 156,
              questionsAsked: userQuestions.length,
              answersGiven: userAnswers.length,
              acceptedAnswers: userAnswers.filter(a => a.isAccepted).length
            }}
            userQuestions={userQuestions}
            userAnswers={userAnswers}
            onBack={() => setCurrentPage(previousPage)}
            onSettings={() => {}}
            onQuestionClick={handleQuestionClick}
            onProfileUpdate={handleProfileUpdate}
            onAcceptAnswer={handleAcceptAnswer}
          />
        )}
      </main>
      
      <Toaster />
    </div>
  );
};

export default Index;
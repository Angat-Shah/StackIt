import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Settings, Edit, Trash2, MessageSquare, ArrowUp, Award } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  joinDate: string;
  reputation: number;
  questionsAsked: number;
  answersGiven: number;
  acceptedAnswers: number;
}

interface Question {
  id: string;
  title: string;
  tags: string[];
  votes: number;
  answers: number;
  timestamp: string;
  status: 'open' | 'answered' | 'closed';
}

interface Answer {
  id: string;
  questionTitle: string;
  questionId: string;
  content: string;
  votes: number;
  timestamp: string;
  isAccepted: boolean;
}

interface ProfilePageProps {
  userData: UserData;
  onBack: () => void;
  onSettings: () => void;
  onQuestionClick: (questionId: string) => void;
}

const ProfilePage = ({ userData, onBack, onSettings, onQuestionClick }: ProfilePageProps) => {
  const [deleteMode, setDeleteMode] = useState(false);

  const userQuestions: Question[] = [
    {
      id: '1',
      title: 'How to implement dark mode in React with Tailwind CSS?',
      tags: ['react', 'tailwind', 'dark-mode'],
      votes: 15,
      answers: 3,
      timestamp: '2 days ago',
      status: 'answered'
    },
    {
      id: '2',
      title: 'Best practices for state management in large React applications',
      tags: ['react', 'state-management', 'redux'],
      votes: 8,
      answers: 1,
      timestamp: '5 days ago',
      status: 'open'
    },
    {
      id: '3',
      title: 'TypeScript generic constraints explained with examples',
      tags: ['typescript', 'generics'],
      votes: 22,
      answers: 4,
      timestamp: '1 week ago',
      status: 'answered'
    }
  ];

  const userAnswers: Answer[] = [
    {
      id: '1',
      questionTitle: 'Understanding JavaScript closures with examples',
      questionId: '101',
      content: 'A closure is created when a function is defined inside another function and has access to the outer function\'s variables...',
      votes: 18,
      timestamp: '1 day ago',
      isAccepted: true
    },
    {
      id: '2',
      questionTitle: 'CSS Grid vs Flexbox: When to use what?',
      questionId: '102',
      content: 'Grid is better for two-dimensional layouts while Flexbox excels at one-dimensional layouts...',
      votes: 12,
      timestamp: '3 days ago',
      isAccepted: false
    },
    {
      id: '3',
      questionTitle: 'How to optimize React performance?',
      questionId: '103',
      content: 'There are several key techniques: React.memo for component memoization, useMemo and useCallback for expensive computations...',
      votes: 25,
      timestamp: '1 week ago',
      isAccepted: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'answered':
        return 'bg-success text-success-foreground';
      case 'closed':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button variant="outline" onClick={onSettings} className="rounded-xl">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <Avatar className="w-20 h-20">
                <AvatarFallback className="text-2xl font-bold">
                  {userData.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-foreground mb-1">{userData.name}</h1>
                <p className="text-muted-foreground mb-4">{userData.email}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Member since {userData.joinDate}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userData.reputation}</div>
                    <div className="text-xs text-muted-foreground">Reputation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{userData.questionsAsked}</div>
                    <div className="text-xs text-muted-foreground">Questions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-foreground">{userData.answersGiven}</div>
                    <div className="text-xs text-muted-foreground">Answers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success">{userData.acceptedAnswers}</div>
                    <div className="text-xs text-muted-foreground">Accepted</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="questions" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 rounded-xl">
            <TabsTrigger value="questions" className="rounded-lg">
              <MessageSquare className="w-4 h-4 mr-2" />
              Questions ({userQuestions.length})
            </TabsTrigger>
            <TabsTrigger value="answers" className="rounded-lg">
              <ArrowUp className="w-4 h-4 mr-2" />
              Answers ({userAnswers.length})
            </TabsTrigger>
            <TabsTrigger value="achievements" className="rounded-lg">
              <Award className="w-4 h-4 mr-2" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="questions" className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Questions</h2>
              <Button
                variant={deleteMode ? "destructive" : "outline"}
                onClick={() => setDeleteMode(!deleteMode)}
                className="rounded-xl"
              >
                {deleteMode ? (
                  <>
                    <Trash2 className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Manage
                  </>
                )}
              </Button>
            </div>
            
            {userQuestions.map((question) => (
              <Card 
                key={question.id} 
                className="card-elevated cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => onQuestionClick(question.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {question.title}
                      </h3>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        {question.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="rounded-xl text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{question.votes} votes</span>
                        <span>{question.answers} answers</span>
                        <span>{question.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={`text-xs ${getStatusColor(question.status)}`}>
                        {question.status}
                      </Badge>
                      {deleteMode && (
                        <Button variant="destructive" size="sm" className="rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="answers" className="space-y-3">
            <h2 className="text-lg font-semibold">Your Answers</h2>
            
            {userAnswers.map((answer) => (
              <Card 
                key={answer.id} 
                className={`card-elevated cursor-pointer hover:shadow-lg transition-all duration-200 ${
                  answer.isAccepted ? 'border-success border-2' : ''
                }`}
                onClick={() => onQuestionClick(answer.questionId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {answer.isAccepted && (
                        <Badge className="mb-2 bg-success text-success-foreground">
                          <Award className="w-3 h-3 mr-1" />
                          Accepted Answer
                        </Badge>
                      )}
                      
                      <h3 className="font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                        {answer.questionTitle}
                      </h3>
                      
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {answer.content}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{answer.votes} votes</span>
                        <span>{answer.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="space-y-3">
            <h2 className="text-lg font-semibold">Achievements & Badges</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="card-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">First Answer</h3>
                      <p className="text-sm text-muted-foreground">Posted your first answer</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="card-elevated">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-6 h-6 text-success" />
                    </div>
                    <div>
                      <h3 className="font-semibold">Helpful Contributor</h3>
                      <p className="text-sm text-muted-foreground">5 accepted answers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProfilePage;
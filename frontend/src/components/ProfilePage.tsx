
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Settings, Edit, Trash2, MessageSquare, ArrowUp, Award, Save, Camera, Check } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  displayAs: 'public' | 'anonymous';
  joinDate: string;
  reputation: number;
  questionsAsked: number;
  answersGiven: number;
  acceptedAnswers: number;
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
  questionTitle: string;
  questionId: string;
}

interface Question {
  id: string;
  title: string;
  tags: string[];
  votes: number;
  answers: any[];
  timestamp: string;
  views: number;
  isSolved?: boolean;
}

interface ProfilePageProps {
  userData: UserData;
  userQuestions: Question[];
  userAnswers?: Answer[];
  onBack: () => void;
  onSettings: () => void;
  onQuestionClick: (questionId: string) => void;
  onProfileUpdate: (updates: Partial<UserData>) => void;
  onAcceptAnswer?: (questionId: string, answerId: string) => void;
}

const ProfilePage = ({ 
  userData, 
  userQuestions, 
  userAnswers = [],
  onBack, 
  onSettings, 
  onQuestionClick, 
  onProfileUpdate,
  onAcceptAnswer
}: ProfilePageProps) => {
  const [deleteMode, setDeleteMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(userData.name);
  const [editDisplayAs, setEditDisplayAs] = useState(userData.displayAs);
  const [editAvatar, setEditAvatar] = useState(userData.avatar || '');

  const handleSaveProfile = () => {
    onProfileUpdate({
      name: editName,
      displayAs: editDisplayAs,
      avatar: editAvatar
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setEditAvatar(result);
      };
      reader.readAsDataURL(file);
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
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)} className="rounded-xl">
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Profile Header */}
        <Card className="card-elevated">
          <CardContent className="p-6">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  {isEditing && editAvatar ? (
                    <img src={editAvatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : userData.avatar ? (
                    <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="text-2xl font-bold">
                      {userData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1 cursor-pointer hover:bg-primary/90">
                    <Camera className="w-3 h-3" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Name</label>
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-xl max-w-xs"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Avatar URL (optional)</label>
                      <Input
                        value={editAvatar}
                        onChange={(e) => setEditAvatar(e.target.value)}
                        placeholder="Enter image URL or upload above"
                        className="rounded-xl max-w-xs"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Display As</label>
                      <Select value={editDisplayAs} onValueChange={(value: 'public' | 'anonymous') => setEditDisplayAs(value)}>
                        <SelectTrigger className="w-40 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="anonymous">Anonymous</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={handleSaveProfile} className="rounded-xl">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold text-foreground mb-1">
                      {userData.displayAs === 'anonymous' ? 'Anonymous User' : userData.name}
                    </h1>
                    <p className="text-muted-foreground mb-4">{userData.email}</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Member since {userData.joinDate} • Displaying as {userData.displayAs}
                    </p>
                  </>
                )}
                
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
                className="card-elevated cursor-pointer hover:shadow-lg transition-all duration-200 relative"
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
                        <span>{question.answers.length} answers</span>
                        <span>{question.views} views</span>
                        <span>{question.timestamp}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {question.isSolved && (
                        <div className="absolute bottom-2 right-2">
                          <Badge className="bg-success text-success-foreground text-xs">
                            Solved
                          </Badge>
                        </div>
                      )}
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
                className="card-elevated cursor-pointer hover:shadow-lg transition-all duration-200"
                onClick={() => onQuestionClick(answer.questionId)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        {answer.questionTitle}
                      </h3>
                      
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        <div dangerouslySetInnerHTML={{ __html: answer.content.substring(0, 150) + '...' }} />
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{answer.votes} votes</span>
                        <span>{answer.timestamp}</span>
                        {answer.isAccepted && (
                          <Badge className="bg-success text-success-foreground">
                            <Check className="w-3 h-3 mr-1" />
                            Accepted
                          </Badge>
                        )}
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
                      <h3 className="font-semibold">First Question</h3>
                      <p className="text-sm text-muted-foreground">Asked your first question</p>
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
                      <p className="text-sm text-muted-foreground">Asked {userQuestions.length} questions</p>
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
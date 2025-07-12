import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Ban, 
  Trash2, 
  Flag, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  Shield,
  Settings,
  Filter,
  Eye,
  ArrowUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: 'active' | 'banned';
  joinDate: string;
  questionsCount: number;
  answersCount: number;
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
  views: number;
  isSolved?: boolean;
  isReported?: boolean;
  isInappropriate?: boolean;
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
  isReported?: boolean;
  isInappropriate?: boolean;
}

interface AdminPanelProps {
  isAdmin: boolean;
  questions: Question[];
  onBanUser: (userId: string) => void;
  onRemoveAnswer: (questionId: string, answerId: string) => void;
  onRemoveQuestion: (questionId: string) => void;
  onQuestionClick: (questionId: string) => void;
}

const AdminPanel = ({ 
  isAdmin, 
  questions, 
  onBanUser, 
  onRemoveAnswer, 
  onRemoveQuestion,
  onQuestionClick 
}: AdminPanelProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const { toast } = useToast();

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      initials: 'SC',
      status: 'active',
      joinDate: '2023-01-15',
      questionsCount: 12,
      answersCount: 35
    },
    {
      id: '2',
      name: 'Mike Johnson',
      email: 'mike.j@example.com',
      initials: 'MJ',
      status: 'active',
      joinDate: '2023-02-20',
      questionsCount: 8,
      answersCount: 22
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      email: 'emily.r@example.com',
      initials: 'ER',
      status: 'banned',
      joinDate: '2023-03-10',
      questionsCount: 5,
      answersCount: 15
    }
  ]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Access denied. You don't have admin privileges.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const allTags = [...new Set(questions.flatMap(q => q.tags))];
  const reportedQuestions = questions.filter(q => q.isReported || q.isInappropriate);
  const reportedAnswers = questions.flatMap(q => 
    q.answers.filter(a => a.isReported || a.isInappropriate).map(a => ({ ...a, questionId: q.id, questionTitle: q.title }))
  );

  const filteredQuestions = questions.filter(question => {
    const matchesTag = selectedTag === 'all' || question.tags.includes(selectedTag);
    const matchesSearch = searchQuery === '' || 
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  const filteredUsers = users.filter(user => 
    userSearchQuery === '' || 
    user.name.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const handleBanUser = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'banned' : 'active' }
        : user
    ));
    const user = users.find(u => u.id === userId);
    toast({
      title: "User Status Updated",
      description: `${user?.name} has been ${user?.status === 'active' ? 'banned' : 'unbanned'}`,
    });
  };

  const handleRemoveContent = (type: 'question' | 'answer', questionId: string, answerId?: string) => {
    if (type === 'question') {
      onRemoveQuestion(questionId);
    } else if (answerId) {
      onRemoveAnswer(questionId, answerId);
    }
    toast({
      title: "Content Removed",
      description: `${type === 'question' ? 'Question' : 'Answer'} has been removed successfully`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <p className="text-muted-foreground">
          Manage users, content, and monitor platform activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{users.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Reported Content</p>
                <p className="text-2xl font-bold">{reportedQuestions.length + reportedAnswers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <Ban className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Banned Users</p>
                <p className="text-2xl font-bold">{users.filter(u => u.status === 'banned').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-xl h-12">
          <TabsTrigger value="users" className="rounded-lg">User Management</TabsTrigger>
          <TabsTrigger value="content" className="rounded-lg">Content Management</TabsTrigger>
          <TabsTrigger value="reported" className="rounded-lg">Reported Content</TabsTrigger>
          <TabsTrigger value="tags" className="rounded-lg">Tag Management</TabsTrigger>
        </TabsList>

        {/* User Management */}
        <TabsContent value="users" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Management
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search users..."
                      value={userSearchQuery}
                      onChange={(e) => setUserSearchQuery(e.target.value)}
                      className="pl-10 w-64 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="text-sm font-medium">
                          {user.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{user.name}</h3>
                          <Badge variant={user.status === 'active' ? 'default' : 'destructive'} className="text-xs">
                            {user.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>Joined: {user.joinDate}</span>
                          <span>{user.questionsCount} questions</span>
                          <span>{user.answersCount} answers</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={user.status === 'active' ? 'destructive' : 'default'}
                        size="sm"
                        onClick={() => handleBanUser(user.id)}
                        className="rounded-lg"
                      >
                        <Ban className="w-4 h-4 mr-2" />
                        {user.status === 'active' ? 'Ban User' : 'Unban User'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content Management */}
        <TabsContent value="content" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Content Management
                </CardTitle>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 w-64 rounded-xl"
                    />
                  </div>
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-40 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredQuestions.map((question) => (
                  <div key={question.id} className="border border-border rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 
                          className="font-semibold mb-2 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => onQuestionClick(question.id)}
                        >
                          {question.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {question.content}
                        </p>
                        <div className="flex items-center gap-2 mb-2">
                          {question.tags.map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs rounded-md">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>By: {question.author}</span>
                          <span>{question.timestamp}</span>
                          <div className="flex items-center gap-1">
                            <ArrowUp className="w-4 h-4" />
                            <span>{question.votes}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            <span>{question.answers.length}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{question.views}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Flag
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveContent('question', question.id)}
                          className="rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    </div>
                    
                    {/* Answers */}
                    {question.answers.length > 0 && (
                      <div className="mt-4 space-y-3 border-t border-border pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground">
                          Answers ({question.answers.length})
                        </h4>
                        {question.answers.map((answer) => (
                          <div key={answer.id} className="bg-muted/30 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="text-sm mb-2 line-clamp-2">{answer.content}</p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <span>By: {answer.author}</span>
                                  <span>{answer.timestamp}</span>
                                  <div className="flex items-center gap-1">
                                    <ArrowUp className="w-3 h-3" />
                                    <span>{answer.votes}</span>
                                  </div>
                                  {answer.isAccepted && (
                                    <Badge variant="default" className="text-xs">
                                      Accepted
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2 ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="rounded-lg text-xs h-7"
                                >
                                  <Flag className="w-3 h-3 mr-1" />
                                  Flag
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleRemoveContent('answer', question.id, answer.id)}
                                  className="rounded-lg text-xs h-7"
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Reported Content */}
        <TabsContent value="reported" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Reported Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportedQuestions.length === 0 && reportedAnswers.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No reported content</h3>
                    <p className="text-muted-foreground">All content is clean!</p>
                  </div>
                ) : (
                  <>
                    {reportedQuestions.map((question) => (
                      <div key={question.id} className="border border-red-200 dark:border-red-800 rounded-xl p-4 bg-red-50 dark:bg-red-950">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="destructive" className="text-xs">
                                Reported Question
                              </Badge>
                              {question.isInappropriate && (
                                <Badge variant="outline" className="text-xs border-red-300">
                                  Inappropriate
                                </Badge>
                              )}
                            </div>
                            <h3 className="font-semibold mb-2">{question.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                              {question.content}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>By: {question.author}</span>
                              <span>{question.timestamp}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Button variant="outline" size="sm" className="rounded-lg">
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleRemoveContent('question', question.id)}
                              className="rounded-lg"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tag Management */}
        <TabsContent value="tags" className="space-y-6">
          <Card className="rounded-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Tag Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allTags.map((tag) => {
                  const tagCount = questions.filter(q => q.tags.includes(tag)).length;
                  return (
                    <div key={tag} className="border border-border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="text-sm">
                          {tag}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {tagCount} questions
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="rounded-lg text-xs">
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" className="rounded-lg text-xs">
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;
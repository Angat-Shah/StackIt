import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowUp, ArrowDown, MessageSquare, Search, Filter, Clock, TrendingUp, Users } from "lucide-react";

interface Question {
  id: string;
  title: string;
  description: string;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
    reputation: number;
  };
  votes: number;
  answers: number;
  views: number;
  timestamp: string;
  isAccepted: boolean;
}

interface HomePageProps {
  userRole: 'guest' | 'user';
  onQuestionClick: (questionId: string) => void;
}

const HomePage = ({ userRole, onQuestionClick }: HomePageProps) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data
  const questions: Question[] = [
    {
      id: '1',
      title: 'How to implement React Router with TypeScript?',
      description: 'I\'m trying to set up React Router in my TypeScript project but getting type errors...',
      tags: ['react', 'typescript', 'routing'],
      author: {
        name: 'Sarah Chen',
        reputation: 2840
      },
      votes: 23,
      answers: 4,
      views: 156,
      timestamp: '2 hours ago',
      isAccepted: true
    },
    {
      id: '2',
      title: 'Best practices for API error handling in Next.js',
      description: 'What are the recommended patterns for handling API errors in Next.js applications?',
      tags: ['nextjs', 'javascript', 'api', 'error-handling'],
      author: {
        name: 'Mike Johnson',
        reputation: 1520
      },
      votes: 15,
      answers: 2,
      views: 89,
      timestamp: '4 hours ago',
      isAccepted: false
    },
    {
      id: '3',
      title: 'Database design for a social media application',
      description: 'I need advice on designing a scalable database schema for a social media platform...',
      tags: ['database', 'sql', 'design', 'scaling'],
      author: {
        name: 'Alex Rivera',
        reputation: 3210
      },
      votes: 31,
      answers: 7,
      views: 234,
      timestamp: '6 hours ago',
      isAccepted: true
    },
    {
      id: '4',
      title: 'Optimizing React performance with large lists',
      description: 'My React application becomes slow when rendering large lists. What are the best optimization techniques?',
      tags: ['react', 'performance', 'optimization'],
      author: {
        name: 'Emma Davis',
        reputation: 1890
      },
      votes: 18,
      answers: 3,
      views: 127,
      timestamp: '8 hours ago',
      isAccepted: false
    }
  ];

  const topTags = ['react', 'typescript', 'javascript', 'nextjs', 'database', 'performance'];

  const getAuthorInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = filterTag === 'all' || question.tags.includes(filterTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              All Questions
            </h1>
            <p className="text-muted-foreground">
              {filteredQuestions.length} questions found
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-80 rounded-xl bg-muted/50 border-0"
              />
            </div>
            
            {/* Filter by Tag */}
            <Select value={filterTag} onValueChange={setFilterTag}>
              <SelectTrigger className="w-40 rounded-xl bg-muted/50 border-0">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Tags</SelectItem>
                {topTags.map(tag => (
                  <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 rounded-xl bg-muted/50 border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Top Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">Popular tags:</span>
          {topTags.map(tag => (
            <Badge 
              key={tag}
              variant="secondary" 
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg"
              onClick={() => setFilterTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question, index) => (
          <Card 
            key={question.id} 
            className="question-card animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onQuestionClick(question.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2 hover:text-primary transition-colors">
                    {question.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                    {question.description}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    {question.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className="text-xs rounded-lg hover:bg-primary/10 cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFilterTag(tag);
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                {/* Stats Column */}
                <div className="flex flex-col items-end gap-2 ml-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <ArrowUp className="w-4 h-4" />
                      <span className="font-medium">{question.votes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span className="font-medium">{question.answers}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span className="font-medium">{question.views}</span>
                    </div>
                  </div>
                  
                  {question.isAccepted && (
                    <Badge className="bg-success text-success-foreground text-xs rounded-lg">
                      Solved
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={question.author.avatar} />
                    <AvatarFallback className="bg-muted text-xs">
                      {getAuthorInitials(question.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{question.author.name}</p>
                    <p className="text-xs text-muted-foreground">{question.author.reputation} reputation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="w-3 h-3" />
                  {question.timestamp}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No questions found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search or filter criteria
          </p>
          {userRole === 'user' && (
            <Button className="btn-gradient">
              Ask the first question
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
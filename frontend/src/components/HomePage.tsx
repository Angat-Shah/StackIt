
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { ArrowUp, MessageSquare, Clock, Search, Eye, CheckCircle } from "lucide-react";

interface Question {
  id: string;
  title: string;
  content: string;
  tags: string[];
  author: string;
  authorInitials: string;
  votes: number;
  answers: any[];
  timestamp: string;
  views?: number;
}

interface HomePageProps {
  userRole: 'guest' | 'user' | 'admin';
  onQuestionClick: (questionId: string) => void;
  questions: Question[];
}

const HomePage = ({ userRole, onQuestionClick, questions }: HomePageProps) => {
  const [sortBy, setSortBy] = useState('newest');
  const [filterTag, setFilterTag] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const topTags = ['react', 'typescript', 'javascript', 'nextjs', 'database', 'performance'];

  const filteredAndSortedQuestions = questions
    .filter(question => {
      const matchesTag = filterTag === 'all' || question.tags.includes(filterTag);
      const matchesSearch = searchQuery === '' || 
        question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        question.content.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTag && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'votes':
          return b.votes - a.votes;
        case 'answers':
          return b.answers.length - a.answers.length;
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'newest':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 rounded-xl bg-muted/30 border-0 focus:bg-card transition-colors text-base"
          />
        </form>
      </div>

      {/* Header Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              All Questions
            </h1>
            <p className="text-muted-foreground text-sm">
              {filteredAndSortedQuestions.length} questions found
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-36 rounded-xl bg-muted/30 border-0 h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="votes">Most Votes</SelectItem>
                <SelectItem value="answers">Most Answers</SelectItem>
                <SelectItem value="views">Most Viewed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Enhanced Tag Filtering */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Filter by tags:</span>
            <Badge 
              variant={filterTag === 'all' ? 'default' : 'secondary'}
              className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg text-xs"
              onClick={() => setFilterTag('all')}
            >
              All ({questions.length})
            </Badge>
            {topTags.map(tag => {
              const count = questions.filter(q => q.tags.includes(tag)).length;
              return (
                <Badge 
                  key={tag}
                  variant={filterTag === tag ? 'default' : 'secondary'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg text-xs"
                  onClick={() => setFilterTag(tag)}
                >
                  {tag} ({count})
                </Badge>
              );
            })}
          </div>
          
          {/* Additional Tag Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">More tags:</span>
            {['css', 'html', 'nodejs', 'api', 'design', 'database'].map(tag => {
              const count = questions.filter(q => q.tags.includes(tag)).length;
              if (count === 0) return null;
              return (
                <Badge 
                  key={tag}
                  variant={filterTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg text-xs"
                  onClick={() => setFilterTag(tag)}
                >
                  {tag} ({count})
                </Badge>
              );
            })}
          </div>
          
          {/* Active Filter Display */}
          {filterTag !== 'all' && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Active filter:</span>
              <Badge variant="default" className="rounded-lg text-xs">
                {filterTag}
                <button 
                  onClick={() => setFilterTag('all')}
                  className="ml-2 hover:bg-primary-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Questions Grid - Square Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAndSortedQuestions.map((question, index) => (
          <Card 
            key={question.id} 
            className="group relative cursor-pointer hover:shadow-lg transition-all duration-300 rounded-xl aspect-square flex flex-col"
            style={{ animationDelay: `${index * 100}ms` }}
            onClick={() => onQuestionClick(question.id)}
          >
            {/* Verification Badge */}
            {question.answers.some(a => a.isAccepted) && (
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center gap-1 bg-green-100 dark:bg-green-900 rounded-full px-2 py-1">
                  <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-300">Solved</span>
                </div>
              </div>
            )}

            <CardContent className="p-6 flex flex-col h-full">
              <div className="space-y-4 flex-1">
                {/* Title */}
                <h3 className="text-lg font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                  {question.title}
                </h3>
                
                {/* Description */}
                <p className="text-muted-foreground text-sm line-clamp-3 leading-relaxed">
                  {question.content}
                </p>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {question.tags.slice(0, 2).map(tag => (
                    <Badge 
                      key={tag} 
                      variant="secondary"
                      className="text-xs rounded-md px-2 py-1"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {question.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs rounded-md px-2 py-1">
                      +{question.tags.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <ArrowUp className="w-4 h-4" />
                    <span>{question.votes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{question.answers.length}</span>
                  </div>
                  {question.views && (
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{question.views}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-2 mt-4">
                <Avatar className="h-6 w-6">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-xs font-medium">
                    {question.authorInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{question.author}</span>
                  <span>•</span>
                  <span>{question.timestamp}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredAndSortedQuestions.length === 0 && (
        <div className="text-center py-16">
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
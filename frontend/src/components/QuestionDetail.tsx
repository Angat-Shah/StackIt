
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, ArrowUp, ArrowDown, MessageSquare, Share, Bookmark, Check, Edit } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface Answer {
  id: string;
  content: string;
  author: string;
  authorInitials: string;
  votes: number;
  timestamp: string;
  isAccepted: boolean;
  userVote?: 'up' | 'down' | null;
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
  isSolved?: boolean;
}

interface QuestionDetailProps {
  question: Question;
  userRole: 'guest' | 'user' | 'admin';
  isAuthor?: boolean;
  onBack: () => void;
  onVote: (questionId: string, voteType: 'up' | 'down') => void;
  onAnswerVote: (answerId: string, voteType: 'up' | 'down') => void;
  onAcceptAnswer: (answerId: string) => void;
  onAnswerSubmit: (questionId: string, content: string) => void;
  onAnswerEdit?: (answerId: string, content: string) => void;
}

const QuestionDetail = ({ 
  question, 
  userRole, 
  isAuthor = false,
  onBack, 
  onVote, 
  onAnswerVote,
  onAcceptAnswer,
  onAnswerSubmit,
  onAnswerEdit
}: QuestionDetailProps) => {
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const handleSubmitAnswer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnswer.trim() || userRole === 'guest') return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onAnswerSubmit(question.id, newAnswer);
    setNewAnswer("");
    setIsSubmitting(false);
  };

  const handleEditAnswer = (answerId: string, currentContent: string) => {
    setEditingAnswerId(answerId);
    setEditContent(currentContent);
  };

  const handleSaveEdit = (answerId: string) => {
    if (onAnswerEdit && editContent.trim()) {
      onAnswerEdit(answerId, editContent);
    }
    setEditingAnswerId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingAnswerId(null);
    setEditContent("");
  };

  const VoteButton = ({ 
    type, 
    votes, 
    userVote, 
    onVoteClick, 
    disabled = false 
  }: { 
    type: 'up' | 'down'; 
    votes: number; 
    userVote?: 'up' | 'down' | null; 
    onVoteClick: () => void;
    disabled?: boolean;
  }) => (
    <div className="flex flex-col items-center">
      <Button
        variant="ghost"
        size="sm"
        onClick={onVoteClick}
        disabled={disabled}
        className={`p-2 h-8 w-8 rounded-lg ${
          userVote === type ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
        }`}
      >
        {type === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
      </Button>
      <span className="text-sm font-medium text-muted-foreground">{votes}</span>
    </div>
  );

  const renderFormattedContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" />')
      .replace(/\n/g, '<br>');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6 relative">
        {/* Solved Badge */}
        {question.isSolved && (
          <div className="fixed bottom-4 right-4 z-50">
            <Badge className="bg-success text-success-foreground text-sm px-3 py-1">
              Solved
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Question Card */}
        <Card className="card-elevated">
          <CardHeader className="flex flex-row gap-4">
            <div className="flex flex-col items-center gap-2">
              <VoteButton
                type="up"
                votes={question.votes}
                userVote={question.userVote}
                onVoteClick={() => onVote(question.id, 'up')}
                disabled={userRole === 'guest'}
              />
              <VoteButton
                type="down"
                votes={0}
                userVote={question.userVote}
                onVoteClick={() => onVote(question.id, 'down')}
                disabled={userRole === 'guest'}
              />
            </div>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground mb-4">{question.title}</h1>
              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="rounded-xl">
                    {tag}
                  </Badge>
                ))}
              </div>
              <div className="prose max-w-none text-foreground">
                <div dangerouslySetInnerHTML={{ __html: renderFormattedContent(question.content) }} />
              </div>
              
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>{question.authorInitials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{question.author}</p>
                    <p className="text-xs text-muted-foreground">{question.timestamp}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Share className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="rounded-xl">
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Answers Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            {question.answers.length} {question.answers.length === 1 ? 'Answer' : 'Answers'}
          </h2>
          
          {question.answers.map((answer) => (
            <Card key={answer.id} className={`card-elevated ${answer.isAccepted ? 'border-success border-2' : ''}`}>
              <CardContent className="flex gap-4 p-6">
                <div className="flex flex-col items-center gap-2">
                  <VoteButton
                    type="up"
                    votes={answer.votes}
                    userVote={answer.userVote}
                    onVoteClick={() => onAnswerVote(answer.id, 'up')}
                    disabled={userRole === 'guest'}
                  />
                  <VoteButton
                    type="down"
                    votes={0}
                    userVote={answer.userVote}
                    onVoteClick={() => onAnswerVote(answer.id, 'down')}
                    disabled={userRole === 'guest'}
                  />
                  {isAuthor && userRole === 'user' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onAcceptAnswer(answer.id)}
                      className={`p-2 h-8 w-8 rounded-lg ${
                        answer.isAccepted 
                          ? 'bg-success text-success-foreground' 
                          : 'hover:bg-success hover:text-success-foreground'
                      }`}
                      title={answer.isAccepted ? "Accepted answer" : "Accept this answer"}
                    >
                      <Check className="w-4 h-4" />
                    </Button>
                  )}
                  {answer.isAccepted && !isAuthor && (
                    <div className="p-2 h-8 w-8 rounded-lg bg-success text-success-foreground flex items-center justify-center">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  {answer.isAccepted && (
                    <Badge className="mb-3 bg-success text-success-foreground">
                      Accepted Answer
                    </Badge>
                  )}
                  
                  {editingAnswerId === answer.id ? (
                    <div className="space-y-4">
                      <RichTextEditor
                        value={editContent}
                        onChange={setEditContent}
                        placeholder="Edit your answer..."
                        className="w-full"
                      />
                      <div className="flex gap-2">
                        <Button 
                          onClick={() => handleSaveEdit(answer.id)}
                          size="sm"
                          className="rounded-xl"
                          disabled={!editContent.trim()}
                        >
                          Save Changes
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={handleCancelEdit}
                          size="sm"
                          className="rounded-xl"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="prose max-w-none text-foreground mb-4">
                        <div dangerouslySetInnerHTML={{ __html: renderFormattedContent(answer.content) }} />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>{answer.authorInitials}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{answer.author}</p>
                            <p className="text-xs text-muted-foreground">{answer.timestamp}</p>
                          </div>
                        </div>
                        
                        {userRole === 'user' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAnswer(answer.id, answer.content)}
                            className="rounded-xl"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Answer Form */}
        {userRole === 'user' && (
          <Card className="card-elevated">
            <CardHeader>
              <h3 className="text-lg font-semibold">Your Answer</h3>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitAnswer} className="space-y-4">
                <RichTextEditor
                  value={newAnswer}
                  onChange={setNewAnswer}
                  placeholder="Write your answer here..."
                  className="w-full"
                />
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !newAnswer.trim()}
                  className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl"
                >
                  {isSubmitting ? 'Posting...' : 'Post Answer'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {userRole === 'guest' && (
          <Card className="card-elevated border-primary/20">
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="text-lg font-semibold mb-2">Want to answer this question?</h3>
              <p className="text-muted-foreground mb-4">
                Sign up or log in to share your knowledge and help the community.
              </p>
              <Button className="bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl">
                Sign Up to Answer
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionDetail;
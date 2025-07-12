
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Plus, X, Send, Lock } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";
import RichTextEditor from "./RichTextEditor";

interface AskQuestionPageProps {
  userRole: 'guest' | 'user';
  onBack: () => void;
  onSubmit: (question: { title: string; content: string; tags: string[] }) => void;
  onSignIn: () => void;
}

const AskQuestionPage = ({ userRole, onBack, onSubmit, onSignIn }: AskQuestionPageProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const popularTags = ['javascript', 'react', 'python', 'css', 'html', 'nodejs', 'typescript', 'database'];

  const addTag = (tagToAdd?: string) => {
    const tag = tagToAdd || currentTag.trim();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || userRole !== 'user') return;
    
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit({ title, content, tags });
    setIsSubmitting(false);
  };

  // Guest user restriction
  if (userRole === 'guest') {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </div>

          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">Sign In to Ask Questions</h1>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Join our community to ask questions, share knowledge, and get help from other developers.
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={onSignIn} className="btn-gradient">
                Sign In
              </Button>
              <Button variant="outline" onClick={onBack} className="rounded-xl">
                Browse Questions
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Ask a Question</h1>
          <p className="text-muted-foreground">Share your knowledge quest with the community</p>
        </div>

        <Card className="card-elevated max-w-3xl mx-auto">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Question Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Question Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What's your programming question? Be specific and clear..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-input bg-background"
                  required
                />
                <p className="text-xs text-muted-foreground">{title.length}/200 characters</p>
              </div>

              {/* Tags */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">
                  Tags (up to 5)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    placeholder="Type a tag and press Enter..."
                    className="flex-1 px-3 py-2 text-sm rounded-lg border border-input bg-background"
                  />
                  <Button 
                    type="button" 
                    onClick={() => addTag()} 
                    className="rounded-xl"
                    disabled={!currentTag.trim() || tags.length >= 5}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Selected Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="rounded-xl flex items-center gap-1">
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(tag)}
                          className="ml-1 h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Popular Tags */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Popular tags:</p>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map(tag => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors rounded-lg text-xs"
                        onClick={() => addTag(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Question Details with Rich Text Editor */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Question Details
                </label>
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Describe your problem in detail. Include what you've tried, expected results, and any error messages..."
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Provide as much detail as possible to help others understand and answer your question
                </p>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !title.trim() || !content.trim()}
                  className="flex-1 h-12 bg-gradient-to-r from-primary to-accent hover:from-primary-hover hover:to-accent-hover text-white rounded-xl font-medium"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Posting Question...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Post Question
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={onBack}
                  className="rounded-xl"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskQuestionPage;
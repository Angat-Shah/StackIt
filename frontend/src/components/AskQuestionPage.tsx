import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Plus, X } from "lucide-react";
import { FloatingLabelInput } from "./FloatingLabelInput";

interface AskQuestionPageProps {
  onBack: () => void;
  onSubmit: (question: { title: string; content: string; tags: string[] }) => void;
}

const AskQuestionPage = ({ onBack, onSubmit }: AskQuestionPageProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit({ title, content, tags });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Ask a Question</h1>
        </div>

        <Card className="card-elevated">
          <CardHeader>
            <CardTitle>Share your question with the community</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <FloatingLabelInput
                id="question-title"
                label="Question Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Be specific and imagine you're asking a question to another person"
                required
              />

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tags</label>
                <div className="flex gap-2 mb-2">
                  <FloatingLabelInput
                    id="tag-input"
                    label="Add tags"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    placeholder="e.g. react, javascript, css"
                  />
                  <Button type="button" onClick={addTag} className="rounded-xl">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="rounded-xl">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTag(tag)}
                        className="ml-1 h-4 w-4 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Description</label>
                <Textarea
                  placeholder="Provide all the details someone would need to answer your question..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-48 rounded-xl resize-none"
                  required
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting || !title.trim() || !content.trim()}
                className="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl"
              >
                {isSubmitting ? 'Publishing...' : 'Post Question'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AskQuestionPage;
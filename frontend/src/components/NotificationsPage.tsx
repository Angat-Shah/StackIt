import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Bell, MessageSquare, ArrowUp, Check, User } from "lucide-react";

interface Notification {
  id: string;
  type: 'answer' | 'vote' | 'accepted' | 'mention';
  title: string;
  message: string;
  questionTitle: string;
  questionId: string;
  timestamp: string;
  read: boolean;
  author?: string;
  authorInitials?: string;
}

// Notification Card Component
interface NotificationsPageProps {
  onBack: () => void;
  onNotificationClick: (questionId: string) => void;
}

const NotificationsPage = ({ onBack, onNotificationClick }: NotificationsPageProps) => {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'answer',
      title: 'New answer on your question',
      message: 'Sarah Wilson answered your question about React hooks',
      questionTitle: 'How to use useEffect with cleanup function?',
      questionId: '1',
      timestamp: '2 hours ago',
      read: false,
      author: 'Sarah Wilson',
      authorInitials: 'SW'
    },
    {
      id: '2',
      type: 'vote',
      title: 'Your answer was upvoted',
      message: 'Someone upvoted your answer about JavaScript closures',
      questionTitle: 'Understanding JavaScript closures with examples',
      questionId: '2',
      timestamp: '5 hours ago',
      read: false
    },
    {
      id: '3',
      type: 'accepted',
      title: 'Your answer was accepted!',
      message: 'John Doe marked your answer as the accepted solution',
      questionTitle: 'Best practices for API error handling',
      questionId: '3',
      timestamp: '1 day ago',
      read: true,
      author: 'John Doe',
      authorInitials: 'JD'
    },
    {
      id: '4',
      type: 'mention',
      title: 'You were mentioned',
      message: 'Alex mentioned you in a comment',
      questionTitle: 'CSS Grid vs Flexbox: When to use what?',
      questionId: '4',
      timestamp: '2 days ago',
      read: true,
      author: 'Alex Chen',
      authorInitials: 'AC'
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'answer':
        return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'vote':
        return <ArrowUp className="w-5 h-5 text-success" />;
      case 'accepted':
        return <Check className="w-5 h-5 text-success" />;
      case 'mention':
        return <User className="w-5 h-5 text-accent" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="rounded-xl">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">
                  You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}
                </p>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <Button variant="outline" className="rounded-xl">
              Mark all as read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length === 0 ? (
            <Card className="card-elevated">
              <CardContent className="p-12 text-center">
                <Bell className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No notifications yet</h3>
                <p className="text-muted-foreground">
                  When you start participating in discussions, you'll see notifications here.
                </p>
              </CardContent>
            </Card>
          ) : (
            notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`card-elevated cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  !notification.read ? 'border-primary/30 bg-primary/5' : ''
                }`}
                onClick={() => onNotificationClick(notification.questionId)}
              >
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5">
                                New
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs text-muted-foreground">Question:</span>
                            <span className="text-xs font-medium text-foreground line-clamp-1">
                              {notification.questionTitle}
                            </span>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            {notification.author && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {notification.authorInitials}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">
                                  {notification.author}
                                </span>
                              </div>
                            )}
                            <span className="text-xs text-muted-foreground">
                              {notification.timestamp}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Search, Plus, Home, User, LogOut, X, Menu, Shield } from "lucide-react";
// Removed Firebase auth import since we're using mock auth

interface UserData {
  email: string;
  name?: string;
  displayAs?: "public" | "anonymous";
  avatar?: string;
}

interface Notification {
  id: string;
  type: "answer" | "question" | "vote";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  questionId?: string;
}

interface NavigationProps {
  userRole: "guest" | "user" | "admin";
  userData?: UserData;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  notificationCount?: number;
  notifications: Notification[];
  onNotificationClick: (notificationId: string) => void;
  hideSearch?: boolean;
  hideHome?: boolean;
  onAdminAccess?: () => void;
}

const Navigation = ({
  userRole,
  userData,
  onNavigate,
  onLogout,
  notificationCount = 0,
  notifications = [],
  onNotificationClick,
  hideSearch = false,
  hideHome = false,
  onAdminAccess,
}: NavigationProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
    }
  };

  const handleLogout = () => {
    onLogout();
  };

  const handleGuestAskQuestion = () => {
    if (userRole === "guest") {
      if (window.confirm("You need to sign in to ask a question. Would you like to sign in now?")) {
        onLogout();
      }
      return;
    }
    onNavigate("ask");
  };

  const getUserInitials = () => {
    if (userData?.name) return userData.name.split(" ").map((n) => n[0]).join("").toUpperCase();
    if (userData?.email) return userData.email[0].toUpperCase();
    return "G";
  };

  return (
    <nav className="nav-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => onNavigate("home")}>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
              <Menu className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent logo-glow">
            StackIt
          </span>
        </div>

        {/* Search Bar */}
        {!hideSearch && (
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search questions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl bg-muted/50 border-0 focus:bg-card transition-colors"
              />
            </div>
          </form>
        )}

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          {!hideHome && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate("home")}
              className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          )}
          {userRole === "user" && (
            <Button onClick={handleGuestAskQuestion} className="btn-gradient" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          )}
          {userRole === "user" && (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative rounded-xl"
              >
                <Bell className="w-5 h-5" />
                {notificationCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive text-destructive-foreground">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </Badge>
                )}
              </Button>
              {showNotifications && (
                <Card className="absolute right-0 mt-2 w-80 shadow-lg border z-50">
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold">Notifications</h3>
                      <Button variant="ghost" size="sm" onClick={() => setShowNotifications(false)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground">No notifications</div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b last:border-b-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                              !notification.read ? "bg-primary/5" : ""
                            }`}
                            onClick={() => onNotificationClick(notification.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={`w-2 h-2 rounded-full mt-2 ${!notification.read ? "bg-primary" : "bg-transparent"}`}
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium">{notification.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{notification.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
          {userRole === "user" ? (
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="rounded-xl flex items-center gap-2"
              >
                <Avatar className="h-7 w-7">
                  {userData?.avatar ? (
                    <AvatarImage src={userData.avatar} alt="Profile" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getUserInitials()}
                    </AvatarFallback>
                  )}
                </Avatar>
              </Button>
              {showProfileMenu && (
                <Card className="absolute right-0 mt-2 w-48 shadow-lg border z-50">
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start"
                        onClick={() => {
                          onNavigate("profile");
                          setShowProfileMenu(false);
                        }}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Profile
                      </Button>
                      {onAdminAccess && (
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            onAdminAccess();
                            setShowProfileMenu(false);
                          }}
                        >
                          <Shield className="w-4 h-4 mr-2" />
                          Admin Panel
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive"
                        onClick={() => {
                          handleLogout();
                          setShowProfileMenu(false);
                        }}
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-lg">
                Guest Mode
              </Badge>
              <Button variant="outline" size="sm" onClick={onLogout} className="rounded-xl">
                Sign In
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="rounded-xl"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden mt-4 pb-4 border-t pt-4">
          <div className="flex flex-col space-y-2">
            {userRole === "guest" && (
              <>
                <Badge variant="secondary" className="self-start mb-2">
                  Guest Mode
                </Badge>
                <Button onClick={handleGuestAskQuestion} className="btn-gradient justify-start">
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
                <Button onClick={onLogout} className="btn-gradient justify-start">
                  Sign In
                </Button>
              </>
            )}
            {userRole === "user" && (
              <>
                <Button
                  onClick={() => {
                    handleGuestAskQuestion();
                    setShowMobileMenu(false);
                  }}
                  className="btn-gradient justify-start"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Ask Question
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start"
                  onClick={() => {
                    onNavigate("profile");
                    setShowMobileMenu(false);
                  }}
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-destructive hover:text-destructive"
                  onClick={() => {
                    handleLogout();
                    setShowMobileMenu(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
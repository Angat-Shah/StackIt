import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, Search, Plus, Home, User, Settings, LogOut, Layers } from "lucide-react";

interface NavigationProps {
  userRole: 'guest' | 'user';
  userData?: { email: string; name?: string };
  onNavigate: (page: string) => void;
  onLogout: () => void;
  notificationCount?: number;
}

const Navigation = ({ userRole, userData, onNavigate, onLogout, notificationCount = 3 }: NavigationProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Handle search functionality
      console.log('Searching for:', searchQuery);
    }
  };

  const getUserInitials = () => {
    if (userData?.name) {
      return userData.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    if (userData?.email) {
      return userData.email[0].toUpperCase();
    }
    return 'G';
  };

  return (
    <nav className="nav-blur sticky top-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => onNavigate('home')}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-md opacity-0 group-hover:opacity-30 transition-opacity" />
            <div className="relative bg-gradient-to-r from-primary to-accent p-2 rounded-xl">
              <Layers className="w-6 h-6 text-white" />
            </div>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            StackIt
          </span>
        </div>

        {/* Search Bar */}
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

        {/* Navigation Items */}
        <div className="flex items-center gap-4">
          {/* Home Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('home')}
            className="text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>

          {/* Ask Question Button (only for logged-in users) */}
          {userRole === 'user' && (
            <Button
              onClick={() => onNavigate('ask')}
              className="btn-gradient"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Ask Question
            </Button>
          )}

          {/* Notifications (only for logged-in users) */}
          {userRole === 'user' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('notifications')}
              className="relative text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
            >
              <Bell className="w-4 h-4" />
              {notificationCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          )}

          {/* User Menu */}
          {userRole === 'user' ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={userData?.name || userData?.email} />
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-white text-sm">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-sm border border-border/50 rounded-xl" align="end">
                <div className="px-3 py-2">
                  <p className="text-sm font-medium">{userData?.name || 'User'}</p>
                  <p className="text-xs text-muted-foreground">{userData?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => onNavigate('profile')}
                  className="cursor-pointer rounded-lg mx-1"
                >
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onNavigate('settings')}
                  className="cursor-pointer rounded-lg mx-1"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="cursor-pointer rounded-lg mx-1 text-destructive focus:text-destructive"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="rounded-lg">
                Guest Mode
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="rounded-xl"
              >
                Sign In
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
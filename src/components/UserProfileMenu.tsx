
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings, LogOut, User } from 'lucide-react';

interface UserProfileMenuProps {
  username: string;
  avatarUrl?: string;
  onLogout: () => void;
  onOpenPreferences: () => void;
}

const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  username,
  avatarUrl,
  onLogout,
  onOpenPreferences
}) => {
  // Get user initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-2 rounded-lg hover:bg-halo-accent hover:bg-opacity-20 transition-all duration-300">
          <Avatar className="h-8 w-8 border border-halo-accent">
            <AvatarImage src={avatarUrl} />
            <AvatarFallback className="bg-halo-darker text-halo-accent">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-halo-darker border border-halo-accent backdrop-blur-md" align="end">
        <DropdownMenuLabel className="text-halo-accent">
          <div className="flex flex-col">
            <span>{username}</span>
            <span className="text-xs text-gray-400 font-normal">HALO System User</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-halo-accent bg-opacity-30" />
        <DropdownMenuItem 
          className="flex items-center cursor-pointer hover:bg-halo-accent hover:bg-opacity-20"
          onClick={onOpenPreferences}
        >
          <Settings className="mr-2 h-4 w-4" />
          <span>Preferences</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="flex items-center cursor-pointer hover:bg-halo-accent hover:bg-opacity-20 text-red-400"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;

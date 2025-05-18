
import React, { useState } from 'react';
import { Plus, User, LogOut, Settings } from 'lucide-react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  onAddDeviceClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddDeviceClick }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between bg-black bg-opacity-50 backdrop-blur-md border-b border-halo-accent border-opacity-20">
      <div className="flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold neon-text tracking-wider">HALO OS</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 rounded-lg hover:bg-halo-accent hover:bg-opacity-20 transition-all duration-300"
          aria-label="Add device"
          onClick={onAddDeviceClick}
        >
          <Plus className="text-halo-accent w-6 h-6" />
        </button>
        <Popover open={isUserMenuOpen} onOpenChange={setIsUserMenuOpen}>
          <PopoverTrigger asChild>
            <button 
              className="p-2 rounded-lg hover:bg-halo-accent hover:bg-opacity-20 transition-all duration-300"
              aria-label="User profile"
            >
              <User className="text-halo-accent w-6 h-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-0 bg-black bg-opacity-90 border border-halo-accent border-opacity-30 text-white z-[100]">
            <div className="p-4 border-b border-halo-accent border-opacity-20">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback className="bg-halo-accent bg-opacity-20 text-halo-accent">ZM</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Zaid Mallik</p>
                  <p className="text-xs text-gray-400">Administrator</p>
                </div>
              </div>
            </div>
            <div className="p-2">
              <button 
                className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-halo-accent hover:bg-opacity-10 text-left transition-colors"
              >
                <Settings size={18} className="text-halo-accent" />
                <span>Preferences</span>
              </button>
              <button 
                className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-halo-accent hover:bg-opacity-10 text-left transition-colors"
              >
                <LogOut size={18} className="text-halo-accent" />
                <span>Logout</span>
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default Navbar;

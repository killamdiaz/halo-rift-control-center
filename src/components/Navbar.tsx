
import React from 'react';
import { Plus } from 'lucide-react';
import UserProfileMenu from './UserProfileMenu';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

interface NavbarProps {
  onAddDeviceClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onAddDeviceClick }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    // In a real app, we'd clear tokens/session here
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    navigate('/login');
  };

  const handleOpenPreferences = () => {
    toast({
      title: "Preferences",
      description: "Preferences panel would open here.",
    });
    // In a real app, this would open a preferences modal or page
  };

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
        <UserProfileMenu 
          username="John Doe" 
          onLogout={handleLogout}
          onOpenPreferences={handleOpenPreferences}
        />
      </div>
    </nav>
  );
};

export default Navbar;


import React from 'react';
import { Plus, User } from 'lucide-react';

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 px-6 flex items-center justify-between bg-black bg-opacity-50 backdrop-blur-md border-b border-halo-accent border-opacity-20">
      <div className="flex-shrink-0">
        <h1 className="text-xl md:text-2xl font-bold neon-text tracking-wider">HALO OS</h1>
      </div>
      <div className="flex items-center space-x-4">
        <button 
          className="p-2 rounded-lg hover:bg-halo-accent hover:bg-opacity-20 transition-all duration-300"
          aria-label="Add device"
        >
          <Plus className="text-halo-accent w-6 h-6" />
        </button>
        <button 
          className="p-2 rounded-lg hover:bg-halo-accent hover:bg-opacity-20 transition-all duration-300"
          aria-label="User profile"
        >
          <User className="text-halo-accent w-6 h-6" />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

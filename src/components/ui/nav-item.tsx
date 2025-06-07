
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  title: string;
  icon: LucideIcon;
  id: string;
  active: boolean;
  onNavChange: (id: string) => void;
  alert?: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({
  title,
  icon: Icon,
  id,
  active,
  onNavChange,
  alert = false
}) => {
  return (
    <Button
      variant="ghost"
      className={`w-full justify-start mb-1 relative ${
        active 
          ? 'bg-halo-accent bg-opacity-20 text-halo-accent border-l-2 border-halo-accent' 
          : 'text-white hover:bg-halo-accent hover:bg-opacity-10 hover:text-halo-accent'
      }`}
      onClick={() => onNavChange(id)}
    >
      <Icon className="w-4 h-4 mr-3" />
      <span className="flex-1 text-left">{title}</span>
      {alert && (
        <div className="w-2 h-2 bg-red-500 rounded-full ml-2" />
      )}
    </Button>
  );
};

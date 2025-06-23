import React, { useContext, useState } from 'react';
import { Plus, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AuthContext } from '@/App';
import DeviceAlertsSystem from './DeviceAlertsSystem';

interface NavbarProps {
  onAddDeviceClick: () => void;
  showRightSidebar?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onAddDeviceClick, showRightSidebar = false }) => {
  const { logout } = useContext(AuthContext);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <nav className="bg-black bg-opacity-50 backdrop-blur-lg border-b border-halo-accent border-opacity-20 px-6 py-4 w-full flex-shrink-0">
      <div className="flex items-center justify-between w-full">
        {/* Left side - Title only */}
        <div className="flex items-center">
          {/* <h1 className="text-xl font-bold text-blue-400">HALO OS</h1> */}
        </div>

        {/* Right side - Device Alerts, Add Device, and User Menu */}
        <div className="flex items-center space-x-4">
          <DeviceAlertsSystem />
          
          <Button 
            onClick={() => {
              console.log("🟢 Add Device button clicked (renderer)");

              try {
                if (window?.electron?.ipcRenderer) {
                  window.electron.ipcRenderer.send('log-to-main', '🟢 Add Device button clicked');
                  window.electron.ipcRenderer.send("start-ble-pairing", "shoe");
                } else {
                  console.warn("⚠️ ipcRenderer is not available on window.electron");
                }
              } catch (error) {
                console.error("❌ Failed to send IPC message:", error);
              }

              onAddDeviceClick();
            }}
            className="bg-halo-accent text-black hover:bg-halo-accent hover:opacity-80 font-medium"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Device
          </Button>

          {/* User Menu */}
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 mr-2">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HardwareControl from '@/components/HardwareControl';
import { SidebarProvider } from '@/components/ui/sidebar';
import DeviceSidebar from '@/components/DeviceSidebar';
import AddDeviceModal from '@/components/AddDeviceModal';

const Index = () => {
  const [currentDevice, setCurrentDevice] = useState('shoe');
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-halo-gradient text-white flex">
        <DeviceSidebar 
          currentDevice={currentDevice}
          onDeviceChange={setCurrentDevice}
        />
        <div className="flex-1 flex flex-col">
          <Navbar onAddDeviceClick={() => setIsAddDeviceModalOpen(true)} />
          <HardwareControl deviceType={currentDevice} />
        </div>
        <AddDeviceModal 
          open={isAddDeviceModalOpen} 
          onOpenChange={setIsAddDeviceModalOpen} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;

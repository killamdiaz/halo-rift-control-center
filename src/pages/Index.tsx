
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HardwareControl from '@/components/HardwareControl';
import { SidebarProvider } from '@/components/ui/sidebar';
import DeviceSidebar from '@/components/DeviceSidebar';
import AddDeviceModal from '@/components/AddDeviceModal';
import MappingPanel from '@/components/MappingPanel';
import TestModePanel from '@/components/TestModePanel';
import StatsPanel from '@/components/StatsPanel';

const Index = () => {
  const [currentDevice, setCurrentDevice] = useState('shoe');
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  
  // Render content based on selected device
  const renderContent = () => {
    switch(currentDevice) {
      case 'mapping':
        return <MappingPanel />;
      case 'test':
        return <TestModePanel />;
      default:
        return <HardwareControl deviceType={currentDevice} />;
    }
  };
  
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen bg-halo-gradient text-white flex">
        <DeviceSidebar 
          currentDevice={currentDevice}
          onDeviceChange={setCurrentDevice}
        />
        <div className="flex-1 flex flex-col">
          <Navbar onAddDeviceClick={() => setIsAddDeviceModalOpen(true)} />
          {renderContent()}
        </div>
        
        {/* Right stats sidebar - only show when viewing hardware device */}
        {['shoe', 'gun', 'suit'].includes(currentDevice) && (
          <StatsPanel deviceType={currentDevice} />
        )}
        
        <AddDeviceModal 
          open={isAddDeviceModalOpen} 
          onOpenChange={setIsAddDeviceModalOpen} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;

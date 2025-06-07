
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import HardwareControl from '@/components/HardwareControl';
import { SidebarProvider } from '@/components/ui/sidebar';
import DeviceSidebar from '@/components/DeviceSidebar';
import EnhancedAddDeviceModal from '@/components/EnhancedAddDeviceModal';
import PairedDevicesManager from '@/components/PairedDevicesManager';
import MappingPanel from '@/components/MappingPanel';
import TestModePanel from '@/components/TestModePanel';
import StatsPanel from '@/components/StatsPanel';
import FirmwareUpdatePanel from '@/components/FirmwareUpdatePanel';
import LiveDeviceMap from '@/components/LiveDeviceMap';
import SmartDiagnostics from '@/components/SmartDiagnostics';
import UsageHistoryPanel from '@/components/UsageHistoryPanel';
import PerformanceModeToggle from '@/components/PerformanceModeToggle';

const Index = () => {
  const [currentDevice, setCurrentDevice] = useState('shoe');
  const [isAddDeviceModalOpen, setIsAddDeviceModalOpen] = useState(false);
  
  // Mock firmware updates data
  const firmwareUpdates = [
    {
      deviceId: 'gun-001',
      deviceName: 'Primary Gun',
      currentVersion: 'v1.0.3',
      availableVersion: 'v1.1.0',
      updateSize: '2.4 MB',
      releaseNotes: [
        'Improved motion tracking accuracy',
        'Reduced input latency by 15%',
        'Enhanced battery optimization',
        'Bug fixes and stability improvements'
      ]
    }
  ];
  
  // Render content based on selected device
  const renderContent = () => {
    switch(currentDevice) {
      case 'mapping':
        return <MappingPanel />;
      case 'test':
        return <TestModePanel />;
      case 'devices':
        return (
          <div className="space-y-6">
            <PairedDevicesManager />
            <FirmwareUpdatePanel updates={firmwareUpdates} />
          </div>
        );
      case 'diagnostics':
        return (
          <div className="space-y-6">
            <LiveDeviceMap />
            <SmartDiagnostics />
          </div>
        );
      case 'analytics':
        return <UsageHistoryPanel />;
      case 'settings':
        return <PerformanceModeToggle />;
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
        
        <EnhancedAddDeviceModal 
          open={isAddDeviceModalOpen} 
          onOpenChange={setIsAddDeviceModalOpen} 
        />
      </div>
    </SidebarProvider>
  );
};

export default Index;

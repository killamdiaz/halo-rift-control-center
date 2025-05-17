
import React from 'react';
import Navbar from '@/components/Navbar';
import HardwareControl from '@/components/HardwareControl';

const Index = () => {
  return (
    <div className="min-h-screen bg-halo-gradient text-white">
      <Navbar />
      <HardwareControl />
    </div>
  );
};

export default Index;

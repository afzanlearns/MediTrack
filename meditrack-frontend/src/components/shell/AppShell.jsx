import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

const AppShell = () => {
  return (
    <div className="min-h-screen bg-[#0A0E13]">
      <div className="max-w-[480px] mx-auto min-h-screen bg-[#0A0E13] relative">
        <div className="pb-20">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  );
};

export default AppShell;

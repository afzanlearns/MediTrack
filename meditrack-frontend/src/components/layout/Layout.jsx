import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-page-bg">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/25 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="lg:pl-[236px] min-h-screen">
        <TopBar onToggleSidebar={toggleSidebar} />
        <main className="pt-[72px] px-4 sm:px-6 lg:px-8 pb-8">
          <div className="content-shell">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;

import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

const AppShell = () => {
  return (
    <div className="min-h-screen bg-[#060A10]">
      <div className="relative mx-auto min-h-screen max-w-[480px] border-x border-[#0F1A24] bg-[#0A0E13] shadow-[0_0_60px_rgba(0,0,0,0.35)]">
        <div className="pb-20">
          <Outlet />
        </div>
      </div>
      <BottomNav />
    </div>
  )
}

export default AppShell

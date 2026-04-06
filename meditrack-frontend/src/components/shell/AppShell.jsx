import React from 'react'
import { Outlet } from 'react-router-dom'
import BottomNav from './BottomNav'

// Clean, no decorations on the shell itself
export default function AppShell() {
  return (
    <div className="min-h-screen bg-[#080B0F]">
      <div className="max-w-app mx-auto min-h-screen flex flex-col relative">
        <main className="flex-1 pb-16 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

import React from 'react'
import { Outlet } from 'react-router-dom'
import { WifiOff } from 'lucide-react'
import BottomNav from './BottomNav'
import { useOnlineStatus } from '../../hooks/useOnlineStatus'

// Clean, no decorations on the shell itself
export default function AppShell() {
  const isOnline = useOnlineStatus()

  return (
    <div className="min-h-screen bg-[#080B0F]">
      <div className="max-w-app mx-auto min-h-screen flex flex-col relative">
        {!isOnline && (
          <div className="bg-[#D95B5B1A] border-b border-[#D95B5B]/20 px-5 pt-12 pb-3
                          flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-[#D95B5B] flex-shrink-0" />
            <span className="text-xs font-medium text-[#D95B5B]">
              You are offline — showing cached data
            </span>
          </div>
        )}
        <main className="flex-1 pb-16 overflow-y-auto">
          <Outlet />
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

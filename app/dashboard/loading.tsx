
'use client';

import { motion } from 'framer-motion';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-[#FFF8F2]">
      {/* Navbar Skeleton */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#F6B7C8]/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gray-200 animate-pulse" />
              <div className="w-24 h-6 bg-gray-200 rounded-lg animate-pulse hidden sm:block" />
            </div>
            <div className="flex items-center gap-4">
              <div className="w-32 h-8 bg-gray-200 rounded-xl animate-pulse hidden md:block" />
              <div className="w-32 h-10 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Welcome Section Skeleton */}
        <div className="mb-14">
          <div className="w-64 h-10 bg-gray-200 rounded-2xl animate-pulse mb-4" />
          <div className="w-96 h-6 bg-gray-200 rounded-xl animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-gray-100 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="w-12 h-8 bg-gray-100 rounded-lg animate-pulse" />
                <div className="w-24 h-4 bg-gray-100 rounded-md animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        {/* Menu Items Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-sm h-64">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 animate-pulse mb-6" />
              <div className="w-40 h-6 bg-gray-100 rounded-lg animate-pulse mb-4" />
              <div className="w-full h-4 bg-gray-100 rounded-md animate-pulse mb-2" />
              <div className="w-2/3 h-4 bg-gray-100 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

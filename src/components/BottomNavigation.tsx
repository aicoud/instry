import React from 'react';
import { Home, Search, PlusSquare, PlaySquare, UserCircle } from 'lucide-react';

interface BottomNavigationProps {
  onAddClick: () => void;
}

export function BottomNavigation({ onAddClick }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white border-t border-gray-200 flex justify-between items-center px-6 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] z-50">
      <button className="text-black hover:text-gray-600 transition">
        <Home className="w-7 h-7 stroke-[1.5]" />
      </button>
      <button className="text-black hover:text-gray-600 transition">
        <Search className="w-7 h-7 stroke-[1.5]" />
      </button>
      <button onClick={onAddClick} className="text-black hover:scale-105 transition-transform">
        <PlusSquare className="w-7 h-7 stroke-[1.5]" />
      </button>
      <button className="text-black hover:text-gray-600 transition">
        <PlaySquare className="w-7 h-7 stroke-[1.5]" />
      </button>
      <button className="text-black hover:text-gray-600 transition">
        <UserCircle className="w-8 h-8 stroke-[1.5]" />
      </button>
    </div>
  );
}

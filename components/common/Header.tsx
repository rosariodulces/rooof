import React from 'react';
import { AppView } from '../../types';

interface HeaderProps {
  activeView: AppView;
  setActiveView: (view: AppView) => void;
}

const GarciaLogo = () => (
    <svg width="48" height="40" viewBox="0 0 60 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 0L0 20L5 23L30 8L55 23L60 20L30 0Z" fill="currentColor" className="text-brand-orange"/>
        <path d="M5 25L30 40L55 25V48H5V25Z" fill="#4B5563"/>
        <path d="M22 32H38V48H22V32Z" fill="#374151"/>
    </svg>
);


const Header: React.FC<HeaderProps> = ({ activeView, setActiveView }) => {
  const navItems = Object.values(AppView);

  return (
    <header className="bg-gray-900/60 backdrop-blur-lg sticky top-0 z-10 w-full border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between h-auto sm:h-20 py-4 sm:py-0">
          <div className="flex items-center mb-4 sm:mb-0">
            <GarciaLogo />
            <h1 className="text-2xl font-bold text-white ml-3">Garcia Roofing AI Suite</h1>
          </div>
          <nav className="flex flex-wrap justify-center gap-2">
            {navItems.map((view) => (
              <button
                key={view}
                onClick={() => setActiveView(view)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                  activeView === view
                    ? 'bg-brand-orange text-white shadow-md'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {view}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
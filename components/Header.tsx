import React, { useState, useEffect, useRef } from 'react';
import type { User } from '../types';
import BookOpenIcon from './icons/BookOpenIcon';

interface HeaderProps {
  user: User | null;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="py-6 mb-8">
      <div className="container mx-auto flex items-center justify-between text-center">
        <div className="flex items-center">
          <BookOpenIcon className="w-10 h-10 text-emerald-300 mr-4 flex-shrink-0" />
          <h1 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
            The Grove of Whispering Tomes
          </h1>
        </div>
        
        <div className="relative">
          {user ? (
            <div ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2">
                <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full border-2 border-emerald-400" />
                <span className="text-white hidden sm:inline">Welcome, {user.name.split(' ')[0]}</span>
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800/90 backdrop-blur-md rounded-md shadow-lg py-1 border border-emerald-300/20 z-50">
                  <button
                    onClick={() => {
                      onSignOut();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-emerald-700/50 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
             <div className="flex items-center space-x-4">
                <span className="text-slate-300 hidden md:block">Author Portal</span>
                <div id="signInDiv"></div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
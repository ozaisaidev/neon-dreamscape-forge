
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();
  const activeTab = location.pathname;
  
  const navItems = [
    { path: '/', label: 'About Me' },
    { path: '/projects', label: 'Projects' },
    { path: '/gameroom', label: 'Game Room' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 py-6 px-4 sm:px-8">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold neon-text-gradient">Portfolio</span>
        </Link>
        
        <div className="glass-card flex items-center px-2 py-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200",
                activeTab === item.path
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {activeTab === item.path && (
                <div className="absolute inset-0 rounded-lg bg-neon-purple/20 animate-fade-in" />
              )}
              <span className="relative z-10">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

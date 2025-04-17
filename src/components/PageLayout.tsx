
import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import ThreeScene from './ThreeScene';

interface PageLayoutProps {
  children: ReactNode;
  pageType: 'aboutMe' | 'projects' | 'gameRoom';
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, pageType }) => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-hidden relative">
      {/* 3D background */}
      <ThreeScene sceneType={pageType} />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Content */}
      <div className="pt-24 pb-12 px-4 sm:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full py-4 text-center text-sm text-gray-400">
        <div className="glass-card inline-block px-4 py-2 rounded-full">
          <p>&copy; {new Date().getFullYear()} • Made with <span className="text-neon-pink">❤</span></p>
        </div>
      </footer>
    </div>
  );
};

export default PageLayout;

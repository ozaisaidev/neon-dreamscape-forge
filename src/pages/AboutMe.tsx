
import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Bot, Code, Trophy } from 'lucide-react';
import MouseTracker from '@/components/MouseTracker';

const AboutMe = () => {
  return (
    <PageLayout pageType="aboutMe">
      <MouseTracker />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Header Section */}
        <div className="col-span-1 md:col-span-3 text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="neon-text-gradient">Hello World!</span>
          </h1>
          <div className="glass-card p-6 max-w-2xl mx-auto animate-fade-in">
            <p className="text-xl mb-4">
              I'm a <span className="text-neon-pink font-bold">Machine Learning enthusiast</span>, 
              <span className="text-neon-blue font-bold"> Rust developer</span>, and
              <span className="text-neon-purple font-bold"> Formula 1 fanatic</span> with a passion for building
              innovative solutions at the intersection of technology and creativity.
            </p>
          </div>
        </div>
        
        {/* Interest Cards */}
        <div className="col-span-1">
          <InterestCard 
            icon={<Bot className="w-12 h-12 text-neon-pink" />}
            title="Machine Learning" 
            description="Fascinated by neural networks, computer vision, and the potential of AI to solve complex problems."
            color="pink"
          />
        </div>
        
        <div className="col-span-1">
          <InterestCard 
            icon={<Code className="w-12 h-12 text-neon-blue" />}
            title="Rust Development" 
            description="Passionate about building high-performance, reliable, and safe systems using Rust."
            color="blue"
          />
        </div>
        
        <div className="col-span-1">
          <InterestCard 
            icon={<Trophy className="w-12 h-12 text-neon-purple" />}
            title="Formula 1" 
            description="Obsessed with the engineering, strategy, and thrill of Formula 1 racing."
            color="purple"
          />
        </div>
        
        {/* Timeline */}
        <div className="col-span-1 md:col-span-3 mt-12">
          <h2 className="text-3xl font-bold mb-6 text-center">
            <span className="text-glow text-neon-green">My Journey</span>
          </h2>
          
          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-neon-pink via-neon-blue to-neon-purple"></div>
            
            <Timeline 
              year="2023"
              title="Advanced ML Research"
              description="Led research on generative models for creative applications"
              side="right"
            />
            
            <Timeline 
              year="2022"
              title="Rust for High-Performance Systems"
              description="Developed critical infrastructure components using Rust"
              side="left"
            />
            
            <Timeline 
              year="2021"
              title="Computer Vision Projects"
              description="Created object detection systems for autonomous applications"
              side="right"
            />
            
            <Timeline 
              year="2020"
              title="Started Programming Journey"
              description="Began exploring the world of software development"
              side="left"
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

interface InterestCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: 'pink' | 'blue' | 'purple';
}

const InterestCard: React.FC<InterestCardProps> = ({ icon, title, description, color }) => {
  const colorClasses = {
    pink: "border-neon-pink/30 hover:border-neon-pink neon-glow-pink",
    blue: "border-neon-blue/30 hover:border-neon-blue neon-glow-blue",
    purple: "border-neon-purple/30 hover:border-neon-purple neon-glow-purple",
  };
  
  return (
    <div className={`glass-card p-6 border transition-all duration-300 hover:scale-105 ${colorClasses[color]} interactive-card`}>
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};

interface TimelineProps {
  year: string;
  title: string;
  description: string;
  side: 'left' | 'right';
}

const Timeline: React.FC<TimelineProps> = ({ year, title, description, side }) => {
  return (
    <div className={`flex items-center mb-12 ${side === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`w-5/12 ${side === 'right' ? 'text-right pr-8' : 'text-left pl-8'}`}>
        <div className={`glass-card p-6 transition-all duration-300 hover:scale-105 animate-fade-in ${side === 'right' ? 'ml-auto' : 'mr-auto'}`}>
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-gray-300">{description}</p>
        </div>
      </div>
      
      <div className="w-2/12 flex justify-center">
        <div className="bg-dark-card w-12 h-12 rounded-full flex items-center justify-center z-10 border-2 border-white animate-pulse">
          <span className="font-bold">{year}</span>
        </div>
      </div>
      
      <div className="w-5/12"></div>
    </div>
  );
};

export default AboutMe;

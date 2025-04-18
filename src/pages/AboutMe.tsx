import React from 'react';
import PageLayout from '@/components/PageLayout';
import { Bot, Code, Trophy } from 'lucide-react';
import GradientBackground from '@/components/GradientBackground';
import { ArrowRight } from 'lucide-react';
import MouseTracker from '@/components/MouseTracker';

const AboutMe = () => {
  return (
    <PageLayout pageType="aboutMe">
      <GradientBackground />
      <MouseTracker />
      <div className="grid grid-cols-1 gap-12 max-w-5xl mx-auto px-4 md:px-0">
        {/* Hero Section */}
        <div className="flex flex-col space-y-8 mt-12">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Hello, world! I'm <span className="text-neon-blue">a Machine Learning enthusiast</span>,
            <span className="text-neon-pink"> Rust developer</span>, and
            <span className="text-neon-purple"> Formula 1 fanatic</span>.
          </h1>
          
          <p className="text-xl text-gray-300 leading-relaxed max-w-3xl">
            I build innovative solutions at the intersection of technology and creativity,
            with a focus on high-performance systems and artificial intelligence.
          </p>
          
          <div>
            <a href="#contact" className="inline-flex items-center space-x-2 text-white border-b border-neon-blue pb-1 transition-all duration-300 hover:text-neon-blue">
              <span>Get in touch</span>
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
        
        {/* Expertise Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-medium mb-8">Areas of Expertise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ExpertiseCard 
              icon={<Bot className="w-8 h-8 text-neon-pink" />}
              title="Machine Learning" 
              description="Neural networks, computer vision, and generative models for creative applications."
            />
            
            <ExpertiseCard 
              icon={<Code className="w-8 h-8 text-neon-blue" />}
              title="Rust Development" 
              description="High-performance, reliable, and safe systems development using Rust."
            />
            
            <ExpertiseCard 
              icon={<Trophy className="w-8 h-8 text-neon-purple" />}
              title="Formula 1" 
              description="Engineering, strategy, and performance analysis in motorsport technology."
            />
          </div>
        </div>
        
        {/* Timeline Section */}
        <div className="mt-12">
          <h2 className="text-2xl font-medium mb-8">Professional Journey</h2>
          
          <div className="space-y-12">
            <TimelineItem 
              year="2023"
              title="Advanced ML Research"
              description="Led research on generative models for creative applications and developed new approaches to computer vision problems."
            />
            
            <TimelineItem 
              year="2022"
              title="Rust for High-Performance Systems"
              description="Developed critical infrastructure components using Rust, focusing on performance optimization and memory safety."
            />
            
            <TimelineItem 
              year="2021"
              title="Computer Vision Projects"
              description="Created object detection systems for autonomous applications, utilizing state-of-the-art deep learning architectures."
            />
            
            <TimelineItem 
              year="2020"
              title="Started Programming Journey"
              description="Began exploring the world of software development with a focus on algorithms and data structures."
            />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

interface ExpertiseCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ icon, title, description }) => {
  return (
    <div className="bg-dark-card/40 backdrop-blur-sm border border-white/10 p-6 rounded-xl">
      <div className="flex flex-col space-y-4">
        <div>
          {icon}
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  );
};

interface TimelineItemProps {
  year: string;
  title: string;
  description: string;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ year, title, description }) => {
  return (
    <div className="flex">
      <div className="mr-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full border border-neon-blue/30 text-neon-blue">
          {year}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-medium mb-1">{title}</h3>
        <p className="text-gray-300 max-w-2xl">{description}</p>
      </div>
    </div>
  );
};

export default AboutMe;


import React, { useState } from 'react';
import PageLayout from '@/components/PageLayout';
import { Code, Brain, Database, Zap, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Projects = () => {
  const [filter, setFilter] = useState<string | null>(null);
  
  const projects = [
    {
      id: 1,
      title: "Neural Image Generator",
      description: "A GAN-based model that creates artistic representations from text descriptions.",
      category: "ML",
      icon: <Brain className="w-8 h-8" />,
      color: "pink"
    },
    {
      id: 2,
      title: "Rust Performance Toolkit",
      description: "A collection of high-performance utilities for system optimization written in Rust.",
      category: "Rust",
      icon: <Code className="w-8 h-8" />,
      color: "blue"
    },
    {
      id: 3,
      title: "Race Strategy Simulator",
      description: "An F1 race strategy simulator that predicts optimal pit stop windows and tire choices.",
      category: "F1",
      icon: <Zap className="w-8 h-8" />,
      color: "purple"
    },
    {
      id: 4,
      title: "ML Model Serving API",
      description: "Scalable API for serving ML models with automatic scaling based on traffic patterns.",
      category: "ML",
      icon: <Database className="w-8 h-8" />,
      color: "pink"
    },
    {
      id: 5,
      title: "Rust Data Structures",
      description: "Implementation of advanced data structures optimized for performance in Rust.",
      category: "Rust",
      icon: <Code className="w-8 h-8" />,
      color: "blue"
    },
    {
      id: 6,
      title: "Racing Telemetry Visualizer",
      description: "Real-time visualizations of racing telemetry data with insights and analysis.",
      category: "F1",
      icon: <Zap className="w-8 h-8" />,
      color: "purple"
    }
  ];
  
  const filteredProjects = filter 
    ? projects.filter(project => project.category === filter)
    : projects;

  return (
    <PageLayout pageType="projects">
      <div>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            <span className="neon-text-gradient">My Projects</span>
          </h1>
          <p className="text-xl text-gray-300 glass-card p-4 inline-block">
            Explore my creations across machine learning, Rust, and Formula 1
          </p>
        </div>
        
        {/* Filters */}
        <div className="flex justify-center gap-4 mb-12 flex-wrap">
          <Button
            variant={filter === null ? "default" : "outline"}
            onClick={() => setFilter(null)}
            className="rounded-full"
          >
            All Projects
          </Button>
          <Button
            variant={filter === "ML" ? "default" : "outline"}
            onClick={() => setFilter("ML")}
            className="text-neon-pink rounded-full"
          >
            Machine Learning
          </Button>
          <Button
            variant={filter === "Rust" ? "default" : "outline"}
            onClick={() => setFilter("Rust")}
            className="text-neon-blue rounded-full"
          >
            Rust Development
          </Button>
          <Button
            variant={filter === "F1" ? "default" : "outline"}
            onClick={() => setFilter("F1")}
            className="text-neon-purple rounded-full"
          >
            Formula 1
          </Button>
        </div>
        
        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  color: string;
}

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const { title, description, category, icon, color } = project;
  
  const colorClasses = {
    pink: "border-neon-pink/30 hover:border-neon-pink bg-gradient-to-br from-dark-card to-neon-pink/10",
    blue: "border-neon-blue/30 hover:border-neon-blue bg-gradient-to-br from-dark-card to-neon-blue/10",
    purple: "border-neon-purple/30 hover:border-neon-purple bg-gradient-to-br from-dark-card to-neon-purple/10",
  };
  
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className={`relative h-80 group perspective-1000 transition-transform cursor-pointer animate-fade-in interactive-card`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={`absolute inset-0 duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
        {/* Front */}
        <div className={`absolute inset-0 glass-card border ${colorClasses[color]} p-6 backface-hidden`}>
          <div className="flex flex-col h-full">
            <div className="flex items-center mb-4">
              <div className={`p-2 rounded-lg text-${color === 'pink' ? 'neon-pink' : color === 'blue' ? 'neon-blue' : 'neon-purple'}`}>
                {icon}
              </div>
              <div className="ml-4">
                <span className="text-xs uppercase tracking-wider text-gray-400">{category}</span>
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            </div>
            
            <p className="text-gray-300 flex-grow">{description}</p>
            
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-400">Click to view details</span>
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-neon-pink animate-pulse"></div>
                <div className="w-3 h-3 rounded-full bg-neon-blue animate-pulse delay-100"></div>
                <div className="w-3 h-3 rounded-full bg-neon-purple animate-pulse delay-200"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Back */}
        <div className={`absolute inset-0 glass-card border ${colorClasses[color]} p-6 rotate-y-180 backface-hidden`}>
          <div className="flex flex-col h-full">
            <h3 className="text-xl font-bold mb-4">{title} Details</h3>
            
            <ul className="text-gray-300 space-y-2 mb-4 flex-grow">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Built with cutting-edge technologies</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Focused on performance optimization</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Full documentation and testing</span>
              </li>
            </ul>
            
            <div className="flex justify-between items-center mt-4">
              <Button size="sm" className="flex items-center gap-2">
                <Github className="w-4 h-4" />
                <span>View Code</span>
              </Button>
              <span className="text-sm text-gray-400">Click to flip back</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Projects;

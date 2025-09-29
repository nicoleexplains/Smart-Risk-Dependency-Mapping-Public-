
import React from 'react';

const GraphIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 11h2v8H7v-8zm4-3h2v11h-2V8zm4-3h2v14h-2V5zM5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2zM5 5h14v14H5V5z" />
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-slate-800/80 backdrop-blur-sm border-b border-slate-700 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <GraphIcon className="h-8 w-8 text-sky-400" />
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Smart Risk & Dependency Mapping
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

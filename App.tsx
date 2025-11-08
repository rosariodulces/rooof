import React, { useState } from 'react';
import Header from './components/common/Header';
import ChatBot from './components/ChatBot';
import ImageGeneration from './components/ImageGeneration';
import ImageAnalysis from './components/ImageAnalysis';
import ImageEditing from './components/ImageEditing';
import { AppView } from './types';

const Footer = () => (
  <footer className="w-full text-center p-4 mt-auto">
    <p className="text-xs text-gray-500">
      &copy; {new Date().getFullYear()} Garcia Roofing LLC. AI Suite powered by Google Gemini.
    </p>
  </footer>
);

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<AppView>(AppView.IMAGE_EDITING);

  const renderActiveView = () => {
    switch (activeView) {
      case AppView.CHAT:
        return <ChatBot />;
      case AppView.IMAGE_GENERATION:
        return <ImageGeneration />;
      case AppView.IMAGE_ANALYSIS:
        return <ImageAnalysis />;
      case AppView.IMAGE_EDITING:
        return <ImageEditing />;
      default:
        return <ImageEditing />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-800 text-white flex flex-col">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderActiveView()}
      </main>
      <Footer />
    </div>
  );
};

export default App;
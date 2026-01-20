import { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { ChatInterface } from './components/ChatInterface';
import { ApiDocs } from './components/ApiDocs';
import { CodeExamples } from './components/CodeExamples';
import { Footer } from './components/Footer';

export function App() {
  const [activeSection, setActiveSection] = useState<'home' | 'chat' | 'api' | 'examples'>('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <Header activeSection={activeSection} setActiveSection={setActiveSection} />
      
      {activeSection === 'home' && (
        <>
          <Hero setActiveSection={setActiveSection} />
          <Features />
        </>
      )}
      
      {activeSection === 'chat' && <ChatInterface />}
      {activeSection === 'api' && <ApiDocs />}
      {activeSection === 'examples' && <CodeExamples />}
      
      <Footer />
    </div>
  );
}

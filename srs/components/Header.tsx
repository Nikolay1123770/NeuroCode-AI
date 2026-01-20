import { cn } from '@/utils/cn';

interface HeaderProps {
  activeSection: string;
  setActiveSection: (section: 'home' | 'chat' | 'api' | 'examples') => void;
}

export function Header({ activeSection, setActiveSection }: HeaderProps) {
  const navItems = [
    { id: 'home', label: 'Главная' },
    { id: 'chat', label: 'AI Чат' },
    { id: 'api', label: 'API' },
    { id: 'examples', label: 'Примеры' },
  ] as const;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveSection('home')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              NeuroCode AI
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                  activeSection === item.id
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'text-gray-300 hover:text-white hover:bg-white/5'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium text-sm hover:opacity-90 transition-opacity">
            Получить API Key
          </button>
        </div>
      </div>
    </header>
  );
}

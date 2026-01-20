interface HeroProps {
  setActiveSection: (section: 'home' | 'chat' | 'api' | 'examples') => void;
}

export function Hero({ setActiveSection }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-sm text-purple-300">Бесплатный API для разработчиков</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Создавайте с помощью
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              ИИ нового поколения
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto mb-10">
            Бесплатный API для создания Telegram ботов, веб-сайтов, мобильных приложений 
            и любых других проектов. Интегрируйте мощь нейросетей в ваши разработки за минуты.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => setActiveSection('chat')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-lg hover:scale-105 transition-transform shadow-lg shadow-purple-500/25"
            >
              Попробовать бесплатно
            </button>
            <button 
              onClick={() => setActiveSection('api')}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Документация API
            </button>
          </div>

          <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '100K+', label: 'API запросов/день' },
              { value: '50+', label: 'Языков программирования' },
              { value: '99.9%', label: 'Uptime' },
              { value: '< 500ms', label: 'Время ответа' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

import { ArrowLeft, Search, HelpCircle, Wallet, Zap, Shield, DollarSign, CreditCard, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Help() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openCategory, setOpenCategory] = useState<string | null>('getting-started');

  const categories = [
    {
      id: 'getting-started',
      title: 'Начало работы',
      icon: HelpCircle,
      questions: [
        {
          q: 'Что такое TakeYourToken?',
          a: 'TakeYourToken — это Web3 платформа для цифрового майнинга криптовалют. Мы предлагаем NFT-майнеры, которые генерируют ежедневные вознаграждения в Bitcoin без необходимости физического оборудования.'
        },
        {
          q: 'Как начать зарабатывать?',
          a: 'Зарегистрируйтесь → Пройдите KYC → Купите NFT-майнер → Получайте ежедневные BTC вознаграждения автоматически.'
        },
        {
          q: 'Нужно ли мне специальное оборудование?',
          a: 'Нет. TYT использует облачный майнинг. Всё оборудование находится в наших дата-центрах. Вам нужен только интернет-браузер.'
        },
        {
          q: 'Какие страны поддерживаются?',
          a: 'Платформа доступна по всему миру, кроме санкционированных стран (Иран, Северная Корея, Сирия и др.). США — ожидается регуляторное одобрение.'
        }
      ]
    },
    {
      id: 'miners',
      title: 'NFT Майнеры',
      icon: Zap,
      questions: [
        {
          q: 'Что такое NFT-майнер?',
          a: 'NFT-майнер — это цифровой токен (NFT), представляющий доступ к нашему облачному майнинг сервису. Каждый NFT содержит параметры: мощность (TH/s), эффективность (W/TH), регион размещения и стоимость обслуживания.'
        },
        {
          q: 'Как рассчитываются вознаграждения?',
          a: 'Формула: (Ваш TH/s / Общая сеть BTC) × Награда за блок × Блоков в день - Электричество - Service Fee (15%) + Скидки (VIP, Service Button).'
        },
        {
          q: 'Что такое Service Button?',
          a: 'Уникальная функция TYT. Нажимая кнопку один раз в 24 часа, вы получаете скидку -3% на обслуживание. Это повышает вашу чистую прибыль.'
        },
        {
          q: 'Могу ли я продать свой майнер?',
          a: 'Да! Используйте наш Marketplace для продажи NFT-майнеров другим пользователям. Комиссия — 5%, из которых 1% идёт в фонд помощи детям.'
        },
        {
          q: 'Можно ли улучшить майнер?',
          a: 'Да. Вы можете: увеличить TH/s, улучшить эффективность (W/TH), настроить auto-reinvest для автоматической покупки дополнительной мощности из вознаграждений.'
        }
      ]
    },
    {
      id: 'wallet',
      title: 'Кошелёк и Транзакции',
      icon: Wallet,
      questions: [
        {
          q: 'Какие активы поддерживаются?',
          a: 'Bitcoin (BTC), TYT Token (Solana), USDT, Wrapped BTC, TRON (TRX), Solana (SOL), XRP, TON.'
        },
        {
          q: 'Как пополнить баланс?',
          a: 'Wallet → Deposit → Выберите сеть → Получите адрес → Отправьте криптовалюту. Минимальные подтверждения: BTC — 3, ETH — 12, TRON — 20, Solana — 32.'
        },
        {
          q: 'Как вывести средства?',
          a: 'Wallet → Withdraw → Укажите адрес и сумму → Подтвердите. Комиссия — 1% платформа + сетевые комиссии. Выводы обрабатываются в течение 24 часов.'
        },
        {
          q: 'Есть ли лимиты на вывод?',
          a: 'Да, зависят от уровня KYC: Tier 1 — $1,000/день, Tier 2 — $10,000/день, Tier 3 — $50,000/день. Крупные суммы могут требовать дополнительной проверки.'
        },
        {
          q: 'Что такое custodial wallet?',
          a: 'Мы храним приватные ключи за вас (custodial). Это проще для новичков, но требует доверия к платформе. Планируется добавить non-custodial опцию в будущем.'
        }
      ]
    },
    {
      id: 'payment',
      title: 'Платежи и Fees',
      icon: CreditCard,
      questions: [
        {
          q: 'Как оплачивать обслуживание майнеров?',
          a: 'Обслуживание списывается автоматически с вашего баланса. Можно платить в TYT (скидка -20% + burn) или USDT/BTC.'
        },
        {
          q: 'Что происходит, если не хватает средств?',
          a: 'Майнер приостанавливается до пополнения баланса. Вознаграждения не начисляются, пока обслуживание не оплачено.'
        },
        {
          q: 'Какие комиссии берёт платформа?',
          a: 'Mining service fee — 15% от gross BTC, Marketplace — 5% продажа, Withdrawal — 1% + network fees, Deposit — только сетевые комиссии.'
        },
        {
          q: 'Что такое VIP скидки?',
          a: 'Держите TYT токены для получения статуса: Bronze (1K) — 2%, Silver (5K) — 5%, Gold (25K) — 9%, Platinum (100K) — 13%, Diamond (500K) — 18% скидка на обслуживание.'
        }
      ]
    },
    {
      id: 'security',
      title: 'Безопасность и KYC',
      icon: Shield,
      questions: [
        {
          q: 'Нужно ли проходить KYC?',
          a: 'KYC требуется для вывода средств. Tier 1 — базовая информация, Tier 2 — документы + селфи, Tier 3 — расширенная верификация для VIP.'
        },
        {
          q: 'Как защищены мои средства?',
          a: 'Используем: шифрование AES-256, cold storage для большинства средств, 2FA аутентификация, мониторинг подозрительной активности 24/7, регулярные аудиты безопасности.'
        },
        {
          q: 'Что делать если забыл пароль?',
          a: 'Используйте "Forgot Password" на странице входа. Вам будет отправлена ссылка для сброса на email. Убедитесь, что у вас есть доступ к email!'
        },
        {
          q: 'Могу ли я включить 2FA?',
          a: 'Да! Settings → Security → Enable 2FA. Поддерживаем TOTP (Google Authenticator, Authy). Настоятельно рекомендуем для защиты аккаунта.'
        },
        {
          q: 'Что делать при взломе?',
          a: 'Немедленно: измените пароль, включите 2FA, напишите в support@takeyourtoken.app. Мы заморозим аккаунт для расследования.'
        }
      ]
    },
    {
      id: 'token',
      title: 'TYT Token',
      icon: DollarSign,
      questions: [
        {
          q: 'Что такое TYT токен?',
          a: 'TYT — utility токен на Solana, используемый для: оплаты обслуживания (скидка -20%), marketplace валюта, governance голосование, VIP статусы.'
        },
        {
          q: 'Где купить TYT?',
          a: 'TYT создан на pump.fun (Solana). Адрес: APadkPpjonaLBpLYDzKB6753QQU3s8VZhEtkvLgrpump. Также доступен внутри платформы через TYT Trading.'
        },
        {
          q: 'Что такое veTYT?',
          a: 'Vote-escrowed TYT. Заблокируйте TYT на срок от 1 недели до 4 лет для получения voting power (1x - 4x) и влияния на управление платформой.'
        },
        {
          q: 'Что происходит с сожжёнными TYT?',
          a: 'Каждая оплата обслуживания в TYT сжигает токены (burn). 25% от сожжённого возвращается в Фонд помощи детям (CharityMint).'
        }
      ]
    },
    {
      id: 'foundation',
      title: 'Детский Фонд',
      icon: Lock,
      questions: [
        {
          q: 'Что такое TYT Foundation?',
          a: 'TYT Children\'s Brain Cancer Research & Support Foundation — благотворительный фонд, финансирующий исследования опухолей мозга у детей и поддержку семей.'
        },
        {
          q: 'Как работает финансирование?',
          a: '1% от каждой транзакции на платформе автоматически идёт в фонд: продажа NFT — 1%, marketplace — 1%, обслуживание — 1%, CharityMint из burn.'
        },
        {
          q: 'Как проверить прозрачность?',
          a: 'Все транзакции фонда публичны в блокчейне. Ежемесячные отчёты доступны в разделе Foundation. Wallet адрес фонда полностью прозрачен.'
        },
        {
          q: 'Могу ли я пожертвовать дополнительно?',
          a: 'Да! Foundation → Donate. Можно отправить USDT, BTC или TYT. Все пожертвования налоговым вычитываются (после получения 501c3).'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    questions: cat.questions.filter(q =>
      searchQuery === '' ||
      q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <ArrowLeft size={20} />
              <span>На главную</span>
            </Link>
            <div className="flex items-center gap-2">
              <HelpCircle className="w-6 h-6 text-amber-400" />
              <span className="font-bold text-lg">Help Center</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Как мы можем помочь?</h1>
          <p className="text-xl text-gray-400">Найдите ответы на популярные вопросы о TakeYourToken</p>
        </div>

        {/* Search */}
        <div className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Поиск по вопросам..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Ничего не найдено. Попробуйте другой запрос.</p>
            </div>
          ) : (
            filteredCategories.map((category) => {
              const Icon = category.icon;
              const isOpen = openCategory === category.id;

              return (
                <div key={category.id} className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 overflow-hidden">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : category.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center border border-amber-500/50">
                        <Icon className="w-5 h-5 text-amber-400" />
                      </div>
                      <h2 className="text-xl font-bold">{category.title}</h2>
                      <span className="text-sm text-gray-400">({category.questions.length})</span>
                    </div>
                    <div className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 space-y-4">
                      {category.questions.map((item, idx) => (
                        <div key={idx} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700/50">
                          <h3 className="font-semibold text-amber-400 mb-2">{item.q}</h3>
                          <p className="text-gray-300 text-sm leading-relaxed">{item.a}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Contact Support */}
        <div className="mt-12 bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Не нашли ответ?</h3>
          <p className="text-gray-300 mb-6">Наша команда поддержки готова помочь вам 24/7</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@takeyourtoken.app"
              className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg transition-colors"
            >
              Написать в Support
            </a>
            <a
              href="https://t.me/takeyourtoken"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-amber-500 hover:bg-amber-500/10 rounded-lg font-semibold transition-colors"
            >
              Telegram Community
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

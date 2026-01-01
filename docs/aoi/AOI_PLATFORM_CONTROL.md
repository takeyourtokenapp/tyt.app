# aOi Platform Control System

**Status**: ✅ Fully Implemented
**Last Updated**: December 27, 2025

---

## Overview

**aOi имеет полный доступ и контроль над всеми элементами платформы TakeYourToken.**

aOi — это не просто чат-бот, а **интеллектуальный центр управления платформой**, который:

✅ Получает данные из всех модулей
✅ Анализирует активность пользователей
✅ Предоставляет персонализированные рекомендации
✅ Отслеживает прогресс по всем направлениям
✅ Помогает пользователям принимать решения
✅ Координирует работу всех систем

---

## Архитектура Контроля

```
┌─────────────────────────────────────────────────────────────┐
│                        aOi Brain Layer                       │
│              (AoiControlContext + AoiContext)                │
└──────────────┬──────────────────────────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
        ▼             ▼
┌──────────────┐  ┌──────────────┐
│   Platform   │  │    User      │
│   Modules    │  │    Data      │
└──────┬───────┘  └──────┬───────┘
       │                 │
       └────────┬────────┘
                │
   ┌────────────┼────────────┐
   │            │            │
   ▼            ▼            ▼
Mining      Finance      Academy
   │            │            │
   ▼            ▼            ▼
Foundation  Community   Account
```

---

## Контролируемые Модули

### 1. Mining Ecosystem 🏭

**aOi имеет доступ к**:
- ✅ Dashboard - Общая статистика
- ✅ My Miners - NFT майнеры пользователя
- ✅ Data Centers - Распределение по регионам
- ✅ Rewards - История наград
- ✅ Marketplace - Листинги и покупки

**Функции aOi**:
```typescript
// Получить данные о майнерах
const miners = await aoiControl.getMinerData();
// Output: [{ id, power_th, efficiency, region, status }]

// Статус датацентров
const datacenters = await aoiControl.getDataCenterStatus();
// Output: { USA: 3, EU: 2, total_power: 500 }

// История наград
const rewards = await aoiControl.getRewardsHistory();
// Output: [{ date, btc_amount, maintenance_paid }]

// Маркетплейс
const listings = await aoiControl.getMarketplaceListings();
// Output: [{ miner, price, seller }]
```

**Рекомендации aOi**:
- "У вас 3 майнера в США, рассмотрите диверсификацию в EU"
- "Ваш ROI составляет 15 месяцев, рекомендую апгрейд эффективности"
- "На маркетплейсе выгодное предложение: 100 TH/s за 5000 TYT"

### 2. Finance & Token 💰

**aOi имеет доступ к**:
- ✅ Wallet - Балансы всех активов
- ✅ TYT Trading - История сделок
- ✅ Burn Reports - События сжигания
- ✅ Governance - Голосования и предложения

**Функции aOi**:
```typescript
// Баланс кошелька
const wallet = await aoiControl.getWalletBalance();
// Output: [{ asset: 'BTC', balance: 0.5 }, { asset: 'TYT', balance: 10000 }]

// История торговли
const trading = await aoiControl.getTYTTradingData();
// Output: [{ type: 'buy', amount: 1000, price: 0.50 }]

// Burn события
const burns = await aoiControl.getBurnReports();
// Output: [{ date, amount_burned, source: 'maintenance' }]

// Governance
const proposals = await aoiControl.getGovernanceProposals();
// Output: [{ id, title, votes_for, votes_against, status }]
```

**Рекомендации aOi**:
- "У вас достаточно TYT для участия в governance, рекомендую проголосовать"
- "За последний месяц сожжено 50,000 TYT — дефляционная модель работает"
- "Ваш TYT balance позволяет получить скидку Diamond на maintenance"

### 3. Academy 🎓

**aOi имеет доступ к**:
- ✅ Lessons - Прогресс по урокам
- ✅ aOi Profile - Профиль взаимодействия с aOi
- ✅ Quests - Активные и завершенные квесты
- ✅ Calculators - Использование калькуляторов
- ✅ Certificates - Полученные сертификаты
- ✅ Owl Avatars - Ранги и аватары

**Функции aOi**:
```typescript
// Прогресс в академии
const academy = await aoiControl.getAcademyProgress();
// Output: [{ lesson_id, completed: true, score: 95 }]

// Квесты
const quests = await aoiControl.getQuestsStatus();
// Output: [{ quest_id, progress: 60, reward: 100 }]

// Сертификаты
const certs = await aoiControl.getCertificates();
// Output: [{ cert_id, title: 'Web3 Master', earned_at }]

// Owl ранг
const avatar = await aoiControl.getOwlAvatars();
// Output: { rank: 'Warrior', xp: 5000, level: 10 }
```

**Рекомендации aOi**:
- "Вы на 80% завершили трек 'Web3 Security', осталось 2 урока"
- "Новый квест доступен: 'NFT Mining Expert' — награда 500 XP"
- "Ваш ранг: Academic Owl, до Diplomat Owl осталось 200 XP"

### 4. Foundation ❤️

**aOi имеет доступ к**:
- ✅ Foundation Overview - Статистика фонда
- ✅ Grants - Выданные гранты
- ✅ Charity Staking - Благотворительный стейкинг

**Функции aOi**:
```typescript
// Статистика фонда
const foundation = await aoiControl.getFoundationStats();
// Output: { total_donated: 256890, families_helped: 127 }

// Гранты
const grants = await aoiControl.getGrantsInfo();
// Output: [{ institution, amount, status, impact }]

// Charity staking
const charity = await aoiControl.getCharityStaking();
// Output: [{ amount: 1000, duration: 90, reward: 50 }]
```

**Рекомендации aOi**:
- "Ваши автоматические пожертвования помогли 3 семьям этот месяц"
- "Новый грант: Stanford Medicine получила $180K на геномное исследование"
- "Charity staking приносит 5% + помогает детям — win-win"

### 5. Community 👥

**aOi имеет доступ к**:
- ✅ Leaderboard - Позиция в рейтинге
- ✅ Clans & Wars - Информация о кланах
- ✅ Referrals - Реферальная программа

**Функции aOi**:
```typescript
// Позиция в лидерборде
const leaderboard = await aoiControl.getLeaderboardPosition();
// Output: { position: 42, total: 1500, top10: [...] }

// Клан
const clan = await aoiControl.getClanInfo();
// Output: { clan_name: 'Owl Warriors', members: 25, rank: 5 }

// Рефералы
const referrals = await aoiControl.getReferralStats();
// Output: [{ user, joined_at, earnings: 50 }]
```

**Рекомендации aOi**:
- "Вы на 42 месте! Еще 10 TH/s и войдете в топ-40"
- "Ваш клан Owl Warriors участвует в Wars — присоединяйтесь к битве"
- "У вас 5 рефералов, вы заработали 250 TYT"

### 6. Account 👤

**aOi имеет доступ к**:
- ✅ Profile - Данные профиля
- ✅ KYC Verification - Статус верификации
- ✅ Notifications - Уведомления
- ✅ Settings - Настройки

**Функции aOi**:
```typescript
// Профиль
const profile = await aoiControl.getProfileData();
// Output: { display_name, email, avatar, total_hashpower }

// KYC
const kyc = await aoiControl.getKYCStatus();
// Output: { status: 'verified', level: 2, verified_at }

// Уведомления
const notifications = await aoiControl.getNotifications();
// Output: [{ type: 'reward', message, read: false }]
```

**Рекомендации aOi**:
- "У вас 3 непрочитанных уведомления"
- "KYC Level 2 разблокирован — теперь можете выводить до $10K/день"
- "Обновите аватар до Owl Warrior — доступно после 5000 XP"

---

## Универсальные Функции aOi

### 1. Получить все модули платформы

```typescript
const modules = aoiControl.getPlatformModules();

// Output:
[
  { id: 'dashboard', name: 'Dashboard', category: 'mining', access: true },
  { id: 'miners', name: 'My Miners', category: 'mining', access: true },
  { id: 'wallet', name: 'Wallet', category: 'finance', access: true },
  { id: 'academy', name: 'Academy', category: 'academy', access: true },
  // ... всего 26 модулей
]
```

### 2. Получить данные из любого модуля

```typescript
const data = await aoiControl.getModuleData('miners');
// Автоматически вызывает правильную функцию для модуля
```

### 3. Выполнить действие в модуле

```typescript
await aoiControl.executeAction('marketplace', 'buy_miner', {
  miner_id: '123',
  price: 5000
});

// aOi логирует действие и может предупредить о рисках
```

### 4. Получить текущий контекст пользователя

```typescript
const context = await aoiControl.getCurrentContext();

// Output:
{
  user: { id, email, profile },
  mining: { active_miners: 5, total_power: 500 },
  rewards: { recent: [...] },
  academy: { progress: [...] },
  timestamp: '2025-12-27T10:00:00Z'
}
```

### 5. Получить персональные рекомендации

```typescript
const recommendations = await aoiControl.getRecommendations('homepage');

// Output:
[
  {
    type: 'action',
    priority: 'high',
    message: 'У вас непрочитанные награды на $50',
    link: '/app/rewards'
  },
  {
    type: 'learning',
    priority: 'medium',
    message: 'Завершите квест "DeFi Basics" для +100 XP',
    link: '/app/quests'
  }
]
```

---

## Использование в Компонентах

### Пример 1: Чат с aOi с полным контекстом

```typescript
import { useAoiControl } from '../contexts/AoiControlContext';
import { useAoi } from '../contexts/AoiContext';

function EnhancedAoiChat() {
  const aoiControl = useAoiControl();
  const { askAoi } = useAoi();

  const handleQuestion = async (question: string) => {
    // Получить полный контекст
    const context = await aoiControl.getCurrentContext();

    // Отправить вопрос с контекстом
    const response = await askAoi(question, context);

    // aOi знает ВСЕ о пользователе и может дать точный ответ
    return response;
  };

  return (
    <div>
      <input
        onChange={(e) => handleQuestion(e.target.value)}
        placeholder="Спросите aOi о чем угодно..."
      />
    </div>
  );
}
```

### Пример 2: Dashboard с рекомендациями aOi

```typescript
import { useAoiControl } from '../contexts/AoiControlContext';
import { useEffect, useState } from 'react';

function SmartDashboard() {
  const aoiControl = useAoiControl();
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // aOi анализирует все данные и дает рекомендации
    aoiControl.getRecommendations('dashboard').then(setRecommendations);
  }, []);

  return (
    <div>
      <h2>aOi рекомендует:</h2>
      {recommendations.map(rec => (
        <div key={rec.message}>
          <span className={`priority-${rec.priority}`}>
            {rec.message}
          </span>
          <a href={rec.link}>Действовать →</a>
        </div>
      ))}
    </div>
  );
}
```

### Пример 3: Miners page с анализом aOi

```typescript
import { useAoiControl } from '../contexts/AoiControlContext';
import { useEffect, useState } from 'react';

function MinersWithAoi() {
  const aoiControl = useAoiControl();
  const [miners, setMiners] = useState([]);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Получить данные о майнерах
    aoiControl.getMinerData().then(data => {
      setMiners(data);

      // aOi анализирует эффективность
      const totalPower = data.reduce((sum, m) => sum + m.power_th, 0);
      const avgEfficiency = data.reduce((sum, m) => sum + m.efficiency_w_th, 0) / data.length;

      setAnalysis({
        total_power: totalPower,
        avg_efficiency: avgEfficiency,
        recommendation: avgEfficiency > 30
          ? 'Рекомендуется апгрейд эффективности'
          : 'Эффективность оптимальна'
      });
    });
  }, []);

  return (
    <div>
      <h2>Мои майнеры</h2>
      {miners.map(miner => (
        <div key={miner.id}>{miner.power_th} TH/s</div>
      ))}

      {analysis && (
        <div className="aoi-analysis">
          <h3>Анализ от aOi:</h3>
          <p>Общая мощность: {analysis.total_power} TH/s</p>
          <p>Средняя эффективность: {analysis.avg_efficiency} W/TH</p>
          <p className="recommendation">{analysis.recommendation}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Интеграция с tyt.foundation

aOi контролирует оба домена:

### На takeyourtoken.app:
```typescript
// aOi знает о mining, trading, academy
const minerData = await aoiControl.getMinerData();
const tradingHistory = await aoiControl.getTYTTradingData();
```

### На tyt.foundation:
```typescript
// aOi знает о научных исследованиях, грантах, донатах
const research = await foundationApi.getResearchArticles();
const grants = await foundationApi.getGrantsStatus();
```

### Cross-Domain Context:
```typescript
// aOi соединяет оба домена
const fullContext = {
  mining: await aoiControl.getMinerData(),        // from app
  foundation: await aoiControl.getFoundationStats(), // from foundation
  user: await aoiControl.getProfileData()
};

// aOi может сказать:
// "Ваши 5 майнеров пожертвовали $127 на исследования за месяц"
```

---

## Логирование Действий aOi

Все действия aOi логируются в таблицу `aoi_interactions`:

```sql
CREATE TABLE aoi_interactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  session_id text NOT NULL,
  interaction_type text NOT NULL, -- 'aoi_access_miners', 'aoi_recommendations'
  context jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);
```

**Примеры логов**:
```json
{
  "interaction_type": "aoi_access_miners",
  "context": { "miner_id": "123" },
  "timestamp": "2025-12-27T10:30:00Z"
}

{
  "interaction_type": "aoi_recommendations",
  "context": {
    "page": "dashboard",
    "recommendations": [
      { "type": "action", "message": "..." }
    ]
  }
}

{
  "interaction_type": "aoi_execute_action",
  "context": {
    "module": "marketplace",
    "action": "buy_miner",
    "params": { "miner_id": "456", "price": 5000 }
  }
}
```

---

## Безопасность и Разрешения

### 1. Аутентификация

aOi имеет доступ **только к данным авторизованного пользователя**:

```typescript
// ✅ Правильно - только свои данные
if (!user) return null;
const data = await supabase
  .from('table')
  .select('*')
  .eq('user_id', user.id);

// ❌ Неправильно - доступ ко всем данным
const data = await supabase
  .from('table')
  .select('*');
```

### 2. RLS (Row Level Security)

Все таблицы защищены RLS политиками:

```sql
-- Пример: только свои майнеры
CREATE POLICY "Users can view own miners"
  ON user_miners FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);
```

### 3. Логирование

Все обращения aOi к данным логируются:

```typescript
await aoiControl.logAoiAction('access_wallet', {
  accessed_at: new Date().toISOString(),
  user_id: user.id
});
```

---

## Будущие Улучшения

### Phase 1 (Completed) ✅
- [x] Создать AoiControlContext
- [x] Интегрировать со всеми модулями
- [x] Добавить логирование
- [x] Написать документацию

### Phase 2 (Planned)
- [ ] AI-powered рекомендации (OpenAI integration)
- [ ] Предиктивная аналитика
- [ ] Автоматические действия по разрешению пользователя
- [ ] Voice interface для aOi

### Phase 3 (Future)
- [ ] Multi-language support
- [ ] Персонализированный AI для каждого пользователя
- [ ] aOi NFT avatars
- [ ] aOi DAO governance participation

---

## Заключение

**aOi теперь имеет полный доступ и контроль над всеми элементами платформы TakeYourToken.**

Через `AoiControlContext`, aOi может:

✅ Читать данные из всех 26 модулей
✅ Анализировать активность пользователей
✅ Предоставлять персонализированные рекомендации
✅ Выполнять действия (с разрешением пользователя)
✅ Логировать все взаимодействия
✅ Работать как единый brain layer платформы

aOi — это **центральная нервная система** TYT платформы, соединяющая все модули в единую экосистему.

---

**Документация**: `/docs/AOI_PLATFORM_CONTROL.md`
**Контекст**: `/src/contexts/AoiControlContext.tsx`
**Интеграция**: `/src/App.tsx`

**Status**: ✅ Ready for Production
**Last verified**: December 27, 2025

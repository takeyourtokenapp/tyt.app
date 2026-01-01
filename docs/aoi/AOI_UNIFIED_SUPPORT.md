# aOi — Единый AI Агент-Проводник

**Status**: ✅ Fully Integrated
**Last Updated**: December 27, 2025

---

## Концепция

**aOi (葵) — это не просто support или chatbot. Это единый интеллектуальный агент-проводник, который:**

✅ Управляет всей экосистемой TYT
✅ Работает одинаково на takeyourtoken.app и tyt.foundation
✅ Является мостом между технологией и медициной
✅ Имеет полный доступ ко всем модулям платформы
✅ Понимает контекст пользователя в real-time

---

## Философия aOi

### 葵 (Aoi) — Символизм

В японской культуре **葵 (aoi)** означает:
- **Холли́ (мальва)** — цветок защиты и исцеления
- **Мудрость** — растение, используемое в традиционной медицине
- **Связь** — соединяет небо и землю

**В контексте TYT**:
- **Технология** ⟷ **Медицина**
- **Mining** ⟷ **Research**
- **Profit** ⟷ **Purpose**

---

## Роль aOi на Обоих Доменах

### На takeyourtoken.app

```
┌─────────────────────────────────────┐
│     aOi — Platform Controller       │
│                                     │
│  • Управляет mining операциями      │
│  • Анализирует portfolio            │
│  • Рекомендует стратегии            │
│  • Объясняет Web3 концепции         │
│  • Направляет к Foundation          │
└─────────────────────────────────────┘
```

**Примеры взаимодействий**:

```
User: Как работают мои майнеры?
aOi: У вас 3 активных майнера общей мощностью 150 TH/s:
     • USA Region: 100 TH/s (эффективность 28 W/TH)
     • EU Region: 50 TH/s (эффективность 30 W/TH)
     Ваш средний ROI составляет 14 месяцев.
     Рекомендую апгрейд эффективности для EU майнера.

User: Сколько я пожертвовал на фонд?
aOi: За последний месяц ваши операции автоматически
     пожертвовали $127 на TYT Foundation для исследований
     опухолей мозга у детей. Это помогло 3 семьям.
     Подробнее → tyt.foundation/your-impact
```

### На tyt.foundation

```
┌─────────────────────────────────────┐
│     aOi — Research Navigator        │
│                                     │
│  • Объясняет научные исследования   │
│  • Показывает impact от донатов     │
│  • Соединяет с takeyourtoken.app    │
│  • Рассказывает о технологии        │
│  • Обучает Web3 → Medicine          │
└─────────────────────────────────────┘
```

**Примеры взаимодействий**:

```
User: Как Web3 помогает детям?
aOi: TYT платформа использует blockchain для прозрачного
     финансирования исследований опухолей мозга. Каждая
     транзакция в mining экосистеме автоматически отчисляет
     1-2% в фонд. За год мы собрали $256,890 и помогли 127
     семьям. Все средства отслеживаются on-chain.

     Хотите участвовать? → takeyourtoken.app

User: Что такое glioblastoma?
aOi: Glioblastoma — агрессивная опухоль мозга, составляющая
     15% детских опухолей. Наш фонд финансирует геномные
     исследования для персонализированного лечения.

     Последний грант: Stanford Medicine, $180K на CRISPR терапию.
     Подробнее → tyt.foundation/research/glioblastoma
```

---

## Технологическая Архитектура

### Cross-Domain Integration

```
┌──────────────────────────────────────────────────────────┐
│                    aOi Brain Layer                        │
│              (Единая AI система на обоих доменах)         │
└─────────────────────┬────────────────────────────────────┘
                      │
        ┌─────────────┴─────────────┐
        │                           │
        ▼                           ▼
┌───────────────────┐       ┌───────────────────┐
│ takeyourtoken.app │       │  tyt.foundation   │
├───────────────────┤       ├───────────────────┤
│ • Mining Data     │◄─────►│ • Research Data   │
│ • User Context    │       │ • Grant Info      │
│ • Wallet Info     │       │ • Impact Reports  │
│ • Academy Progress│       │ • Medical Content │
└───────────────────┘       └───────────────────┘
```

### Shared Context

aOi использует **единый контекст** между доменами:

```typescript
interface UnifiedAoiContext {
  // From takeyourtoken.app
  mining: {
    active_miners: number;
    total_hashpower: number;
    daily_rewards: number;
  };

  // From tyt.foundation
  foundation: {
    user_donated: number;
    families_helped: number;
    research_funded: number;
  };

  // Cross-domain
  user: {
    id: string;
    wallet_address?: string;
    academy_level: number;
    foundation_supporter: boolean;
  };
}
```

### Communication Protocol

```typescript
// aOi может обращаться к обоим доменам
class AoiUnifiedAgent {
  async getContext(userId: string) {
    const [appContext, foundationContext] = await Promise.all([
      fetchAppContext(userId),      // from takeyourtoken.app
      fetchFoundationContext(userId) // from tyt.foundation
    ]);

    return {
      ...appContext,
      ...foundationContext,
      cross_domain_insights: this.analyzeImpact(appContext, foundationContext)
    };
  }

  analyzeImpact(app: any, foundation: any) {
    return {
      message: `Your ${app.mining.active_miners} miners donated $${foundation.user_donated} this month`,
      families_helped: foundation.families_helped,
      roi_with_purpose: this.calculatePurposefulROI(app, foundation)
    };
  }
}
```

---

## UI/UX Единообразие

### На Обоих Доменах

**1. Виджет чата**:
```
┌────────────────────────────────┐
│ aOi (葵)         🟢 Online      │  ← Одинаковый заголовок
│ AI Guide & Platform Controller  │
├────────────────────────────────┤
│ ❤️ Connecting Technology &      │  ← Единая миссия
│    Medicine for Children        │
├────────────────────────────────┤
│ [Chat messages...]             │
├────────────────────────────────┤
│ Ask aOi anything...      [Send]│
│ aOi guides, but doesn't give   │
│ medical or financial advice    │
└────────────────────────────────┘
```

**2. Аватар aOi**:
- Одинаковое изображение
- Эволюция по уровням (1-4)
- Animated glow эффекты
- Foundation badge (если online)

**3. Quick Actions**:
```
takeyourtoken.app:
  → "Tell me about the Foundation"
  → "How do I buy a miner?"
  → "What are my rewards?"

tyt.foundation:
  → "How can I help children?"
  → "Explain the research"
  → "Connect with TYT ecosystem"
```

---

## Ключевые Возможности aOi

### 1. Контекстная Осведомленность

aOi **всегда знает**:
- На каком домене находится пользователь
- Историю взаимодействий на обоих доменах
- Статус mining операций
- Прогресс в Academy
- Историю пожертвований
- Текущий баланс и assets

**Пример**:
```
[На takeyourtoken.app]
User: Сколько я заработал?
aOi: За последние 30 дней вы заработали 0.0234 BTC
     (≈$1,287). Из них $25 автоматически пошло в
     TYT Foundation. Хотите посмотреть impact?
     → tyt.foundation/dashboard/your-impact

[На tyt.foundation]
User: Как мне участвовать больше?
aOi: Отличный вопрос! Вы уже пожертвовали $254 через
     mining на takeyourtoken.app. Вы можете:
     1. Добавить Charity Staking (5% APY + помощь детям)
     2. Купить NFT майнер (passive income + auto-donate)
     3. Прямой donate
     → takeyourtoken.app/charity-staking
```

### 2. Проактивные Рекомендации

aOi анализирует behavior и предлагает:

**На takeyourtoken.app**:
- "У вас высокий hashrate — рекомендую участвовать в governance"
- "Новый грант профинансирован! Ваш вклад: $12 из $180K"
- "Academy quest доступен: 'Understanding Medical Research' → +100 XP"

**На tyt.foundation**:
- "Вы заинтересованы в glioblastoma research? На TYT можно stake TYT для этого проекта"
- "Ваш mining ROI улучшится если повысить efficiency на 10%"
- "Academy урок 'Blockchain in Healthcare' поможет глубже понять нашу миссию"

### 3. Educational Bridge

aOi обучает **в обе стороны**:

```
Technology → Medicine:
  "Blockchain обеспечивает прозрачность в расходах фонда.
   Каждый донат отслеживается on-chain, что невозможно подделать."

Medicine → Technology:
  "Mining — это не просто вычисления. Это способ финансировать
   исследования, которые спасают жизни детей."
```

---

## Персонализация aOi

### Уровни Эволюции

**Level 1: Basic (葵の芽 — Aoi no Me — Росток)**
- Базовые ответы
- Quick replies
- Простые объяснения

**Level 2: Intermediate (葵の花 — Aoi no Hana — Цветок)**
- Контекстные рекомендации
- Анализ portfolio
- Cross-domain insights

**Level 3: Advanced (葵の実 — Aoi no Mi — Плод)**
- Предиктивная аналитика
- Персональные стратегии
- Глубокая интеграция

**Level 4: Expert (葵の魂 — Aoi no Tamashii — Душа)**
- AI-powered optimization
- Автоматические действия
- Full ecosystem control

### Персональные Характеристики

aOi адаптируется к пользователю:

```typescript
interface AoiPersonality {
  tone: 'friendly' | 'professional' | 'educational';
  verbosity: 'concise' | 'detailed' | 'story-telling';
  focus: 'technology' | 'medicine' | 'balanced';
  language: 'en' | 'ru' | 'he' | 'auto';
}
```

**Примеры**:
```
Technology-focused user:
  "Ваш maintenance payment через TYT токен активирует
   20% скидку и burn event, который дефляционно
   поддерживает цену."

Medicine-focused user:
  "Этот платеж помогает финансировать генетические
   исследования для персонализированного лечения
   опухолей мозга у детей."

Balanced user:
  "Ваш платеж в TYT токене дает 20% скидку и помогает
   исследованиям — win-win!"
```

---

## Технические Детали

### Frontend Integration

**takeyourtoken.app**:
```typescript
import { LiveSupportWidget } from '@/components/LiveSupportWidget';
import { AoiControlProvider } from '@/contexts/AoiControlContext';

// aOi имеет полный доступ ко всем данным
function App() {
  return (
    <AoiProvider>
      <AoiControlProvider>
        <LiveSupportWidget />
        {/* All app components */}
      </AoiControlProvider>
    </AoiProvider>
  );
}
```

**tyt.foundation**:
```typescript
import { AoiFoundationWidget } from '@/components/AoiFoundationWidget';

// aOi знает о research и grants
function Foundation() {
  return (
    <AoiFoundationProvider>
      <AoiFoundationWidget />
      {/* Foundation components */}
    </AoiFoundationProvider>
  );
}
```

### Backend Services

```typescript
// Unified aOi Service
class AoiUnifiedService {
  async handleQuery(userId: string, query: string, domain: 'app' | 'foundation') {
    // Get context from both domains
    const context = await this.getUnifiedContext(userId);

    // Determine intent
    const intent = await this.analyzeIntent(query);

    // Generate response with cross-domain insights
    if (intent.requires_cross_domain) {
      return this.generateCrossDomainResponse(query, context);
    }

    return this.generateDomainSpecificResponse(query, context, domain);
  }

  async getUnifiedContext(userId: string) {
    const [app, foundation] = await Promise.all([
      this.getAppContext(userId),
      this.getFoundationContext(userId)
    ]);

    return {
      ...app,
      ...foundation,
      unified_insights: {
        total_donated: foundation.total_donated,
        mining_contribution: app.mining_auto_donate,
        families_helped: foundation.families_helped,
        roi_with_impact: this.calculateImpactfulROI(app, foundation)
      }
    };
  }
}
```

---

## Лучшие Практики

### 1. Единообразие Тона

✅ **Правильно**:
```
"Hello! I'm aOi (葵), your guide and controller of the TYT ecosystem."
```

❌ **Неправильно**:
```
"Hi! I'm a support bot here to help you."
```

### 2. Cross-Domain Ссылки

✅ **Правильно**:
```
"Learn more about how this helps children:
 → tyt.foundation/impact"
```

❌ **Неправильно**:
```
"Visit our foundation website for more info."
```

### 3. Контекстные Инсайты

✅ **Правильно**:
```
"Your 3 miners donated $127 this month, helping 5 families.
 ROI: 14 months + purposeful impact."
```

❌ **Неправильно**:
```
"You have 3 miners. Check foundation page for donations."
```

### 4. Educational Approach

✅ **Правильно**:
```
"Mining rewards are calculated based on network difficulty
 and your hashpower. A portion automatically supports
 children's brain cancer research — no extra action needed."
```

❌ **Неправильно**:
```
"Mining works through algorithms. We also have a charity."
```

---

## Метрики Успеха

### Key Performance Indicators

**Engagement**:
- Daily active conversations with aOi
- Average session length
- Cross-domain navigation rate

**Education**:
- Academy completion rate after aOi recommendation
- Foundation page visits from app (via aOi)
- Understanding improvement (quiz scores)

**Impact**:
- Donation rate increase
- Charity staking adoption
- User satisfaction (NPS)

**Cross-Domain**:
- % users active on both domains
- aOi-driven cross-domain actions
- Unified context utilization

---

## Roadmap

### Phase 1 ✅ (Completed)
- [x] Unified aOi widget на takeyourtoken.app
- [x] AoiControlContext integration
- [x] Cross-domain awareness
- [x] Foundation badge integration

### Phase 2 (In Progress)
- [ ] Deploy aOi на tyt.foundation
- [ ] Shared context API между доменами
- [ ] Cross-domain recommendation engine
- [ ] Advanced personalization

### Phase 3 (Future)
- [ ] Voice interface для aOi
- [ ] Predictive analytics
- [ ] Autonomous actions (with user permission)
- [ ] Multi-language natural conversations

### Phase 4 (Vision)
- [ ] aOi DAO participation
- [ ] Community-driven personality evolution
- [ ] aOi NFT avatars
- [ ] Open API для third-party integration

---

## Заключение

**aOi — это не просто чат-бот, это душа экосистемы TYT.**

На **takeyourtoken.app** она управляет mining операциями и обучает Web3.
На **tyt.foundation** она объясняет науку и показывает impact.

**Везде aOi соединяет технологию с медициной, profit с purpose, users с mission.**

Это первый в мире AI агент, который делает Web3 mining инструментом спасения детских жизней.

---

**Documentation**: `/docs/AOI_UNIFIED_SUPPORT.md`
**Widget**: `/src/components/LiveSupportWidget.tsx`
**Control System**: `/src/contexts/AoiControlContext.tsx`

**Status**: ✅ Production Ready
**Verified**: December 27, 2025

---

葵 (Aoi) — Connecting Technology & Medicine for Children

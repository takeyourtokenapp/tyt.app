# aOi Unified Image System

## Единая система изображений для всех приложений TYT

### Концепция
Все приложения экосистемы TYT используют **одну и ту же централизованную базу изображений aOi**, что обеспечивает:
- Визуальную консистентность
- Легкое обновление
- Оптимальную производительность
- Единый источник правды

### Приложения, использующие aOi

1. **takeyourtoken.app** - Mining платформа
2. **tyt.foundation** - Foundation website (будущее)
3. **aOi AI Guide** (bolt.new) - Standalone AI assistant

---

## Централизованный CDN

### Структура CDN

```
https://cdn.takeyourtoken.app/aoi/
├── avatars/
│   ├── aoi-avatar-sm.png      (32x32)   → Header badges
│   ├── aoi-avatar-md.png      (64x64)   → Cards
│   ├── aoi-avatar-lg.png      (128x128) → Profiles
│   └── aoi-avatar-xl.png      (256x256) → Modals
│
├── heroes/
│   ├── aoi-hero-main.png      (600x600)   → Landing hero
│   ├── aoi-hero-welcome.png   (800x800)   → Welcome card
│   └── aoi-hero-presenting.png (800x1000) → Chat widget
│
├── levels/
│   ├── aoi-level-1-beginner.png  → Academy Level 1
│   ├── aoi-level-2-explorer.png  → Academy Level 2
│   ├── aoi-level-3-builder.png   → Academy Level 3
│   └── aoi-level-4-guardian.png  → Academy Level 4
│
├── contexts/
│   ├── aoi-teaching.png       → Academy context
│   ├── aoi-helping.png        → Support context
│   ├── aoi-celebrating.png    → Achievement context
│   └── aoi-thinking.png       → Analysis context
│
└── fallback/
    └── aoi-placeholder.svg    → SVG fallback
```

---

## Интеграция в takeyourtoken.app

### ✅ Обновленные компоненты

#### 1. AoiAvatar
```tsx
import AoiImage from './AoiImage';

<AoiImage
  context="level"
  size="md"
  level={userLevel}
  showFallback={true}
/>
```

#### 2. AoiBadgePill
```tsx
<AoiImage
  context="avatar"
  size="sm"
  level={4}
  className="ring-2 ring-indigo-500/40"
  showFallback={true}
/>
```

#### 3. AoiCompactWidget
```tsx
<AoiImage
  context="avatar"
  size="sm"
  level={4}
  showFallback={true}
/>
```

#### 4. Landing Page Hero
```tsx
<AoiImage
  context="hero"
  size="xl"
  showFallback={true}
  className="hero-aoi-avatar"
/>
```

---

## Интеграция в aOi AI Guide (bolt.new)

### Шаг 1: Установить общую конфигурацию

Создать файл `aoiConfig.ts`:

```typescript
export const AOI_CDN = {
  primary: 'https://cdn.takeyourtoken.app/aoi',
  fallback: 'https://tyt.foundation/assets/aoi',
  timeout: 5000,
  retries: 2,
  enableLocalCache: true,
};

export const AOI_IMAGES = {
  // Avatars
  avatarSm: 'avatars/aoi-avatar-sm.png',
  avatarMd: 'avatars/aoi-avatar-md.png',
  avatarLg: 'avatars/aoi-avatar-lg.png',
  avatarXl: 'avatars/aoi-avatar-xl.png',

  // Heroes
  heroMain: 'heroes/aoi-hero-main.png',
  heroWelcome: 'heroes/aoi-hero-welcome.png',
  heroPresenting: 'heroes/aoi-hero-presenting.png',

  // Levels
  level1Beginner: 'levels/aoi-level-1-beginner.png',
  level2Explorer: 'levels/aoi-level-2-explorer.png',
  level3Builder: 'levels/aoi-level-3-builder.png',
  level4Guardian: 'levels/aoi-level-4-guardian.png',

  // Contexts
  teaching: 'contexts/aoi-teaching.png',
  helping: 'contexts/aoi-helping.png',
  celebrating: 'contexts/aoi-celebrating.png',
  thinking: 'contexts/aoi-thinking.png',
};

export function getAoiImage(imageName: keyof typeof AOI_IMAGES): string {
  return `${AOI_CDN.primary}/${AOI_IMAGES[imageName]}`;
}
```

### Шаг 2: Создать AoiImage компонент

Скопировать компонент из takeyourtoken.app:

```bash
cp src/components/AoiImage.tsx → aoi-guide/src/components/AoiImage.tsx
```

### Шаг 3: Использовать в компонентах

```tsx
// Header
<AoiImage context="avatar" size="sm" />

// Hero section
<AoiImage context="hero" size="lg" />

// Chat widget
<AoiImage context="hero" size="md" />

// Teaching mode
<AoiImage context="teaching" size="lg" />
```

---

## Интеграция в tyt.foundation

### Шаг 1: Shared Components

Создать shared library для всех приложений:

```
@tyt/shared-components/
├── AoiImage.tsx
├── AoiAvatar.tsx
├── AoiBadgePill.tsx
└── aoiConfig.ts
```

### Шаг 2: NPM Package

```bash
npm publish @tyt/shared-components
```

### Шаг 3: Использовать в tyt.foundation

```tsx
import { AoiImage } from '@tyt/shared-components';

// Foundation landing hero
<AoiImage
  context="hero"
  size="xl"
  className="foundation-hero-aoi"
/>

// Foundation chat
<AoiImage
  context="helping"
  size="lg"
/>
```

---

## Контекстные изображения

### Когда использовать какое изображение

#### 1. **Avatar Context** (Header, Badges, Nav)
```tsx
<AoiImage context="avatar" size="sm" />
```
- **Где:** Header, navigation badges, compact widgets
- **Размер:** 32-64px
- **Цель:** Быстрое распознавание

#### 2. **Hero Context** (Landing Pages)
```tsx
<AoiImage context="hero" size="xl" />
```
- **Где:** Landing pages, welcome screens
- **Размер:** 600-800px
- **Цель:** Визуальный impact

#### 3. **Level Context** (Academy)
```tsx
<AoiImage context="level" level={3} size="md" />
```
- **Где:** Academy progress, user profiles
- **Размер:** 128-256px
- **Цель:** Показать эволюцию

#### 4. **Teaching Context** (Education)
```tsx
<AoiImage context="teaching" size="lg" />
```
- **Где:** Academy lessons, tutorials
- **Размер:** 128-256px
- **Цель:** Обучающий контекст

#### 5. **Helping Context** (Support)
```tsx
<AoiImage context="helping" size="lg" />
```
- **Где:** Help pages, support chat
- **Размер:** 128-256px
- **Цель:** Помощь и поддержка

#### 6. **Celebrating Context** (Achievements)
```tsx
<AoiImage context="celebrating" size="md" />
```
- **Где:** Achievement notifications, rewards
- **Размер:** 64-128px
- **Цель:** Празднование успехов

---

## Fallback Strategy

### Приоритет загрузки

```typescript
1. Primary CDN → https://cdn.takeyourtoken.app/aoi/
2. Fallback CDN → https://tyt.foundation/assets/aoi/
3. Sparkles Icon → React component (всегда доступен)
```

### Автоматический fallback

```tsx
<AoiImage
  context="hero"
  size="lg"
  showFallback={true}  // Показать Sparkles если CDN недоступен
/>
```

---

## Преимущества единой системы

### ✅ Для разработчиков
- **Единый источник правды** - обновил в одном месте, работает везде
- **Типобезопасность** - TypeScript проверяет все параметры
- **Легкая интеграция** - просто импортировать компонент
- **Автоматический fallback** - нет проблем с недоступностью CDN

### ✅ Для дизайнеров
- **Визуальная консистентность** - одинаковый aOi везде
- **Легкое обновление** - загрузил новые изображения, все обновилось
- **Контекстность** - правильное изображение для каждой ситуации

### ✅ Для пользователей
- **Быстрая загрузка** - CDN кэширование
- **Узнаваемость** - один и тот же персонаж везде
- **Надежность** - всегда видят aOi, даже при проблемах с CDN

---

## Roadmap

### Phase 1: Текущая реализация ✅
- [x] Создана CDN структура
- [x] Создан AoiImage компонент
- [x] Обновлены все компоненты в takeyourtoken.app
- [x] Документация

### Phase 2: Создание изображений 🎨
- [ ] Создать изображения aOi в разных размерах
- [ ] Создать level variations (1-4)
- [ ] Создать context variations (teaching, helping, etc)
- [ ] Оптимизировать для web (WebP, AVIF)

### Phase 3: CDN Setup 🚀
- [ ] Настроить CDN endpoint
- [ ] Загрузить изображения
- [ ] Настроить кэширование
- [ ] Тестирование fallback

### Phase 4: Интеграция в другие приложения 🔗
- [ ] Интегрировать в aOi AI Guide (bolt.new)
- [ ] Интегрировать в tyt.foundation
- [ ] Создать @tyt/shared-components package
- [ ] Документация для каждого приложения

### Phase 5: Оптимизация ⚡
- [ ] Preload критичных изображений
- [ ] Service Worker для офлайн
- [ ] Responsive images (srcset)
- [ ] Lazy loading

---

## Требования к изображениям aOi

### Технические требования

#### Avatars
- **Размеры:** 32x32, 64x64, 128x128, 256x256
- **Формат:** PNG с прозрачностью
- **Оптимизация:** WebP + AVIF + PNG fallback
- **Круглая форма:** Изображение должно хорошо смотреться в круге

#### Heroes
- **Размеры:** 600x600, 800x800, 800x1000
- **Формат:** PNG с прозрачностью
- **Оптимизация:** WebP + AVIF + PNG fallback
- **Композиция:** Full body или 3/4 body

#### Levels (4 вариации)
- **Размеры:** 128x128, 256x256
- **Формат:** PNG с прозрачностью
- **Различия:** Визуальная эволюция от Level 1 до Level 4
- **Стиль:** Consistent across all levels

#### Contexts (4 вариации)
- **Размеры:** 128x128, 256x256
- **Формат:** PNG с прозрачностью
- **Эмоции:** Teaching (focused), Helping (caring), Celebrating (joyful), Thinking (analytical)

---

## Как получить доступ к проекту aOi AI Guide

Чтобы интегрировать единую систему изображений в проект aOi AI Guide на bolt.new, нужен:

1. **Доступ к проекту** в bolt.new
2. **Анализ текущей структуры** компонентов
3. **Миграция на AoiImage** компонент
4. **Тестирование** интеграции

### Инструкции для интеграции

После получения доступа к проекту aOi AI Guide:

```bash
# 1. Скопировать конфиг и компонент
cp takeyourtoken.app/src/config/aoiConfig.ts → aoi-guide/src/config/
cp takeyourtoken.app/src/components/AoiImage.tsx → aoi-guide/src/components/

# 2. Обновить все компоненты, использующие aOi
# Заменить gradient + Sparkles на:
<AoiImage context="avatar" size="sm" />

# 3. Тестирование
npm run build
npm run dev
```

---

**Статус:** ✅ Готово к интеграции в takeyourtoken.app
**Требуется:**
1. Изображения aOi (см. технические требования)
2. CDN setup
3. Доступ к проекту aOi AI Guide для интеграции

# TYT Design System - Complete Guide

## Проблема и решение

### Проблема
Сайт имел серьезные проблемы с читаемостью:
- Серые блоки на сером фоне
- Темные градиенты работали только в темной теме
- Текст не виден в светлой теме
- Отсутствие единой визуальной системы
- Плохой контраст цветов

### Решение
Создана полноценная дизайн-система с готовыми компонентами, которые:
- ✅ Работают в светлой и темной темах
- ✅ Имеют высокий контраст
- ✅ Консистентны по всему сайту
- ✅ Масштабируемы и переиспользуемы
- ✅ Интуитивно понятны

---

## Файлы дизайн-системы

### 1. `/src/styles/design-system.css`
Главный файл со всеми классами компонентов

### 2. `/src/index.css`
Импортирует дизайн-систему

```css
@import './styles/design-system.css';
```

---

## Компоненты дизайн-системы

### 1. КАРТОЧКИ (Cards)

#### `.tyt-card`
Базовая карточка с тенью и границей
```jsx
<div className="tyt-card p-6">
  <h3 className="tyt-heading-4 mb-3">Title</h3>
  <p className="tyt-text-secondary">Description</p>
</div>
```

#### `.tyt-card-flat`
Плоская карточка без тени
```jsx
<div className="tyt-card-flat p-4">Content</div>
```

#### `.tyt-card-stats`
Карточка для статистики с градиентом
```jsx
<div className="tyt-card-stats p-6">
  <div className="tyt-stat-value">5,247</div>
  <div className="tyt-stat-label">Active Users</div>
</div>
```

#### `.tyt-card-feature`
Карточка для функций с hover эффектом
```jsx
<div className="tyt-card-feature">
  <div className="tyt-icon-container mb-4">
    <Icon />
  </div>
  <h3 className="tyt-heading-4 mb-3">Feature</h3>
  <p className="tyt-text-secondary">Description</p>
</div>
```

---

### 2. КНОПКИ (Buttons)

#### `.tyt-btn-primary`
Основная кнопка с градиентом
```jsx
<button className="tyt-btn-primary">
  Get Started
</button>
```

#### `.tyt-btn-secondary`
Вторичная кнопка с границей
```jsx
<button className="tyt-btn-secondary">
  Learn More
</button>
```

#### `.tyt-btn-outline`
Прозрачная кнопка с границей
```jsx
<button className="tyt-btn-outline">
  Cancel
</button>
```

#### `.tyt-btn-ghost`
Кнопка без границы
```jsx
<button className="tyt-btn-ghost">
  Skip
</button>
```

---

### 3. ТИПОГРАФИЯ (Typography)

#### Заголовки
```jsx
<h1 className="tyt-heading-1">Main Heading</h1>
<h2 className="tyt-heading-2">Section Heading</h2>
<h3 className="tyt-heading-3">Subsection Heading</h3>
<h4 className="tyt-heading-4">Card Heading</h4>
```

#### Текст
```jsx
<p className="tyt-text-primary">Primary text</p>
<p className="tyt-text-secondary">Secondary text</p>
<p className="tyt-text-tertiary">Tertiary text</p>
<p className="tyt-text-muted">Muted text</p>
```

#### Акценты
```jsx
<span className="tyt-text-accent">Amber accent</span>
<span className="tyt-text-success">Success text</span>
<span className="tyt-text-error">Error text</span>
<span className="tyt-text-warning">Warning text</span>
```

---

### 4. БЕЙДЖИ (Badges)

```jsx
<span className="tyt-badge-primary">Primary</span>
<span className="tyt-badge-success">Success</span>
<span className="tyt-badge-error">Error</span>
<span className="tyt-badge-info">Info</span>
<span className="tyt-badge-neutral">Neutral</span>
```

---

### 5. ФОРМЫ (Inputs)

#### Текстовое поле
```jsx
<input
  type="text"
  className="tyt-input"
  placeholder="Enter text"
/>
```

#### Выпадающий список
```jsx
<select className="tyt-select">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

#### Многострочное поле
```jsx
<textarea
  className="tyt-textarea"
  placeholder="Enter text"
/>
```

---

### 6. СЕКЦИИ (Sections)

#### Обычная секция
```jsx
<section className="tyt-section">
  <div className="tyt-container">
    Content
  </div>
</section>
```

#### Альтернативная секция (серый фон)
```jsx
<section className="tyt-section-alt">
  <div className="tyt-container">
    Content
  </div>
</section>
```

#### Секция с градиентом
```jsx
<section className="tyt-section-feature">
  <div className="tyt-container">
    Content
  </div>
</section>
```

---

### 7. КОНТЕЙНЕРЫ (Containers)

```jsx
<div className="tyt-container">Normal width (1280px)</div>
<div className="tyt-container-narrow">Narrow (1024px)</div>
<div className="tyt-container-wide">Wide (1400px)</div>
```

---

### 8. ПАНЕЛИ (Panels)

```jsx
<div className="tyt-panel">
  <div className="tyt-panel-header">
    <h3 className="tyt-heading-4">Panel Title</h3>
  </div>
  <div className="tyt-panel-body">
    Panel content
  </div>
  <div className="tyt-panel-footer">
    Panel footer
  </div>
</div>
```

---

### 9. АЛЕРТЫ (Alerts)

```jsx
<div className="tyt-alert-info">Information alert</div>
<div className="tyt-alert-success">Success alert</div>
<div className="tyt-alert-warning">Warning alert</div>
<div className="tyt-alert-error">Error alert</div>
```

---

### 10. ТАБЛИЦЫ (Tables)

```jsx
<table className="tyt-table">
  <thead>
    <tr>
      <th>Header 1</th>
      <th>Header 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data 1</td>
      <td>Data 2</td>
    </tr>
  </tbody>
</table>
```

---

### 11. СТАТИСТИКА (Stats Display)

```jsx
<div className="tyt-stat-card">
  <div className="tyt-stat-value">5,247</div>
  <div className="tyt-stat-label">Active Users</div>
  <div className="tyt-stat-change-positive">+12.5%</div>
</div>
```

---

### 12. ИКОНКИ (Icon Containers)

```jsx
<div className="tyt-icon-container">
  <Icon size={24} />
</div>

<div className="tyt-icon-container-sm">
  <Icon size={20} />
</div>

<div className="tyt-icon-container-lg">
  <Icon size={32} />
</div>
```

---

### 13. РАЗДЕЛИТЕЛИ (Dividers)

```jsx
<div className="tyt-divider"></div>
<div className="tyt-divider-thick"></div>
```

---

### 14. КРИПТОВАЛЮТЫ (Crypto Ticker)

```jsx
<div className="tyt-crypto-item">
  <div className="tyt-crypto-icon">₿</div>
  <span>BTC</span>
  <span className="tyt-price-positive">$87,513</span>
</div>
```

---

### 15. СОСТОЯНИЯ ЗАГРУЗКИ (Loading States)

```jsx
<div className="tyt-skeleton h-4 w-32"></div>
<div className="tyt-spinner w-8 h-8"></div>
```

---

### 16. ГРАДИЕНТЫ (Gradients)

```jsx
<div className="tyt-gradient-primary">Primary gradient</div>
<div className="tyt-gradient-secondary">Secondary gradient</div>
<div className="tyt-gradient-success">Success gradient</div>
```

---

## Цветовая палитра

### Светлая тема (Light Mode)
```
Фон:
- bg-white → #FFFFFF (основной фон)
- bg-gray-50 → #F9FAFB (вторичный фон)
- bg-gray-100 → #F3F4F6 (третичный фон)

Текст:
- text-gray-900 → #111827 (основной текст)
- text-gray-600 → #4B5563 (вторичный текст)
- text-gray-500 → #6B7280 (третичный текст)

Границы:
- border-gray-200 → #E5E7EB (основные границы)
- border-gray-300 → #D1D5DB (вторичные границы)

Акценты:
- amber-500 → #F59E0B (янтарный)
- orange-500 → #F97316 (оранжевый)
```

### Темная тема (Dark Mode)
```
Фон:
- bg-gray-900 → #111827 (основной фон)
- bg-gray-800 → #1F2937 (вторичный фон)
- bg-gray-950 → #0F172A (третичный фон)

Текст:
- text-white → #FFFFFF (основной текст)
- text-gray-300 → #D1D5DB (вторичный текст)
- text-gray-400 → #9CA3AF (третичный текст)

Границы:
- border-gray-800 → #1F2937 (основные границы)
- border-gray-700 → #374151 (вторичные границы)

Акценты:
- amber-400 → #FBBF24 (янтарный)
- orange-400 → #FB923C (оранжевый)
```

---

## Обновленные компоненты

### 1. Landing.tsx
- Все секции используют `tyt-section` и `tyt-section-alt`
- Карточки используют `tyt-card` классы
- Текст использует `tyt-text-*` классы
- Кнопки используют `tyt-btn-*` классы

### 2. StatisticsCard.tsx
- Использует `tyt-card-stats`
- Правильные цвета для обеих тем
- Высокий контраст текста

### 3. Header.tsx (уже обновлен ранее)
- Белый фон в светлой теме
- Темный фон в темной теме

### 4. Footer.tsx (уже обновлен ранее)
- Серый фон в светлой теме
- Темный фон в темной теме

---

## Принципы использования

### 1. Всегда используйте готовые классы
❌ **Неправильно:**
```jsx
<div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
```

✅ **Правильно:**
```jsx
<div className="tyt-card p-6">
```

### 2. Используйте семантические классы для текста
❌ **Неправильно:**
```jsx
<p className="text-gray-400">Text</p>
```

✅ **Правильно:**
```jsx
<p className="tyt-text-secondary">Text</p>
```

### 3. Используйте тематические контейнеры
❌ **Неправильно:**
```jsx
<div className="max-w-7xl mx-auto px-4">
```

✅ **Правильно:**
```jsx
<div className="tyt-container">
```

### 4. Используйте готовые секции
❌ **Неправильно:**
```jsx
<section className="py-20 bg-gray-900/50">
```

✅ **Правильно:**
```jsx
<section className="tyt-section-alt">
```

---

## Миграция существующих компонентов

### Шаг 1: Найти темные градиенты
```bash
grep -r "from-gray-800 to-gray-900" src/
```

### Шаг 2: Заменить на `tyt-card`
```jsx
// Было:
<div className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6">

// Стало:
<div className="tyt-card p-6">
```

### Шаг 3: Обновить текст
```jsx
// Было:
<h3 className="text-xl font-bold">Title</h3>
<p className="text-gray-400">Description</p>

// Стало:
<h3 className="tyt-heading-4">Title</h3>
<p className="tyt-text-secondary">Description</p>
```

### Шаг 4: Обновить секции
```jsx
// Было:
<section className="py-20 bg-gray-900/50">
  <div className="max-w-7xl mx-auto px-4">

// Стало:
<section className="tyt-section-alt">
  <div className="tyt-container">
```

---

## Проверка работы

### В светлой теме:
1. Все карточки имеют белый фон ✅
2. Весь текст черный и читаемый ✅
3. Границы серые и видимые ✅
4. Иконки цветные и видимые ✅

### В темной теме:
1. Все карточки имеют темный фон ✅
2. Весь текст белый и читаемый ✅
3. Границы темно-серые и видимые ✅
4. Иконки цветные и видимые ✅

---

## FAQ

**Q: Почему не использовать `bg-gray-800`?**
A: Потому что он не адаптируется к светлой теме. Используйте `tyt-card`.

**Q: Можно ли комбинировать классы дизайн-системы с обычными Tailwind?**
A: Да, но старайтесь использовать готовые классы где возможно.

**Q: Что делать если нужен кастомный компонент?**
A: Добавьте новый класс в `design-system.css` следуя существующим паттернам.

**Q: Как добавить новый цвет?**
A: Создайте новые классы с суффиксами для светлой и темной темы:
```css
.tyt-badge-custom {
  @apply bg-cyan-100 dark:bg-cyan-900/30;
  @apply text-cyan-700 dark:text-cyan-400;
  @apply border border-cyan-300 dark:border-cyan-700;
}
```

---

## Итог

✅ **Создана полноценная дизайн-система**
✅ **Все компоненты работают в обеих темах**
✅ **Высокий контраст и читаемость**
✅ **Легко масштабировать и поддерживать**
✅ **Консистентный дизайн**

Теперь весь сайт использует единую визуальную систему, которая гармонично отображается как в светлой, так и в темной теме!

---

*Документ создан: 28 декабря 2025*
*Дизайн-система готова к production*

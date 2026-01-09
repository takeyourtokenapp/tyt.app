# Theme Migration Guide

## Quick Reference

Замените жестко закодированные цвета на theme-aware классы:

### Backgrounds
```
bg-gray-900  → bg-primary
bg-gray-800  → bg-secondary
bg-gray-700  → bg-tertiary
```

### Text Colors
```
text-gray-200 → text-primary-text
text-gray-300 → text-secondary-text
text-gray-400 → text-tertiary-text
text-gray-500 → text-tertiary-text
text-white    → text-primary-text (или оставить для абсолютно белого)
```

### Borders
```
border-gray-700 → border-secondary
border-gray-600 → border-secondary
```

### Gradients
```
from-gray-900 → from-primary
to-gray-900   → to-primary
from-gray-800 → from-secondary
to-gray-800   → to-secondary
```

### Color Accents (с поддержкой light/dark)
```
text-green-400 → text-green-500 dark:text-green-400
text-blue-400  → text-blue-500 dark:text-blue-400
text-red-400   → text-red-500 dark:text-red-400
```

## Автоматическая замена (sed)

```bash
# Backgrounds
sed -i 's/bg-gray-900\([^/]\)/bg-primary\1/g' yourfile.tsx
sed -i 's/bg-gray-800\([^/]\)/bg-secondary\1/g' yourfile.tsx
sed -i 's/bg-gray-700\([^/]\)/bg-tertiary\1/g' yourfile.tsx

# Text
sed -i 's/text-gray-400\([^/]\)/text-tertiary-text\1/g' yourfile.tsx
sed -i 's/text-gray-300\([^/]\)/text-secondary-text\1/g' yourfile.tsx

# Borders
sed -i 's/border-gray-700\([^/]\)/border-secondary\1/g' yourfile.tsx
```

## Оставшиеся файлы для миграции (90+)

См. grep результаты выше. Приоритет:
1. ✅ MiningStatsDashboard - DONE
2. NetworkStatsWidget
3. MinerPerformanceWidget
4. RewardsSummaryWidget
5. Wallet components
6. Admin pages
7. App pages
8. Остальные компоненты

## Проверка

После миграции запустите:
```bash
npm run build
# Проверьте темную и светлую темы
```

# 🌍 TYT Platform - Multilingual System

**Supported Languages:** English, Русский, עברית
**Auto-Detection:** Geolocation + Browser Settings
**RTL Support:** Full Hebrew (עברית) support

---

## 🎯 Overview

TYT Platform is fully multilingual with automatic language detection based on user's geographic location and browser settings.

### Supported Languages

| Language | Code | Flag | Direction | Status |
|----------|------|------|-----------|--------|
| English | `en` | 🇬🇧 | LTR | ✅ Complete |
| Русский | `ru` | 🇷🇺 | LTR | ✅ Complete |
| עברית | `he` | 🇮🇱 | RTL | ✅ Complete |

---

## 🚀 How It Works

### 1. Automatic Detection

The system automatically detects user's language using:

**Priority Order:**
1. **Stored Preference** - Previously selected language (localStorage)
2. **Geolocation** - IP-based country detection
3. **Browser Settings** - `navigator.language`
4. **Default** - Falls back to English

**Geographic Mapping:**
```typescript
Russia (RU) → Russian (ru)
Israel (IL) → Hebrew (he)
USA, UK, etc. → English (en)
```

### 2. Language Storage

Selected language is stored in:
```javascript
localStorage.setItem('tyt_language', 'ru');
```

This ensures the user's choice persists across sessions.

### 3. RTL Support

Hebrew (`he`) automatically:
- Sets `dir="rtl"` on `<html>`
- Adds `.rtl` class to `<body>`
- Flips layout direction
- Mirrors icons where appropriate

---

## 📝 Using Translations in Code

### Basic Usage

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t('common:app.name')}</h1>
      <p>{t('common:app.tagline')}</p>
      <button>{t('common:common.save')}</button>
    </div>
  );
}
```

### With Variables

```typescript
const { t } = useTranslation();

// Translation file: "welcome": "Welcome, {{name}}!"
<p>{t('common:welcome', { name: 'John' })}</p>
```

### Namespaces

Currently, we use a single namespace `common` for all translations:

```typescript
t('common:nav.home')        // Navigation
t('common:wallet.balance')  // Wallet
t('common:mining.title')    // Mining
t('common:errors.required') // Errors
```

---

## 🎨 Language Selector Component

The `LanguageSelector` component is automatically added to the Header.

**Features:**
- Dropdown menu with flags
- Shows native language names
- Current language indicator
- Smooth transitions

**Location:**
```
src/components/LanguageSelector.tsx
```

**Usage:**
```tsx
import LanguageSelector from './components/LanguageSelector';

<LanguageSelector />
```

---

## 🔧 Adding New Translations

### Step 1: Add to Translation Files

Add your key to all language files:

**English** (`src/locales/en/common.json`):
```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "This is my new feature"
  }
}
```

**Russian** (`src/locales/ru/common.json`):
```json
{
  "myFeature": {
    "title": "Моя функция",
    "description": "Это моя новая функция"
  }
}
```

**Hebrew** (`src/locales/he/common.json`):
```json
{
  "myFeature": {
    "title": "התכונה שלי",
    "description": "זו התכונה החדשה שלי"
  }
}
```

### Step 2: Use in Component

```typescript
const { t } = useTranslation();

<div>
  <h2>{t('common:myFeature.title')}</h2>
  <p>{t('common:myFeature.description')}</p>
</div>
```

---

## 🎭 RTL (Right-to-Left) Support

### Automatic Behavior

When Hebrew is selected:
- `<html dir="rtl">` is set automatically
- `<body class="rtl">` is added
- CSS automatically flips layout

### RTL-Specific Styles

Use custom RTL utilities:

```css
/* These are automatically applied */
[dir="rtl"] {
  direction: rtl;
}

[dir="rtl"] .rtl\:mirror {
  transform: scaleX(-1); /* Flip icons */
}

[dir="rtl"] .rtl\:text-right {
  text-align: right;
}
```

### Tailwind with RTL

```tsx
<div className="text-left rtl:text-right">
  This text aligns correctly in both directions
</div>
```

---

## 🌐 Geolocation API

We use **ipapi.co** for geolocation:

```typescript
const response = await fetch('https://ipapi.co/json/');
const data = await response.json();
const countryCode = data.countryCode; // "RU", "IL", "US", etc.
```

**Country to Language Mapping:**
```typescript
{
  'RU': 'ru',  // Russia → Russian
  'BY': 'ru',  // Belarus → Russian
  'KZ': 'ru',  // Kazakhstan → Russian
  'IL': 'he',  // Israel → Hebrew
  'US': 'en',  // USA → English
  'GB': 'en',  // UK → English
  // ... etc
}
```

**Fallback:** If geolocation fails or country not mapped, falls back to browser language detection.

---

## 🔄 Language Context

Access language state anywhere:

```typescript
import { useLanguage } from '../contexts/LanguageContext';

function MyComponent() {
  const {
    currentLanguage,    // 'en' | 'ru' | 'he'
    changeLanguage,     // Function to change language
    isRTL,              // true for Hebrew
    supportedLanguages, // All language configs
    isLoading           // Loading state
  } = useLanguage();

  return (
    <div>
      <p>Current: {currentLanguage}</p>
      <button onClick={() => changeLanguage('ru')}>
        Switch to Russian
      </button>
    </div>
  );
}
```

---

## 📂 File Structure

```
src/
├── i18n/
│   └── config.ts                    # i18n configuration
├── locales/
│   ├── en/
│   │   └── common.json              # English translations
│   ├── ru/
│   │   └── common.json              # Russian translations
│   └── he/
│       └── common.json              # Hebrew translations
├── contexts/
│   └── LanguageContext.tsx          # Language state management
├── components/
│   └── LanguageSelector.tsx         # Language switcher UI
└── utils/
    └── languageDetector.ts          # Detection logic
```

---

## 🧪 Testing

### Test Language Detection

```typescript
import { detectLanguageFromGeolocation } from './utils/languageDetector';

// Simulated tests
const lang = await detectLanguageFromGeolocation();
console.log('Detected:', lang); // 'en', 'ru', or 'he'
```

### Test Translations

```typescript
import { useTranslation } from 'react-i18next';

function TestComponent() {
  const { t, i18n } = useTranslation();

  const testLanguages = async () => {
    await i18n.changeLanguage('en');
    console.log('EN:', t('common:app.name'));

    await i18n.changeLanguage('ru');
    console.log('RU:', t('common:app.name'));

    await i18n.changeLanguage('he');
    console.log('HE:', t('common:app.name'));
  };

  return <button onClick={testLanguages}>Test Languages</button>;
}
```

### Manual Language Switch

Open browser console:
```javascript
// Change language manually
import i18n from './i18n/config';
i18n.changeLanguage('ru');
i18n.changeLanguage('he');
i18n.changeLanguage('en');
```

---

## ⚡ Performance

### Lazy Loading

Currently, all translations are bundled. For future optimization:

```typescript
// Future implementation
i18n.use(Backend).init({
  backend: {
    loadPath: '/locales/{{lng}}/{{ns}}.json'
  }
});
```

### Bundle Size

Current sizes:
- `en/common.json`: ~2 KB
- `ru/common.json`: ~2.5 KB
- `he/common.json`: ~2.5 KB
- **Total**: ~7 KB (gzipped: ~2 KB)

---

## 🐛 Troubleshooting

### Language Not Changing

**Check:**
1. Is `LanguageProvider` wrapping your app?
2. Is `i18n/config` imported in `main.tsx`?
3. Clear localStorage: `localStorage.removeItem('tyt_language')`

### Translations Missing

**Check:**
1. Key exists in all language files
2. Namespace is correct: `t('common:key')`
3. File is valid JSON (no trailing commas)

### RTL Not Working

**Check:**
1. Hebrew language selected
2. `dir="rtl"` on `<html>` element
3. CSS file includes RTL utilities

### Geolocation Failed

**Check:**
1. Network connection
2. API limit (ipapi.co: 1000 requests/day free)
3. Fallback to browser language works

---

## 🔮 Future Enhancements

### Planned Features

1. **More Languages**
   - Spanish (es)
   - German (de)
   - French (fr)
   - Chinese (zh)

2. **Advanced Detection**
   - User timezone
   - Browser locale preferences
   - Machine learning language suggestions

3. **Translation Management**
   - Admin panel for translations
   - Crowdsourced translations
   - Professional translation integration

4. **SEO**
   - `/en/`, `/ru/`, `/he/` URL prefixes
   - `hreflang` tags
   - Localized sitemaps

---

## 📚 Resources

### Libraries Used

- **i18next**: Core i18n framework
- **react-i18next**: React bindings
- **i18next-browser-languagedetector**: Auto-detection

### Documentation

- [i18next Docs](https://www.i18next.com/)
- [react-i18next Docs](https://react.i18next.com/)
- [RTL Guide](https://rtlstyling.com/)

### APIs

- [ipapi.co](https://ipapi.co/) - Geolocation (free tier: 1000 req/day)

---

## 🤝 Contributing Translations

Want to add or improve translations?

1. Find the language files in `src/locales/`
2. Add/edit translations
3. Test in UI
4. Submit PR

**Translation Guidelines:**
- Keep tone professional but friendly
- Maintain consistency with existing translations
- Consider context (UI vs docs vs errors)
- For Hebrew: Use modern, inclusive language

---

## ✅ Checklist for Developers

When adding new features:

- [ ] Add English translations to `src/locales/en/common.json`
- [ ] Add Russian translations to `src/locales/ru/common.json`
- [ ] Add Hebrew translations to `src/locales/he/common.json`
- [ ] Use `t()` function instead of hardcoded strings
- [ ] Test with all 3 languages
- [ ] Check RTL layout for Hebrew
- [ ] Verify text fits in UI (Russian text often longer)

---

**Last Updated:** December 26, 2024
**Status:** ✅ Fully Operational
**Maintained by:** TYT Development Team

**Questions?** See `SECURITY.md` for contact information.

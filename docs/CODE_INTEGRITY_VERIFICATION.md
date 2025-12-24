# Code Integrity Verification Guide

## Защита от вредоносного кода и проверка целостности проекта

---

## Table of Contents

1. [Автоматическая проверка безопасности](#автоматическая-проверка-безопасности)
2. [Ручная проверка кода](#ручная-проверка-кода)
3. [Проверка зависимостей](#проверка-зависимостей)
4. [Git Hooks для защиты](#git-hooks-для-защиты)
5. [CI/CD Security Checks](#cicd-security-checks)
6. [Защита от компрометации](#защита-от-компрометации)

---

## 1. Автоматическая проверка безопасности

### npm audit

Проверка уязвимостей в зависимостях:

```bash
# Проверить уязвимости
npm audit

# Автоматически исправить (только patch и minor)
npm audit fix

# Исправить все (включая breaking changes)
npm audit fix --force

# Получить отчет в JSON
npm audit --json > security-audit.json
```

### Detect-secrets

Поиск случайно закоммиченных секретов:

```bash
# Установка
pip install detect-secrets

# Создание baseline
detect-secrets scan > .secrets.baseline

# Проверка новых файлов
detect-secrets scan --baseline .secrets.baseline

# Аудит найденных секретов
detect-secrets audit .secrets.baseline
```

### ESLint Security Plugin

```bash
# Установка
npm install --save-dev eslint-plugin-security

# Добавить в eslint.config.js
import security from 'eslint-plugin-security';

export default [
  {
    plugins: {
      security
    },
    rules: {
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-regexp': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-no-csrf-before-method-override': 'error',
      'security/detect-possible-timing-attacks': 'error'
    }
  }
];

# Запустить проверку
npm run lint
```

---

## 2. Ручная проверка кода

### Опасные паттерны для поиска

#### 1. XSS Vulnerabilities

```bash
# Поиск dangerouslySetInnerHTML без DOMPurify
grep -r "dangerouslySetInnerHTML" src/ --exclude-dir=node_modules

# Должны найти только с DOMPurify.sanitize()
```

#### 2. SQL Injection

```bash
# Поиск прямых SQL запросов
grep -rE "(sql\`|SELECT.*FROM|INSERT INTO|UPDATE.*SET|DELETE FROM)" src/ --exclude-dir=node_modules

# В проекте не должно быть - используем Supabase client
```

#### 3. Eval и Function()

```bash
# Поиск опасных функций
grep -rE "(eval\(|Function\(|setTimeout\(.*string|setInterval\(.*string)" src/ --exclude-dir=node_modules

# Не должно быть найдено
```

#### 4. Внешние CDN

```bash
# Поиск внешних ресурсов
grep -rE "https?://[^\"']*\.(js|css)" public/ src/

# Проверить что все ресурсы легитимны
```

#### 5. Хардкоженные секреты

```bash
# Поиск API ключей
grep -rE "(api[_-]?key|apikey|secret|password|token).*=.*['\"][a-zA-Z0-9]{20,}" src/ --exclude-dir=node_modules

# Поиск приватных ключей
grep -rE "(private[_-]?key|privateKey).*['\"][0-9a-fA-F]{64}" src/

# Не должно быть найдено
```

---

## 3. Проверка зависимостей

### Package.json Audit

Проверьте каждую зависимость:

```bash
# Показать дерево зависимостей
npm list --all

# Проверить устаревшие пакеты
npm outdated

# Проверить лицензии
npx license-checker --summary
```

### Подозрительные зависимости

⚠️ **Красные флаги**:
- Недавно созданные пакеты (<6 месяцев)
- Малое количество загрузок (<1000/неделю)
- Нет GitHub репозитория
- Последнее обновление >2 лет назад
- Много зависимостей для простой задачи
- Странные имена (опечатки популярных пакетов)

✅ **Текущие зависимости проверены**:
- @supabase/supabase-js - Official Supabase client
- react, react-dom - Official React
- vite - Official Vite
- lucide-react - Popular icon library
- dompurify - Security sanitization
- framer-motion - Animation library
- wagmi, viem - Web3 libraries
- All dependencies have >100k weekly downloads

### Проверка integrity

```bash
# Проверить целостность package-lock.json
npm ci

# Если не прошло - кто-то изменил зависимости
# Восстановить из git:
git checkout package-lock.json
npm ci
```

---

## 4. Git Hooks для защиты

### Pre-commit Hook

Создайте `.git/hooks/pre-commit`:

```bash
#!/bin/bash

echo "🔍 Running security checks..."

# 1. Проверка секретов
if command -v detect-secrets &> /dev/null; then
  echo "Checking for secrets..."
  detect-secrets scan --baseline .secrets.baseline
  if [ $? -ne 0 ]; then
    echo "❌ Secrets detected! Commit blocked."
    exit 1
  fi
fi

# 2. Проверка .env файла
if git diff --cached --name-only | grep -q "^\.env$"; then
  echo "❌ Attempting to commit .env file! Commit blocked."
  exit 1
fi

# 3. Проверка приватных ключей
if git diff --cached --name-only | grep -qE "\.(key|pem|p12)$"; then
  echo "❌ Attempting to commit private key! Commit blocked."
  exit 1
fi

# 4. ESLint проверка
echo "Running ESLint..."
npm run lint
if [ $? -ne 0 ]; then
  echo "❌ ESLint failed! Fix errors before committing."
  exit 1
fi

# 5. TypeScript проверка
echo "Running TypeScript check..."
npm run typecheck
if [ $? -ne 0 ]; then
  echo "❌ TypeScript errors found! Fix before committing."
  exit 1
fi

echo "✅ All checks passed!"
exit 0
```

Сделайте исполняемым:
```bash
chmod +x .git/hooks/pre-commit
```

### Pre-push Hook

Создайте `.git/hooks/pre-push`:

```bash
#!/bin/bash

echo "🔍 Running pre-push checks..."

# 1. Запустить тесты
echo "Running tests..."
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Push blocked."
  exit 1
fi

# 2. Проверить build
echo "Testing build..."
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed! Push blocked."
  exit 1
fi

# 3. npm audit
echo "Running npm audit..."
npm audit --audit-level=high
if [ $? -ne 0 ]; then
  echo "⚠️  High severity vulnerabilities found!"
  read -p "Continue push? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    exit 1
  fi
fi

echo "✅ All pre-push checks passed!"
exit 0
```

Сделайте исполняемым:
```bash
chmod +x .git/hooks/pre-push
```

---

## 5. CI/CD Security Checks

### GitHub Actions Workflow

Создайте `.github/workflows/security.yml`:

```yaml
name: Security Checks

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main, develop ]

jobs:
  security:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'

    - name: Install dependencies
      run: npm ci

    - name: Run npm audit
      run: npm audit --audit-level=moderate

    - name: Run ESLint
      run: npm run lint

    - name: TypeScript check
      run: npm run typecheck

    - name: Build check
      run: npm run build

    - name: Detect secrets
      uses: trufflesecurity/trufflehog@main
      with:
        path: ./
        base: ${{ github.event.repository.default_branch }}
        head: HEAD

    - name: OWASP Dependency Check
      uses: dependency-check/Dependency-Check_Action@main
      with:
        project: 'TYT'
        path: '.'
        format: 'HTML'

    - name: Upload Security Report
      uses: actions/upload-artifact@v3
      with:
        name: security-report
        path: reports/
```

---

## 6. Защита от компрометации

### Признаки компрометации

🚨 **Немедленно проверьте проект если**:

1. **Неожиданные изменения в package.json**
   ```bash
   git log -p package.json
   ```

2. **Новые файлы в .gitignore**
   ```bash
   git log -p .gitignore
   ```

3. **Изменения в критических файлах**
   ```bash
   git log -p src/lib/supabase.ts
   git log -p src/lib/auth.ts
   git log -p .env.example
   ```

4. **Необычные network запросы**
   - Проверить Network tab в DevTools
   - Искать запросы к неизвестным доменам

5. **Странное поведение build процесса**
   ```bash
   npm run build --verbose
   ```

### Действия при подозрении на компрометацию

#### 1. Немедленная изоляция

```bash
# Отключить сетевое соединение
# Остановить все запущенные процессы Node.js
killall node

# Создать backup текущего состояния
tar -czf backup-$(date +%Y%m%d-%H%M%S).tar.gz .
```

#### 2. Анализ изменений

```bash
# Сравнить с последним чистым коммитом
git diff HEAD~1

# Проверить последние коммиты
git log --oneline -20

# Найти кто и когда изменил файлы
git log --all --full-history -- path/to/suspicious/file
```

#### 3. Полная перепроверка

```bash
# Удалить node_modules
rm -rf node_modules package-lock.json

# Чистая установка
npm install

# Проверить integrity
npm ci
```

#### 4. Откат к безопасному состоянию

```bash
# Если нашли вредоносный коммит
git revert <malicious-commit-hash>

# Или жесткий откат (ВНИМАНИЕ: удалит все изменения)
git reset --hard <last-good-commit>

# Force push (только если уверены)
git push --force
```

#### 5. Смена всех секретов

```bash
# 1. Supabase
# - Создать новый проект или reset API keys
# - Обновить .env

# 2. Alchemy
# - Создать новый API key
# - Обновить VITE_ALCHEMY_API_KEY

# 3. GitHub
# - Rotate все secrets в Settings > Secrets

# 4. Deploy keys
# - Regenerate SSH keys
# - Update deployment pipelines
```

---

## Регулярные проверки

### Ежедневно

```bash
# Быстрая проверка
npm audit
git status
git log -5
```

### Еженедельно

```bash
# Полная проверка
npm audit
npm outdated
npm run lint
npm run typecheck
npm run build

# Проверка логов
git log --all --since="1 week ago"
```

### Ежемесячно

```bash
# Обновление зависимостей
npm update
npm audit fix

# Проверка на секреты
detect-secrets scan

# Просмотр больших изменений
git log --stat --since="1 month ago"
```

---

## Контрольный список безопасности

### Перед каждым коммитом

- [ ] Запустил `npm run lint`
- [ ] Запустил `npm run typecheck`
- [ ] Проверил что не коммичу .env
- [ ] Проверил что нет хардкоженных секретов
- [ ] Код review собственных изменений
- [ ] Тесты проходят

### Перед каждым push

- [ ] `npm run build` успешно
- [ ] `npm audit` не показывает critical/high
- [ ] Все тесты зеленые
- [ ] Проверил diff с remote
- [ ] Обновил документацию если нужно

### Перед каждым релизом

- [ ] Полный security audit
- [ ] Обновлены все зависимости
- [ ] Проверены все environment variables
- [ ] RLS policies протестированы
- [ ] Smart contracts audited (if changed)
- [ ] Backup database создан
- [ ] Rollback plan готов

---

## Инструменты

### Рекомендованные расширения VS Code

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next",
    "streetsidesoftware.code-spell-checker",
    "oderwat.indent-rainbow",
    "eamodio.gitlens"
  ]
}
```

### CLI инструменты

```bash
# Установить глобально
npm install -g npm-check-updates
npm install -g depcheck
npm install -g license-checker

# Использование
ncu                    # Проверить обновления
depcheck               # Найти неиспользуемые зависимости
license-checker        # Проверить лицензии
```

---

## Контакты для сообщения о проблемах

### Нашли уязвимость?

**Email**: security@takeyourtoken.com

**НЕ создавайте публичные GitHub issues!**

### Нашли подозрительный код?

1. Не запускайте его
2. Сообщите команде безопасности
3. Создайте backup
4. Изолируйте систему

---

**Последнее обновление**: 24 декабря 2024
**Версия**: 1.0
**Статус**: Активно

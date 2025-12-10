# 🍎 Полная Синхронизация: Bolt.new → Mac → GitHub

**Дата:** 2025-12-10
**Цель:** Скачать архив → Заменить файлы на Mac → Push на GitHub

---

## 📦 ШАГ 1: Скачать Архив из Bolt.new

1. В интерфейсе Bolt.new найдите кнопку **"Download Project"** или **"Export"**
2. Скачайте полный архив проекта (ZIP)
3. Сохраните как `tyt-app-latest.zip` в папку `~/Downloads/`

---

## 🗂️ ШАГ 2: Подготовка на Mac

### 2.1 Откройте Terminal (Терминал)

```bash
# Перейдите в домашнюю директорию
cd ~

# Проверьте что репозиторий существует
ls -la tyt.app
```

### 2.2 Создайте Backup (на всякий случай)

```bash
# Создайте резервную копию текущего состояния
cp -r ~/tyt.app ~/tyt.app.backup.$(date +%Y%m%d_%H%M%S)

# Проверьте что backup создан
ls -la | grep tyt.app.backup
```

### 2.3 Распакуйте Архив

```bash
# Перейдите в Downloads
cd ~/Downloads

# Распакуйте архив
unzip tyt-app-latest.zip -d tyt-app-temp

# Проверьте содержимое
ls -la tyt-app-temp/
```

---

## 🔄 ШАГ 3: Замена Файлов

### 3.1 Сохраните Критичные Файлы

```bash
# Сохраните .env (если есть)
cp ~/tyt.app/.env ~/tyt.app.env.backup 2>/dev/null || echo ".env не найден"

# Сохраните .git директорию
cp -r ~/tyt.app/.git ~/tyt.git.backup 2>/dev/null || echo ".git не найден"
```

### 3.2 Удалите Старые Файлы (кроме .git и .env)

```bash
cd ~/tyt.app

# Удалите всё кроме .git, .env, node_modules
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name '.env' ! -name 'node_modules' -exec rm -rf {} +

# Проверьте что осталось только .git и .env
ls -la
```

### 3.3 Скопируйте Новые Файлы

```bash
# Скопируйте всё из архива в текущую директорию
cp -r ~/Downloads/tyt-app-temp/* ~/tyt.app/

# Скопируйте скрытые файлы (если есть)
cp -r ~/Downloads/tyt-app-temp/.* ~/tyt.app/ 2>/dev/null || true

# Восстановите .env если был
if [ -f ~/tyt.app.env.backup ]; then
    cp ~/tyt.app.env.backup ~/tyt.app/.env
    echo "✅ .env восстановлен"
fi
```

---

## 🔍 ШАГ 4: Проверка Файлов

```bash
cd ~/tyt.app

# Проверьте структуру проекта
ls -la

# Должны видеть:
# - package.json
# - src/
# - supabase/
# - public/
# - .git/
# - .env (если был)
# - все .md файлы
```

### 4.1 Проверьте что .git на месте

```bash
git status

# Если видите ошибку "not a git repository" - восстановите:
cp -r ~/tyt.git.backup ~/tyt.app/.git
```

---

## 📦 ШАГ 5: Установка Зависимостей

```bash
cd ~/tyt.app

# Удалите старые node_modules если есть
rm -rf node_modules package-lock.json

# Установите зависимости заново
npm install

# Проверьте что установилось
ls node_modules | wc -l
# Должно быть ~200+ пакетов
```

---

## ✅ ШАГ 6: Проверка Build

```bash
# Запустите build для проверки
npm run build

# Должны увидеть:
# ✓ built in X.XXs
# dist/index.html
# dist/assets/...

# Если есть ошибки - НЕ ПРОДОЛЖАЙТЕ, сообщите об ошибках
```

---

## 🔐 ШАГ 7: Проверка Безопасности

### 7.1 Проверьте .gitignore

```bash
cat .gitignore | grep -E "\.env|node_modules|dist"

# Должны видеть:
# .env
# .env.*
# node_modules
# dist
```

### 7.2 Проверьте что .env НЕ будет добавлен

```bash
git status | grep ".env"

# Не должно быть вывода!
# Если .env появился в списке - СТОП!
```

### 7.3 Проверьте что нет секретов в коде

```bash
# Поиск потенциальных секретов
grep -r "SUPABASE_SERVICE_ROLE_KEY" src/ || echo "✅ Секретов не найдено"
grep -r "private.*key" src/ || echo "✅ Приватных ключей не найдено"
```

---

## 🚀 ШАГ 8: Git Commit

### 8.1 Посмотрите что изменилось

```bash
git status

# Вы увидите список:
# - новых файлов (зелёные)
# - изменённых файлов (красные)
# - удалённых файлов (красные)
```

### 8.2 Добавьте Все Изменения

```bash
# Добавьте все файлы
git add .

# Проверьте staged файлы
git status

# КРИТИЧНО: Убедитесь что .env НЕ В СПИСКЕ!
```

### 8.3 Создайте Commit

```bash
git commit -m "feat: Complete project synchronization from bolt.new

✨ Added Features:
- 10 Edge Functions (blockchain operations)
- 7 new database migrations (KYC, multichain, deposits)
- Complete utils/api directory (Bitcoin, Ethereum, Solana, Tron, XRP)
- All missing UI components (AccessGuard, Toast, KYCStatus, etc)
- All app pages (Academy, Foundation, Marketplace, Miners, Wallet, etc)
- Multi-chain Web3 contexts and hooks
- Public assets (favicon, robots.txt, .htaccess)

🔧 Improvements:
- Updated blockchain providers configuration
- Added custodial wallet system
- Implemented real blockchain integration
- Added income calculator component
- Enhanced access control system

📦 Database:
- Extended migrations to 15 total
- Added multichain swap/staking system
- Implemented KYC and access levels v3

✅ Verified:
- Build successful (606KB bundle)
- No TypeScript errors
- All dependencies installed
- Security check passed

Project now 100% synchronized with development environment.
Ready for production deployment to Hostinger."
```

---

## 🌐 ШАГ 9: Push на GitHub

### 9.1 Проверьте Remote

```bash
git remote -v

# Должны видеть:
# origin  https://github.com/takeyourtokenapp/tyt.app.git (fetch)
# origin  https://github.com/takeyourtokenapp/tyt.app.git (push)
```

### 9.2 Pull для Синхронизации

```bash
# Получите последние изменения с GitHub
git pull origin main --rebase

# Если конфликты - разрешите их
# Обычно можно принять свои изменения:
# git checkout --ours <файл>
```

### 9.3 Push Изменений

```bash
# Загрузите изменения на GitHub
git push origin main

# Если требуется форсированный push (ОСТОРОЖНО!):
# git push origin main --force-with-lease
```

---

## ✅ ШАГ 10: Проверка на GitHub

1. Откройте https://github.com/takeyourtokenapp/tyt.app
2. Проверьте что:
   - ✅ Commit появился в истории
   - ✅ Все новые файлы видны
   - ✅ Edge Functions в `supabase/functions/`
   - ✅ Все миграции в `supabase/migrations/`
   - ✅ Полная структура `src/`
   - ✅ `.env` НЕ ВИДЕН (критично!)

---

## 🧹 ШАГ 11: Очистка

```bash
# Удалите временные файлы
rm -rf ~/Downloads/tyt-app-temp
rm ~/Downloads/tyt-app-latest.zip
rm ~/tyt.app.env.backup
rm -rf ~/tyt.git.backup

# Опционально: удалите старый backup проекта через несколько дней
# rm -rf ~/tyt.app.backup.*
```

---

## 📊 Чеклист Финальной Проверки

- [ ] Архив скачан из bolt.new
- [ ] Backup создан
- [ ] Файлы заменены
- [ ] .git директория сохранена
- [ ] .env восстановлен (если был)
- [ ] npm install выполнен успешно
- [ ] npm run build прошёл без ошибок
- [ ] .env НЕ в git status
- [ ] Commit создан с детальным описанием
- [ ] git push выполнен успешно
- [ ] GitHub обновлён корректно
- [ ] .env не виден на GitHub
- [ ] Все файлы на месте
- [ ] Временные файлы удалены

---

## 🆘 Troubleshooting

### Проблема: "not a git repository"

```bash
cd ~/tyt.app
git init
git remote add origin https://github.com/takeyourtokenapp/tyt.app.git
git fetch origin
git reset --hard origin/main
# Затем повторите с Шага 3
```

### Проблема: Конфликты при git pull

```bash
# Принять свои изменения
git checkout --ours .
git add .
git rebase --continue
```

### Проблема: .env случайно добавлен

```bash
# Удалите из staging
git reset HEAD .env

# Добавьте в .gitignore если нет
echo ".env" >> .gitignore
echo ".env.*" >> .gitignore
git add .gitignore
```

### Проблема: npm install ошибки

```bash
# Очистите кэш
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Проблема: Build ошибки

```bash
# Проверьте версии
node --version  # должна быть 18+
npm --version   # должна быть 9+

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

## 🎯 Итоговая Команда (Всё в Одном)

Если хотите выполнить всё одной командой (ОСТОРОЖНО, сначала сделайте backup!):

```bash
#!/bin/bash

# Полная синхронизация TYT проекта
echo "🚀 Начинаем синхронизацию TYT проекта..."

# Backup
echo "📦 Создаём backup..."
cp -r ~/tyt.app ~/tyt.app.backup.$(date +%Y%m%d_%H%M%S)
cp ~/tyt.app/.env ~/tyt.app.env.backup 2>/dev/null

# Распаковка
echo "📂 Распаковываем архив..."
cd ~/Downloads
unzip -o tyt-app-latest.zip -d tyt-app-temp

# Замена файлов
echo "🔄 Заменяем файлы..."
cd ~/tyt.app
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name '.env' ! -name 'node_modules' -exec rm -rf {} +
cp -r ~/Downloads/tyt-app-temp/* .
cp -r ~/Downloads/tyt-app-temp/.* . 2>/dev/null || true

# Восстановление .env
if [ -f ~/tyt.app.env.backup ]; then
    cp ~/tyt.app.env.backup .env
    echo "✅ .env восстановлен"
fi

# Установка зависимостей
echo "📦 Устанавливаем зависимости..."
npm install

# Build
echo "🏗️ Проверяем build..."
npm run build

# Git
echo "📝 Создаём commit..."
git add .
git commit -m "feat: Complete sync from bolt.new - $(date +%Y-%m-%d)"

# Push
echo "🚀 Загружаем на GitHub..."
git push origin main

echo "✅ Синхронизация завершена!"
echo "🔍 Проверьте GitHub: https://github.com/takeyourtokenapp/tyt.app"
```

---

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте чеклист выше
2. Посмотрите раздел Troubleshooting
3. Убедитесь что backup создан
4. Сохраните вывод ошибок для анализа

---

**Статус:** ✅ Готово к Исполнению
**Время выполнения:** ~10-15 минут
**Риски:** Минимальны при наличии backup

**Удачи! 🚀**

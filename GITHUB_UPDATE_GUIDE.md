# Полный Гайд по Обновлению GitHub

## Текущий Статус
- ✅ Репозиторий создан: `https://github.com/takeyourtokenapp/tyt.app`
- ✅ Репозиторий склонирован на Mac: `~/Desktop/tyt.app`
- ✅ 115+ файлов готовы к загрузке
- ✅ Build успешен
- ✅ База данных развёрнута (80 таблиц)
- ✅ Edge Functions активны (10 функций)

---

## Шаг 1: Скопировать Файлы на Mac

### Способ A: Через Интерфейс (РЕКОМЕНДУЕТСЯ)

1. В интерфейсе Bolt.new/Claude найдите кнопку **"Download Project"** или **"Export"**
2. Скачайте ZIP архив проекта
3. Распакуйте в `~/Desktop/tyt.app`

### Способ B: Скачать Архив

Если доступен файл `/tmp/tyt-v2-complete.tar.gz` (305 KB):

```bash
cd ~/Desktop/tyt.app
# Скачайте архив в Downloads
tar -xzf ~/Downloads/tyt-v2-complete.tar.gz
```

### Способ C: Вручную Скопировать

Скопируйте следующие директории и файлы:

```
src/
supabase/
public/
package.json
package-lock.json
tsconfig.json
tsconfig.app.json
tsconfig.node.json
vite.config.ts
tailwind.config.js
postcss.config.js
eslint.config.js
index.html
.env
.gitignore
```

---

## Шаг 2: Проверка Файлов

```bash
cd ~/Desktop/tyt.app

# Проверьте структуру
ls -la

# Должны быть:
# - src/
# - supabase/
# - public/
# - package.json
# - node_modules/ (или установите npm install)
```

---

## Шаг 3: Установка Зависимостей (если нужно)

```bash
npm install
```

---

## Шаг 4: Проверка .env

Убедитесь, что файл `.env` содержит ваши Supabase ключи:

```bash
cat .env
```

Должно быть:
```env
VITE_SUPABASE_URL=https://ваш-проект.supabase.co
VITE_SUPABASE_ANON_KEY=ваш-анон-ключ
```

**ВАЖНО**: Эти переменные должны быть настоящими из вашего Supabase проекта!

---

## Шаг 5: Сборка Проекта

```bash
npm run build
```

Результат:
```
✓ 1627 modules transformed.
dist/index.html                   2.02 kB
dist/assets/index-DfqkqpBG.css   46.47 kB
dist/assets/index-fXrJLDs2.js   606.15 kB
✓ built in 7.13s
```

Если есть ошибки - исправьте их перед push!

---

## Шаг 6: Git Status

```bash
git status
```

Вы должны увидеть все изменённые файлы.

---

## Шаг 7: Git Add

```bash
# Добавить все файлы
git add .

# ИЛИ добавить выборочно
git add src/
git add supabase/
git add public/
git add package.json
git add *.config.js
git add *.config.ts
git add tsconfig.*.json
git add index.html
git add *.md
```

---

## Шаг 8: Git Commit

```bash
git commit -m "feat: Complete TYT v2 Platform

- Implemented NFT Mining System with BTC rewards
- Added Multi-Chain Wallet (BTC, ETH, TRX, SOL, XRP, TON)
- Integrated TYT Tokenomics with burn mechanism
- Created Marketplace for NFT miners
- Built Digital-Interactive-Technology Blockchain Academy
- Established Children's Brain Cancer Research Foundation
- Deployed 10 Edge Functions for blockchain operations
- Created 80 database tables with full RLS
- Implemented KYC and Access Control system
- Added Fee Distribution System (Protocol, Charity, Academy)
- Built Governance with veTYT locks
- Implemented Service Button and Discount Curve
- Created comprehensive documentation (25+ files)

Stack: React, TypeScript, Vite, Supabase, PostgreSQL, Deno Edge Functions
Blockchains: Bitcoin, Ethereum, Tron, Solana, XRP, TON
Features: Custodial Wallets, Cross-chain Swaps, Staking, DAO Voting

Built with ❤️ for children with brain cancer"
```

---

## Шаг 9: Git Push

```bash
git push origin main
```

Если требуется force push (осторожно!):
```bash
git push origin main --force
```

---

## Шаг 10: Проверка на GitHub

Откройте в браузере:
```
https://github.com/takeyourtokenapp/tyt.app
```

Проверьте:
- ✅ Все файлы загружены
- ✅ Структура папок правильная
- ✅ README.md отображается
- ✅ Коммит виден
- ✅ 115+ файлов в репозитории

---

## Структура Репозитория на GitHub

После успешного push вы должны увидеть:

```
tyt.app/
├── .bolt/
├── public/
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── types/
│   ├── utils/
│   └── config/
├── supabase/
│   ├── functions/
│   └── migrations/
├── docs/ (все .md файлы)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## Важные Файлы для Проверки

После push проверьте на GitHub:

### 1. README.md
Главная документация проекта

### 2. PROJECT_ANALYSIS.md
Полный анализ архитектуры

### 3. TYT_V2_MASTER_BLUEPRINT.md
Мастер-план проекта

### 4. package.json
Зависимости проекта

### 5. supabase/migrations/
15 SQL миграций

### 6. supabase/functions/
10 Edge Functions

### 7. src/pages/app/
10 страниц приложения

---

## Что Дальше?

### 1. Настройка CI/CD

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Hostinger
        uses: SamKirkland/FTP-Deploy-Action@4.3.3
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
```

### 2. Добавление Secrets

В GitHub Settings → Secrets добавьте:
- `FTP_SERVER`
- `FTP_USERNAME`
- `FTP_PASSWORD`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

### 3. Защита Ветки

Settings → Branches → Add rule:
- ✅ Require pull request before merging
- ✅ Require status checks to pass
- ✅ Require branches to be up to date

### 4. Создание Releases

После успешного push:

```bash
git tag -a v2.0.0 -m "TYT v2 Initial Release"
git push origin v2.0.0
```

Затем на GitHub:
- Releases → Draft a new release
- Tag: v2.0.0
- Title: "TYT v2.0.0 - Initial Release"
- Описание: скопируйте из PROJECT_ANALYSIS.md

---

## Troubleshooting

### Проблема: Permission denied

```bash
git remote -v
# Проверьте URL

# Если нужно, обновите:
git remote set-url origin https://github.com/takeyourtokenapp/tyt.app.git
```

### Проблема: Build ошибки

```bash
# Очистить кэш
rm -rf node_modules dist
npm install
npm run build
```

### Проблема: Git conflicts

```bash
# Отменить изменения
git reset --hard origin/main

# Или форс push (осторожно!)
git push origin main --force
```

### Проблема: Файлы не добавились

```bash
# Проверьте .gitignore
cat .gitignore

# Добавьте файлы принудительно
git add -f путь/к/файлу
```

---

## Контрольный Список

Перед финальным push проверьте:

- [ ] Все файлы скопированы
- [ ] npm install выполнен
- [ ] npm run build успешен
- [ ] .env содержит правильные ключи
- [ ] git status показывает все файлы
- [ ] git add . выполнен
- [ ] Коммит сообщение подробное
- [ ] README.md актуален
- [ ] package.json корректен
- [ ] Нет секретов в коде
- [ ] .gitignore правильный

---

## Финальная Команда

```bash
cd ~/Desktop/tyt.app
git status
git add .
git commit -m "feat: Complete TYT v2 Platform - Multi-Chain Mining & Children's Brain Cancer Foundation"
git push origin main
```

Затем откройте:
```
https://github.com/takeyourtokenapp/tyt.app
```

---

## Успех!

После успешного push:

1. ✅ Код на GitHub
2. ✅ История коммитов сохранена
3. ✅ Документация доступна
4. ✅ Готово к deployment
5. ✅ Готово к collaboration

---

## Следующий Этап: Deployment

Смотрите файлы:
- `DEPLOYMENT.md` - полный гайд по деплою
- `DEPLOYMENT_HOSTINGER.md` - деплой на Hostinger
- `QUICK_DEPLOY.md` - быстрый старт

---

**Готово к изменению мира!** 🚀

*"From code to cure - every commit saves a child."*

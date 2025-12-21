# 🚨 EMERGENCY: ПРИВАТНЫЙ КЛЮЧ СКОМПРОМЕТИРОВАН

**Дата:** 21 декабря 2024
**Статус:** КРИТИЧЕСКАЯ УГРОЗА

---

## ⚠️ ЧТО ПРОИЗОШЛО

Приватный ключ тестового кошелька был обнаружен в публичных файлах:
- `START_NOW.md`
- `REAL_LAUNCH_INSTRUCTIONS.md`

**Скомпрометированный ключ:**
```
0xd0d4582f474f6e53743838c635cf7ab596b1d6023722d08f04275495ba89494f
```

**Адрес кошелька:**
```
0xc9182B50ccA0088c339AF488B63a55cA175e1F09
```

**Также скомпрометированы API ключи:**
- Alchemy RPC API Key
- PolygonScan API Key

---

## 🚨 НЕМЕДЛЕННЫЕ ДЕЙСТВИЯ (ПРЯМО СЕЙЧАС!)

### 1. ОСТАНОВИТЬ ВСЕ ОПЕРАЦИИ ⏸️

```bash
# Если запущен dev server - остановить
Ctrl+C

# Если есть транзакции - НЕ ПОДПИСЫВАТЬ
```

### 2. ПРОВЕРИТЬ БАЛАНС КОШЕЛЬКА 💰

```bash
# Ethereum/Polygon Mainnet
cast balance 0xc9182B50ccA0088c339AF488B63a55cA175e1F09 \
  --rpc-url https://eth-mainnet.g.alchemy.com/v2/YOUR_KEY

# Polygon Amoy Testnet
cast balance 0xc9182B50ccA0088c339AF488B63a55cA175e1F09 \
  --rpc-url https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY

# Bitcoin (если есть)
# Проверить через explorer
```

**Если баланс > 0:**
- 🚨 НЕМЕДЛЕННО переведите на безопасный кошелек!
- Не медлите - каждая секунда критична!

### 3. СОЗДАТЬ НОВЫЙ БЕЗОПАСНЫЙ КОШЕЛЕК 🔐

```bash
# Вариант A: Использовать MetaMask
# 1. Открыть MetaMask
# 2. Create New Account
# 3. Export НОВЫЙ private key
# 4. Сохранить в 1Password/Bitwarden

# Вариант B: Использовать cast
cast wallet new

# ВАЖНО: Записать приватный ключ ТОЛЬКО в зашифрованное хранилище!
# НИКОГДА не записывать в файлы проекта!
```

### 4. ПЕРЕМЕСТИТЬ ВСЕ СРЕДСТВА 💸

```bash
# Перевести ВСЁ со старого кошелька на новый

# ETH/POL
cast send 0xНОВЫЙ_АДРЕС \
  --value <ВЕСЬ_БАЛАНС> \
  --private-key 0xСТАРЫЙ_КЛЮЧ \
  --rpc-url https://...

# ERC20 токены
cast send 0xTOKEN_ADDRESS \
  "transfer(address,uint256)" \
  0xНОВЫЙ_АДРЕС \
  <AMOUNT> \
  --private-key 0xСТАРЫЙ_КЛЮЧ \
  --rpc-url https://...
```

### 5. РОТИРОВАТЬ API КЛЮЧИ 🔄

**Alchemy:**
```
1. Зайти: https://dashboard.alchemy.com
2. Apps → Ваше приложение → API Keys
3. Delete старый ключ
4. Create new API key
5. Обновить .env файл (локально)
```

**PolygonScan:**
```
1. Зайти: https://polygonscan.com/myapikey
2. Revoke старый ключ
3. Add new API key
4. Обновить .env файл (локально)
```

### 6. ОЧИСТИТЬ GIT HISTORY 🗑️

**КРИТИЧНО: Удалить ключи из истории Git!**

```bash
cd /tmp/cc-agent/61475162/project

# Вариант A: Удалить файлы из истории
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch START_NOW.md REAL_LAUNCH_INSTRUCTIONS.md" \
  --prune-empty --tag-name-filter cat -- --all

# Вариант B: Использовать BFG Repo-Cleaner (рекомендуется)
# https://rtyley.github.io/bfg-repo-cleaner/
bfg --delete-files START_NOW.md
bfg --delete-files REAL_LAUNCH_INSTRUCTIONS.md
bfg --replace-text passwords.txt  # файл с ключами для замены

# Force push (ОПАСНО - координируйте с командой!)
git push origin --force --all
git push origin --force --tags
```

**⚠️ ВАЖНО:**
- Если репозиторий публичный на GitHub - ключи НАВСЕГДА в истории
- GitHub может кешировать до 5 дней
- Злоумышленники могут уже скопировать
- **НИКОГДА не используйте этот ключ снова!**

### 7. ОБНОВИТЬ .ENV ФАЙЛЫ 📝

```bash
cd /tmp/cc-agent/61475162/project

# Создать новый .env с НОВЫМИ ключами
cat > .env << EOF
# НОВЫЕ ключи - НИКОГДА не коммитить!
VITE_ALCHEMY_API_KEY=ВАШ_НОВЫЙ_ALCHEMY_KEY
VITE_POLYGONSCAN_API_KEY=ВАШ_НОВЫЙ_POLYGONSCAN_KEY

# Остальные настройки...
VITE_SUPABASE_URL=https://vqwnfqukydgquvfnmqcp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZxd25mcXVreWRncXV2Zm5tcWNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MjU0MTUsImV4cCI6MjA0OTMwMTQxNX0.JLikGz8kvK8BK0kNCgSARDIxAy9ZR16vv6N1-SQZk8I
EOF

# Обновить contracts/.env
cd contracts/evm
cat > .env << EOF
# НОВЫЕ ключи для deployment
PRIVATE_KEY=ВАШ_НОВЫЙ_PRIVATE_KEY
ALCHEMY_API_KEY=ВАШ_НОВЫЙ_ALCHEMY_KEY
POLYGONSCAN_API_KEY=ВАШ_НОВЫЙ_POLYGONSCAN_KEY
EOF
```

---

## 📋 CHECKLIST ПОСЛЕ КОМПРОМЕТАЦИИ

Отметьте каждый пункт после выполнения:

### Немедленно (0-1 час):
- [ ] Проверен баланс старого кошелька
- [ ] Созданы новые кошельки
- [ ] Переведены ВСЕ средства
- [ ] Ротированы API ключи (Alchemy, PolygonScan)
- [ ] Обновлены .env файлы

### Срочно (1-24 часа):
- [ ] Удалены файлы с ключами из Git history
- [ ] Force push в remote репозиторий
- [ ] Уведомлена команда
- [ ] Проверены логи на несанкционированный доступ
- [ ] Пересмотрены права доступа

### Важно (1-7 дней):
- [ ] Аудит всех файлов на секреты
- [ ] Настроены pre-commit hooks
- [ ] Обучение команды security practices
- [ ] Документация обновлена
- [ ] Incident report написан

---

## 🔍 КАК ПРОВЕРИТЬ УЩЕРБ

### 1. Проверить транзакции кошелька

**Ethereum/Polygon:**
```
https://etherscan.io/address/0xc9182B50ccA0088c339AF488B63a55cA175e1F09
https://polygonscan.com/address/0xc9182B50ccA0088c339AF488B63a55cA175e1F09
https://amoy.polygonscan.com/address/0xc9182B50ccA0088c339AF488B63a55cA175e1F09
```

**Что искать:**
- ❌ Несанкционированные транзакции
- ❌ Выводы средств
- ❌ Approve токенов
- ❌ Взаимодействия с неизвестными контрактами

### 2. Проверить логи API ключей

**Alchemy:**
```
Dashboard → Analytics → View recent requests
```

**Что искать:**
- ❌ Неизвестные IP адреса
- ❌ Необычно высокий RPS
- ❌ Запросы из других стран

### 3. Проверить GitHub

```bash
# Поиск в истории
git log --all --full-history -- START_NOW.md
git log -p --all -- START_NOW.md | grep "private-key"

# Проверить форки
# Зайти на GitHub → Insights → Network → Forks
```

---

## 🛡️ ЗАЩИТА ОТ БУДУЩИХ УТЕЧЕК

### 1. Установить pre-commit hooks

```bash
# Установить detect-secrets
pip install detect-secrets

# Инициализировать
cd /tmp/cc-agent/61475162/project
detect-secrets scan > .secrets.baseline

# Создать .pre-commit-config.yaml
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: package-lock.json
EOF

# Установить hooks
pre-commit install
```

### 2. Использовать менеджер секретов

**Рекомендуемые:**
- **1Password** (лучший для команд)
- **Bitwarden** (open source)
- **AWS Secrets Manager** (для production)
- **HashiCorp Vault** (enterprise)

```bash
# Пример: 1Password CLI
op signin
op item get "TYT Platform Keys" --fields "private_key"
```

### 3. Environment variables ТОЛЬКО локально

```bash
# ✅ Правильно
export PRIVATE_KEY=0x...
forge script ... --private-key $PRIVATE_KEY

# ❌ НЕПРАВИЛЬНО
forge script ... --private-key 0x...  # видно в history!
echo "PRIVATE_KEY=0x..." > .env  # может закоммититься!
```

### 4. Использовать hardware wallets

**Для production:**
- Ledger
- Trezor
- Keystone

```bash
# Deploy через Ledger
forge script ... --ledger --hd-paths "m/44'/60'/0'/0"
```

---

## 📚 ОБУЧЕНИЕ КОМАНДЫ

### Что НИКОГДА не делать:

❌ Коммитить .env файлы
❌ Хардкодить приватные ключи
❌ Хранить ключи в plain text
❌ Отправлять ключи в Slack/Telegram
❌ Делать скриншоты с ключами
❌ Использовать production ключи для тестов
❌ Хранить ключи в облаке (Google Drive, Dropbox)

### Что ВСЕГДА делать:

✅ Использовать .env (в .gitignore)
✅ Хранить в password manager
✅ Ротировать ключи каждые 90 дней
✅ Использовать разные ключи для testnet/mainnet
✅ Включать 2FA везде
✅ Использовать hardware wallets для больших сумм
✅ Делать backups (зашифрованные)

---

## 🆘 НУЖНА ПОМОЩЬ?

### Если украдены большие суммы:

1. **Немедленно обратиться:**
   - Chainalysis (crypto forensics)
   - Local law enforcement
   - Binance/exchange (если средства там)

2. **Заморозить адрес:**
   - Многие exchanges блокируют украденные средства
   - Подать заявку на freeze через Tether (USDT)

3. **Публичное объявление:**
   - Twitter/X
   - Etherscan comment
   - Blockchain explorers

### Security консультанты:

- **Trail of Bits** - security audits
- **OpenZeppelin** - security consulting
- **Halborn** - incident response
- **CertiK** - blockchain security

---

## 📝 INCIDENT REPORT TEMPLATE

```markdown
# Security Incident Report

**Date:** 21 декабря 2024
**Severity:** CRITICAL
**Type:** Private Key Exposure

## What Happened
Private key exposed in public GitHub repository files:
- START_NOW.md
- REAL_LAUNCH_INSTRUCTIONS.md

## Impact
- Testnet wallet compromised
- API keys exposed
- Potential theft of funds

## Actions Taken
1. [ ] Funds transferred to new wallet
2. [ ] API keys rotated
3. [ ] Files removed from Git history
4. [ ] Team notified

## Lessons Learned
- Need pre-commit hooks
- Better documentation practices
- Security training required

## Prevention
- Install detect-secrets
- Use password manager
- Regular security audits
```

---

## ⚡ БЫСТРАЯ СПРАВКА

**Создать новый кошелек:**
```bash
cast wallet new
```

**Проверить баланс:**
```bash
cast balance 0xADDRESS --rpc-url URL
```

**Перевести средства:**
```bash
cast send 0xTO --value ALL --private-key KEY --rpc-url URL
```

**Ротировать ключи:**
```
Alchemy: dashboard.alchemy.com
PolygonScan: polygonscan.com/myapikey
```

**Очистить Git:**
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch FILE" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 🔒 СЛЕДУЮЩИЕ ШАГИ

После решения немедленной угрозы:

1. **Security Audit** (24 часа)
   - Проверить ВСЕ файлы на секреты
   - Проверить Git history
   - Проверить CI/CD логи

2. **Team Training** (эта неделя)
   - Security best practices
   - Password manager usage
   - Git secrets prevention

3. **Process Update** (эта неделя)
   - Обновить документацию
   - Настроить pre-commit hooks
   - Внедрить code review

4. **Regular Checks** (постоянно)
   - Ежемесячная ротация ключей
   - Ежеквартальный security audit
   - Мониторинг кошельков

---

**ПОМНИТЕ: Безопасность - это процесс, не цель.**

**Один раз скомпрометированный ключ НИКОГДА не станет безопасным снова.**

**ВСЕГДА создавайте новые ключи после утечки!**

---

**Дата создания:** 21 декабря 2024
**Последнее обновление:** 21 декабря 2024
**Версия:** 1.0

**Emergency Contact:** security@takeyourtoken.app

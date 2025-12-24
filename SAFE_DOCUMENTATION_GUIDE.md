# 📚 Безопасное написание документации

**Версия:** 1.0
**Дата:** 21 декабря 2024

---

## ⚠️ КРИТИЧЕСКИЕ ПРАВИЛА

### ❌ НИКОГДА не включайте в документацию:

1. **Приватные ключи**
   ```
   ❌ НЕПРАВИЛЬНО:
   --private-key 0xYOUR_PRIVATE_KEY_HERE_DO_NOT_EXPOSE

   ✅ ПРАВИЛЬНО:
   --private-key $PRIVATE_KEY
   ```

2. **API ключи**
   ```
   ❌ НЕПРАВИЛЬНО:
   ALCHEMY_API_KEY=YOUR_ALCHEMY_KEY_DO_NOT_EXPOSE

   ✅ ПРАВИЛЬНО:
   ALCHEMY_API_KEY=your_alchemy_key_here
   ```

3. **Пароли и токены**
   ```
   ❌ НЕПРАВИЛЬНО:
   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

   ✅ ПРАВИЛЬНО:
   SUPABASE_SERVICE_KEY=<получить из dashboard>
   ```

4. **Реальные адреса кошельков с балансом**
   ```
   ❌ НЕПРАВИЛЬНО:
   Wallet: 0xc9182B50ccA0088c339AF488B63a55cA175e1F09 (с балансом)

   ✅ ПРАВИЛЬНО:
   Wallet: 0xYOUR_WALLET_ADDRESS_HERE
   ```

5. **Seed phrases / Mnemonic**
   ```
   ❌ НЕПРАВИЛЬНО:
   word1 word2 word3 word4 word5 word6 word7 word8 word9 word10 word11 word12

   ✅ ПРАВИЛЬНО:
   <ваша 12-словная seed phrase из безопасного хранилища>
   ```

---

## ✅ БЕЗОПАСНЫЕ ШАБЛОНЫ

### 1. Команды с приватными ключами

**Неправильно:**
```bash
forge script Deploy.s.sol \
  --rpc-url https://polygon-amoy.g.alchemy.com/v2/YOUR_ALCHEMY_KEY_DO_NOT_EXPOSE \
  --private-key 0xYOUR_PRIVATE_KEY_HERE_DO_NOT_EXPOSE \
  --broadcast
```

**Правильно:**
```bash
# Load from .env
source .env

forge script Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast

# Или еще безопаснее - через Ledger
forge script Deploy.s.sol \
  --rpc-url $RPC_URL \
  --ledger \
  --broadcast
```

### 2. .env примеры

**Создать .env.example:**
```bash
# .env.example - БЕЗОПАСНО коммитить!

# Blockchain
PRIVATE_KEY=0x0000000000000000000000000000000000000000000000000000000000000000
ALCHEMY_API_KEY=your_alchemy_key_here
POLYGONSCAN_API_KEY=your_polygonscan_key_here

# Supabase (только anon key публичный!)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# НИКОГДА не включать:
# SUPABASE_SERVICE_ROLE_KEY - это секрет!
# PRIVATE_KEY - реальный ключ
```

### 3. Инструкции по получению ключей

**Вместо предоставления ключа - дать инструкции:**

```markdown
## Получить Alchemy API Key

1. Зайти: https://dashboard.alchemy.com
2. Sign up / Login
3. Create New App
   - Chain: Polygon
   - Network: Amoy (testnet)
4. View Key → Copy API KEY
5. Добавить в `.env`:
   ```
   ALCHEMY_API_KEY=<ваш_ключ_здесь>
   ```
```

### 4. Адреса кошельков

**Использовать плейсхолдеры:**
```bash
# Неправильно
cast balance 0xc9182B50ccA0088c339AF488B63a55cA175e1F09

# Правильно
cast balance $YOUR_WALLET_ADDRESS

# Или
cast balance 0xYOUR_ADDRESS_HERE
```

### 5. Smart Contract адреса

**Публичные адреса - можно:**
```bash
# ✅ Это OK - контракты публичны
MINER_NFT_ADDRESS=0x1234567890123456789012345678901234567890
MARKETPLACE_ADDRESS=0x0987654321098765432109876543210987654321
```

**Но для примеров лучше использовать переменные:**
```bash
# Еще лучше
MINER_NFT_ADDRESS=<адрес из deployments/amoy.json>
```

---

## 📝 ШАБЛОНЫ ДОКУМЕНТАЦИИ

### Deployment Guide Template

```markdown
# Deployment Guide

## Prerequisites

1. **Install Foundry**
   ```bash
   curl -L https://foundry.paradigm.xyz | bash
   foundryup
   ```

2. **Get Testnet Funds**
   - Visit: https://faucet.polygon.technology/
   - Network: Polygon Amoy
   - Address: YOUR_ADDRESS

3. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env and add your keys
   ```

## Configuration

Create `.env` file:

```bash
# Get these from your providers
PRIVATE_KEY=<from MetaMask - NEVER share!>
ALCHEMY_API_KEY=<from dashboard.alchemy.com>
POLYGONSCAN_API_KEY=<from polygonscan.com/myapikey>
```

## Deploy

```bash
# Load environment
source .env

# Deploy
forge script script/Deploy.s.sol \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

## Verify Deployment

```bash
# Check contract
cast code $DEPLOYED_ADDRESS --rpc-url $RPC_URL

# View on explorer
echo "https://amoy.polygonscan.com/address/$DEPLOYED_ADDRESS"
```

## ⚠️ Security

- NEVER commit `.env` files
- NEVER share your private key
- Use testnet for testing
- Rotate keys every 90 days
```

---

## 🔍 ПРОВЕРКА ДОКУМЕНТАЦИИ

### Перед коммитом проверьте:

```bash
# 1. Поиск приватных ключей (64 hex characters)
grep -r "0x[a-fA-F0-9]{64}" docs/ README.md *.md

# 2. Поиск слов "private key" с потенциальными ключами
grep -r -i "private.key.*0x" docs/ *.md

# 3. Поиск API ключей (длинные alphanum строки)
grep -r "[a-zA-Z0-9_-]{32,}" docs/ *.md | grep -i "key\|token\|secret"

# 4. Использовать detect-secrets
detect-secrets scan docs/ README.md *.md
```

### Автоматическая проверка

**Установить pre-commit hooks:**
```bash
# Установить pre-commit
pip install pre-commit

# Инициализировать
pre-commit install

# Проверить все файлы
pre-commit run --all-files
```

---

## 🎯 CHECKLIST ДЛЯ АВТОРОВ ДОКУМЕНТАЦИИ

Перед публикацией документа, проверьте:

- [ ] Нет приватных ключей (0x + 64 hex)
- [ ] Нет реальных API ключей
- [ ] Нет seed phrases
- [ ] Нет паролей
- [ ] Используются переменные окружения ($VAR)
- [ ] Используются плейсхолдеры (YOUR_KEY_HERE)
- [ ] Есть инструкции как получить ключи
- [ ] Упомянута безопасность
- [ ] Прошла проверка detect-secrets
- [ ] Прошла проверка pre-commit hooks

---

## 📚 ПРИМЕРЫ БЕЗОПАСНОЙ ДОКУМЕНТАЦИИ

### ✅ Хороший пример

```markdown
# Quick Start

## Setup

1. Create `.env`:
   ```bash
   PRIVATE_KEY=your_private_key_from_metamask
   RPC_URL=your_alchemy_rpc_url
   ```

2. Deploy:
   ```bash
   source .env
   forge create Contract --private-key $PRIVATE_KEY
   ```

## Get API Keys

- Alchemy: https://dashboard.alchemy.com
- PolygonScan: https://polygonscan.com/myapikey

## Security

⚠️ NEVER commit your `.env` file!
⚠️ NEVER share your private key!
```

### ❌ Плохой пример

```markdown
# Quick Start

## Setup

1. Use this private key:
   ```
   0xYOUR_PRIVATE_KEY_HERE_DO_NOT_EXPOSE
   ```

2. Deploy:
   ```bash
   forge create Contract \
     --private-key 0xYOUR_PRIVATE_KEY_HERE_DO_NOT_EXPOSE \
     --rpc-url https://polygon-amoy.g.alchemy.com/v2/YOUR_ALCHEMY_KEY_DO_NOT_EXPOSE
   ```
```

---

## 🚨 ЧТО ДЕЛАТЬ ЕСЛИ КЛЮЧ УЖЕ ОПУБЛИКОВАН

Если вы случайно опубликовали секрет:

1. **НЕМЕДЛЕННО** удалить документ
2. **НЕМЕДЛЕННО** ротировать ключи
3. Следовать [EMERGENCY_KEY_COMPROMISE.md](./EMERGENCY_KEY_COMPROMISE.md)
4. Очистить Git history
5. Уведомить команду

---

## 📖 ПОЛЕЗНЫЕ РЕСУРСЫ

**Инструменты:**
- [detect-secrets](https://github.com/Yelp/detect-secrets)
- [gitleaks](https://github.com/gitleaks/gitleaks)
- [pre-commit](https://pre-commit.com/)

**Гайды:**
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)

**Password Managers:**
- [1Password](https://1password.com/)
- [Bitwarden](https://bitwarden.com/)
- [LastPass](https://www.lastpass.com/)

---

## ✨ ИТОГ

**3 ЗОЛОТЫХ ПРАВИЛА:**

1. 🔒 **Никогда не публикуйте секреты в документации**
2. 🔐 **Всегда используйте переменные окружения**
3. 📝 **Всегда проверяйте перед коммитом**

**Безопасная документация = безопасный проект!**

---

**Дата:** 21 декабря 2024
**Версия:** 1.0
**Автор:** TYT Security Team

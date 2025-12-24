# 🔧 НАСТРОЙКА ENVIRONMENT VARIABLES

**Время выполнения:** 10 минут

---

## 📋 QUICK START

### 1. Создать .env файл

```bash
cp .env.example .env
```

### 2. Получить Alchemy API Key

1. Перейти на https://dashboard.alchemy.com
2. Create App → Chain: Ethereum → Network: Polygon Amoy
3. Скопировать API Key
4. Вставить в `.env`:
   ```
   VITE_ALCHEMY_API_KEY=ваш_ключ_здесь
   ```

### 3. Supabase Credentials

Supabase URL и Anon Key уже настроены в текущем `.env` файле.

**ВАЖНО:** Anon Key - это публичный ключ, безопасен для использования в frontend.

### 4. Проверить setup

```bash
npm run build
```

Если сборка успешна - всё работает! ✅

---

## 🔐 BACKEND SECRETS (Edge Functions)

Для Edge Functions нужно настроить секреты в Supabase Dashboard.

### Шаг 1: Генерация секретов

```bash
# Сгенерировать все секреты одной командой
echo "WEBHOOK_SECRET=$(openssl rand -hex 32)"
echo "CRON_SECRET=$(openssl rand -hex 32)"
echo "WALLET_ENCRYPTION_KEY=$(openssl rand -hex 32)"
echo "API_ENCRYPTION_KEY=$(openssl rand -hex 32)"
```

### Шаг 2: Добавить в Supabase

1. Перейти: https://supabase.com/dashboard
2. Выбрать проект
3. Settings → Edge Functions → Secrets
4. Add secret для каждого ключа

---

## 🚀 PRODUCTION SETUP

### Обязательные для production:

1. **Новые API ключи** - НЕ используйте testnet ключи!
2. **Contract addresses** - после деплоя mainnet контрактов
3. **Сильные секреты** - минимум 32 байта random data
4. **Password manager** - храните backup ключей

### Security Checklist:

- [ ] Все ключи уникальные (не из примеров)
- [ ] .env в .gitignore
- [ ] Secrets в password manager
- [ ] 2FA включена на всех сервисах
- [ ] Регулярная ротация (каждые 90 дней)

---

## ⚠️ ЧАСТЫЕ ОШИБКИ

### "Invalid API key"
**Причина:** Ключ неправильно скопирован
**Решение:** Перепроверить ключ без лишних пробелов

### "Build failed"
**Причина:** .env файл не создан
**Решение:** `cp .env.example .env`

### "Contract not deployed"
**Причина:** Адреса контрактов пустые
**Решение:** Сначала задеплоить контракты, затем добавить адреса

---

## 📞 ПОМОЩЬ

**Документация:**
- [Alchemy Setup](https://docs.alchemy.com/)
- [Supabase Setup](https://supabase.com/docs)

**Contact:** dev@takeyourtoken.app

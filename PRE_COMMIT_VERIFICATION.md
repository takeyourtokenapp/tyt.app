# ✅ PRE-COMMIT VERIFICATION CHECKLIST

**Используйте этот checklist ПЕРЕД каждым `git commit`**

---

## 🚨 КРИТИЧНО: ПРОВЕРКА СЕКРЕТОВ

### 1. Проверить что .env НЕ в staged files

```bash
git status
```

**Убедитесь что `.env` НЕ в списке!**

Если `.env` в staged:
```bash
git reset HEAD .env
git rm --cached .env  # если уже был добавлен
```

---

### 2. Проверить .gitignore

```bash
cat .gitignore | grep -E "\.env|\.key|secrets|wallet"
```

**Должны быть следующие строки:**
- ✅ `.env`
- ✅ `.env.*`
- ✅ `*.key`
- ✅ `*.pem`
- ✅ `*.p12`
- ✅ `wallets/`
- ✅ `keystore/`
- ✅ `secrets/`
- ✅ `credentials/`

---

### 3. Scan для hardcoded секретов

```bash
# Проверить TypeScript файлы
grep -r "PRIVATE_KEY\|API_KEY\|SECRET" src/ --include="*.ts" --include="*.tsx" \
  | grep -v "import.meta.env" \
  | grep -v "process.env" \
  | grep -v "// " \
  | grep -v "interface\|type"
```

**Результат должен быть ПУСТЫМ** или показывать только импорты/типы.

```bash
# Проверить Edge Functions
grep -r "const.*=.*['\"].*[a-zA-Z0-9]{20,}" supabase/functions/ --include="*.ts" \
  | grep -v "Deno.env" \
  | grep -v "//"
```

**Результат должен быть ПУСТЫМ** или показывать только публичные данные.

---

## 📝 CHECKLIST

### Frontend Security:

- [ ] `.env` в `.gitignore`
- [ ] `.env` НЕ в `git status`
- [ ] Нет hardcoded секретов в `src/`
- [ ] Все API keys через `import.meta.env.VITE_*`
- [ ] `npm run build` успешен

**Команда для проверки:**
```bash
npm run build && echo "✅ BUILD SUCCESSFUL"
```

---

### Backend Security:

- [ ] Edge Functions используют `Deno.env.get()`
- [ ] Нет hardcoded secrets в `supabase/functions/`
- [ ] Webhook secrets настроены в Supabase Dashboard
- [ ] Encryption keys настроены в Supabase Dashboard

**Команда для проверки:**
```bash
grep -r "Deno.env.get" supabase/functions/ | wc -l
# Должно быть > 0
```

---

### Database Security:

- [ ] SQL миграции не содержат приватных данных
- [ ] Только публичные contract addresses
- [ ] RLS policies актуальны

**Команда для проверки:**
```bash
grep -r "private\|secret\|key.*=.*'" supabase/migrations/ | grep -v "-- " | wc -l
# Должно быть 0
```

---

### Documentation Security:

- [ ] Markdown файлы не содержат реальных ключей
- [ ] Примеры используют placeholders (`<YOUR_KEY>`)
- [ ] `.env.example` актуален

**Команда для проверки:**
```bash
grep -r "WeGn_wxfb\|0xd0d4582f" . --include="*.md" | wc -l
# Должно быть 0 (старые скомпрометированные ключи)
```

---

## 🔧 АВТОМАТИЧЕСКАЯ ПРОВЕРКА

### Установить pre-commit hooks:

```bash
# 1. Установить detect-secrets
pip install detect-secrets

# 2. Создать baseline
detect-secrets scan > .secrets.baseline

# 3. Установить pre-commit
pip install pre-commit
pre-commit install

# 4. Запустить проверку
pre-commit run --all-files
```

### После установки:

Каждый `git commit` будет автоматически проверять файлы на секреты! 🛡️

---

## ⚠️ ЕСЛИ НАЙДЕН СЕКРЕТ

### 1. НЕ КОММИТИТЬ!

```bash
git reset HEAD <file>
```

### 2. Удалить секрет из файла

Заменить на:
- `import.meta.env.VITE_YOUR_KEY` (frontend)
- `Deno.env.get('YOUR_KEY')` (backend)
- `<YOUR_KEY_HERE>` (документация)

### 3. Проверить Git history

```bash
git log --all -S "секрет" --source --full-diff
```

Если секрет уже был закоммичен - см. `EMERGENCY_KEY_COMPROMISE.md`

---

## ✅ ФИНАЛЬНАЯ ПРОВЕРКА

**Перед `git push` выполнить:**

```bash
# 1. Build
npm run build

# 2. Проверка секретов (если установлен detect-secrets)
detect-secrets scan --baseline .secrets.baseline

# 3. Проверка .gitignore
git check-ignore .env && echo "✅ .env blocked" || echo "❌ WARNING: .env not blocked!"

# 4. Список файлов для commit
git status --short

# 5. Review изменений
git diff --cached
```

**Если всё ОК:**
```bash
git commit -m "Your commit message"
git push
```

---

## 🆘 БЫСТРАЯ ПОМОЩЬ

### Случайно добавил .env в commit:

```bash
git reset HEAD .env
git rm --cached .env
```

### Случайно закоммитил .env:

```bash
# Если ещё не pushed:
git reset --soft HEAD~1
git rm --cached .env
git commit -m "Remove .env"

# Если уже pushed:
# См. EMERGENCY_KEY_COMPROMISE.md
```

### Нашел hardcoded секрет:

```bash
# 1. Заменить на env variable
# 2. Ротировать ключ (создать новый)
# 3. Обновить .env (локально)
# 4. Обновить Supabase Dashboard (для backend)
```

---

## 📚 ДОКУМЕНТАЦИЯ

**Детальные инструкции:**
- `EMERGENCY_KEY_COMPROMISE.md` - при утечке ключа
- `ALCHEMY_KEY_ROTATION.md` - ротация Alchemy key
- `ENV_SETUP_GUIDE.md` - настройка окружения
- `GITHUB_SECURITY_COMPLETE.md` - полный security audit

**Контакт:** security@takeyourtoken.app

---

## 🎯 SUMMARY

**ВСЕ проверки должны пройти ПЕРЕД commit!**

Если хотя бы одна проверка failed:
1. ❌ НЕ коммитить
2. 🔧 Исправить проблему
3. ✅ Повторить проверку
4. ✅ Только после всех ОК - commit

**Безопасность > скорость**

**Один скомпрометированный ключ = потенциальная катастрофа**

---

**Дата:** 24 декабря 2024
**Версия:** 1.0

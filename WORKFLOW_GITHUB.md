# 🔄 Workflow: bolt.new → GitHub

**Ваша структура:**
- `~/Desktop/tyt.app` - архивы из bolt.new (НЕ git)
- `~/Downloads/tyt.app` - git репозиторий, связанный с GitHub

---

## 🎯 Быстрая Синхронизация

### Шаг 1: Скачайте Архив

В bolt.new нажмите **"Download project"**

Архив сохранится в `~/Downloads/tyt-app-latest.zip`

### Шаг 2: Запустите Скрипт

```bash
cd ~/Downloads/tyt-app-latest
chmod +x sync-to-github-repo.sh
./sync-to-github-repo.sh
```

**Готово!** Скрипт сделает всё автоматически.

---

## 📋 Что Делает Скрипт

1. ✅ Находит архив `~/Downloads/tyt-app-latest.zip`
2. ✅ Создаёт backup репозитория
3. ✅ Сохраняет `.env` и `.git`
4. ✅ Заменяет все файлы в `~/Downloads/tyt.app`
5. ✅ Восстанавливает `.env` и `.git`
6. ✅ Устанавливает зависимости
7. ✅ Проверяет build
8. ✅ Создаёт git commit
9. ✅ Делает push на GitHub
10. ✅ Очищает временные файлы

**Время:** 5-10 минут

---

## 🔍 Проверка После Синхронизации

```bash
# Локально
cd ~/Downloads/tyt.app
git status
git log -1

# GitHub
open https://github.com/takeyourtokenapp/tyt.app
```

**Важно:** Убедитесь что `.env` НЕ виден на GitHub!

---

## 📁 Ваша Структура Папок

```
~/Desktop/
└── tyt.app/                    (архив, не git)
    └── все файлы проекта

~/Downloads/
├── tyt-app-latest.zip          (скачанный архив)
└── tyt.app/                    (git репозиторий)
    ├── .git/                   (связан с GitHub)
    ├── .env                    (ваши секреты)
    └── все файлы проекта
```

---

## 🚨 Важные Правила

### ✅ ДО (правильно):

```bash
bolt.new → скачать архив → ~/Downloads/tyt-app-latest.zip
                        ↓
              ./sync-to-github-repo.sh
                        ↓
            ~/Downloads/tyt.app (git)
                        ↓
                    GitHub
```

### ❌ НЕ ТАК:

- НЕ копируйте файлы вручную
- НЕ работайте в `~/Desktop/tyt.app`
- НЕ добавляйте `.env` в git

---

## 🔄 Ручная Синхронизация

Если хотите сделать вручную:

```bash
# 1. Backup
cd ~/Downloads
cp -r tyt.app tyt.app.backup.$(date +%Y%m%d_%H%M%S)

# 2. Распаковать архив
unzip -o tyt-app-latest.zip -d tyt-app-temp

# 3. Сохранить .env
cp tyt.app/.env tyt.app.env.backup

# 4. Заменить файлы
cd tyt.app
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name '.env' ! -name 'node_modules' -exec rm -rf {} +
cp -r ../tyt-app-temp/* .
cp -r ../tyt-app-temp/.* . 2>/dev/null || true

# 5. Восстановить .env
cp ../tyt.app.env.backup .env

# 6. Установить зависимости
npm install

# 7. Build
npm run build

# 8. Git
git add .
git status | grep ".env"  # НЕ должен показать .env!
git commit -m "feat: sync from bolt.new - $(date +%Y-%m-%d)"

# 9. Push
git pull origin main --rebase
git push origin main

# 10. Очистка
cd ~/Downloads
rm -rf tyt-app-temp
rm tyt.app.env.backup
```

---

## 🆘 Troubleshooting

### Архив не найден

```bash
# Переименуйте скачанный архив
mv ~/Downloads/project.zip ~/Downloads/tyt-app-latest.zip
```

### Git репозиторий не найден

```bash
# Клонируйте репозиторий
cd ~/Downloads
git clone https://github.com/takeyourtokenapp/tyt.app.git
```

### .env в списке изменений

```bash
cd ~/Downloads/tyt.app
git reset HEAD .env
echo '.env' >> .gitignore
git add .gitignore
git commit -m "fix: add .env to gitignore"
```

### Build падает

```bash
cd ~/Downloads/tyt.app
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Конфликты при push

```bash
cd ~/Downloads/tyt.app
git stash
git pull origin main --rebase
git stash pop
# Разрешите конфликты
git add .
git rebase --continue
git push origin main
```

---

## 📊 Что Обновится на GitHub

**До:** 61 файл
**После:** 125 файлов

### Новое:
- ✅ 10 Edge Functions (blockchain)
- ✅ 7 новых миграций БД
- ✅ Полная структура `src/utils/api/`
- ✅ Multi-chain поддержка
- ✅ Все компоненты и страницы

---

## ⚡ Быстрая Шпаргалка

```bash
# После скачивания архива из bolt.new:

cd ~/Downloads/tyt-app-latest
./sync-to-github-repo.sh

# Всё!
```

---

## 🔐 Безопасность

Скрипт проверяет:
- ✅ `.env` НЕ в git
- ✅ `.gitignore` настроен
- ✅ Нет секретов в коде
- ✅ Build проходит успешно

---

## 📝 Полезные Команды

```bash
# Статус репозитория
cd ~/Downloads/tyt.app
git status

# Последний commit
git log -1

# Проверить что на GitHub
git remote -v
git fetch origin
git log origin/main -1

# Открыть GitHub
open https://github.com/takeyourtokenapp/tyt.app
```

---

**Время:** 5-10 минут
**Сложность:** Простая
**Результат:** 100% синхронизация с GitHub

**Удачи! 🚀**

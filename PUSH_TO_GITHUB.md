# Как запушить TYT проект на GitHub

## Вариант 1: Через клонирование репозитория (РЕКОМЕНДУЕТСЯ)

```bash
# 1. Склонируйте пустой репозиторий к себе на MacBook
cd ~/Projects  # или куда хотите
git clone git@github.com:takeyourtokenapp/tyt.app.git
cd tyt.app

# 2. Скопируйте все файлы из этого проекта
# (файлы доступны для скачивания через интерфейс)

# 3. Добавьте и закоммитьте
git add .
git commit -m "feat: Complete Blockchain API Integration for TYT Platform"

# 4. Запушьте
git push origin main
```

## Вариант 2: Создать новый репозиторий локально

```bash
# 1. Создайте директорию
mkdir ~/Projects/tyt-app
cd ~/Projects/tyt-app

# 2. Скопируйте все файлы проекта туда

# 3. Инициализируйте git
git init
git branch -m main
git add .
git commit -m "feat: Complete Blockchain API Integration for TYT Platform"

# 4. Добавьте remote и запушьте
git remote add origin git@github.com:takeyourtokenapp/tyt.app.git
git push -u origin main
```

## Вариант 3: Использовать GitHub Desktop

1. Откройте GitHub Desktop
2. File → Add Local Repository
3. Выберите папку с проектом
4. Publish repository → takeyourtokenapp/tyt.app

## Проверка SSH ключа

Если получаете ошибку аутентификации:

```bash
# Проверьте SSH ключ
ssh -T git@github.com

# Если нет ключа, создайте:
ssh-keygen -t ed25519 -C "your_email@example.com"

# Добавьте ключ в ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Скопируйте публичный ключ
cat ~/.ssh/id_ed25519.pub

# Добавьте в GitHub: Settings → SSH and GPG keys → New SSH key
```

## Альтернатива: HTTPS вместо SSH

```bash
git remote set-url origin https://github.com/takeyourtokenapp/tyt.app.git
git push -u origin main

# Введите:
# Username: your_github_username
# Password: your_personal_access_token
```

## Создание Personal Access Token

1. GitHub.com → Settings → Developer settings
2. Personal access tokens → Tokens (classic) → Generate new token
3. Выберите scopes: `repo`, `workflow`
4. Скопируйте токен и используйте вместо пароля

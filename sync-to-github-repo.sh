#!/bin/bash

###############################################################################
# TYT SYNC SCRIPT - bolt.new → Downloads → GitHub
###############################################################################
#
# Этот скрипт:
# 1. Распаковывает архив из bolt.new
# 2. Заменяет файлы в ~/Downloads/tyt.app (git repo)
# 3. Сохраняет .env и .git
# 4. Создаёт commit и push на GitHub
#
###############################################################################

set -e  # Exit on any error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="tyt.app"
GIT_REPO_PATH="$HOME/Downloads/$PROJECT_NAME"  # Git репозиторий
ARCHIVE_NAME="tyt-app-latest.zip"
GITHUB_REPO="https://github.com/takeyourtokenapp/tyt.app"

###############################################################################
# Functions
###############################################################################

print_header() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

print_step() {
    echo ""
    echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

###############################################################################
# Start
###############################################################################

clear
print_header "🚀 TYT SYNC: bolt.new → GitHub"

echo "📂 Структура:"
echo "   • Архив: ~/Downloads/$ARCHIVE_NAME"
echo "   • Git репозиторий: $GIT_REPO_PATH"
echo "   • GitHub: $GITHUB_REPO"
echo ""

# Проверка что архив существует
if [ ! -f "$HOME/Downloads/$ARCHIVE_NAME" ]; then
    print_error "Архив не найден: ~/Downloads/$ARCHIVE_NAME"
    echo ""
    echo "📥 Скачайте архив из bolt.new и поместите в ~/Downloads/"
    echo "   Назовите его: $ARCHIVE_NAME"
    exit 1
fi

print_success "Архив найден"

# Проверка что git репозиторий существует
if [ ! -d "$GIT_REPO_PATH" ]; then
    print_error "Git репозиторий не найден: $GIT_REPO_PATH"
    echo ""
    echo "🔧 Создайте репозиторий:"
    echo "   cd ~/Downloads"
    echo "   git clone $GITHUB_REPO"
    exit 1
fi

print_success "Git репозиторий найден"

# Проверка что это git репозиторий
if [ ! -d "$GIT_REPO_PATH/.git" ]; then
    print_error "$GIT_REPO_PATH не является git репозиторием"
    exit 1
fi

print_success "Git инициализирован"

###############################################################################
# Step 1: Backup
###############################################################################

print_step "Шаг 1: Создание backup..."

BACKUP_NAME="Downloads/${PROJECT_NAME}.backup.$(date +%Y%m%d_%H%M%S)"

cp -r "$GIT_REPO_PATH" "$HOME/$BACKUP_NAME"
print_success "Backup создан: ~/$BACKUP_NAME"

# Backup .env separately
if [ -f "$GIT_REPO_PATH/.env" ]; then
    cp "$GIT_REPO_PATH/.env" "$HOME/Downloads/${PROJECT_NAME}.env.backup"
    print_success ".env сохранён отдельно"
fi

###############################################################################
# Step 2: Extract Archive
###############################################################################

print_step "Шаг 2: Распаковка архива..."

cd "$HOME/Downloads"

# Remove old temp directory if exists
rm -rf "${PROJECT_NAME}-temp" 2>/dev/null || true

# Extract archive
unzip -q -o "$ARCHIVE_NAME" -d "${PROJECT_NAME}-temp"

print_success "Архив распакован"

###############################################################################
# Step 3: Replace Files
###############################################################################

print_step "Шаг 3: Замена файлов..."

cd "$GIT_REPO_PATH"

# Remove old files (except .git, .env, node_modules)
print_step "Удаление старых файлов..."
find . -maxdepth 1 ! -name '.' ! -name '..' ! -name '.git' ! -name '.env' ! -name 'node_modules' -exec rm -rf {} + 2>/dev/null || true

# Copy new files
print_step "Копирование новых файлов..."
cp -r "$HOME/Downloads/${PROJECT_NAME}-temp"/* . 2>/dev/null || true
cp -r "$HOME/Downloads/${PROJECT_NAME}-temp"/.[!.]* . 2>/dev/null || true

# Restore .env
if [ -f "$HOME/Downloads/${PROJECT_NAME}.env.backup" ]; then
    cp "$HOME/Downloads/${PROJECT_NAME}.env.backup" .env
    print_success ".env восстановлен"
fi

print_success "Файлы заменены"

###############################################################################
# Step 4: Install Dependencies
###############################################################################

print_step "Шаг 4: Установка зависимостей..."

npm install

PACKAGE_COUNT=$(ls node_modules | wc -l | tr -d ' ')
print_success "Установлено пакетов: $PACKAGE_COUNT"

###############################################################################
# Step 5: Build Check
###############################################################################

print_step "Шаг 5: Проверка build..."

npm run build

print_success "Build успешен"

###############################################################################
# Step 6: Git Status Check
###############################################################################

print_step "Шаг 6: Проверка изменений..."

# Проверим что .env не в списке изменений
if git status --porcelain | grep -q "\.env"; then
    print_error ".env в списке изменений - ОПАСНО!"
    echo ""
    echo "🚨 Выполните:"
    echo "   git reset HEAD .env"
    echo "   echo '.env' >> .gitignore"
    exit 1
fi

print_success ".env не в списке изменений"

TOTAL_CHANGES=$(git status --porcelain | wc -l | tr -d ' ')
print_success "Изменений: $TOTAL_CHANGES файлов"

if [ "$TOTAL_CHANGES" -eq "0" ]; then
    print_warning "Нет изменений для commit"
    echo ""
    echo "✅ Проект уже синхронизирован"
    exit 0
fi

###############################################################################
# Step 7: Show Changes
###############################################################################

print_step "Шаг 7: Показываем изменения..."

echo ""
echo "📊 Измененные файлы:"
git status --short | head -20
echo ""

if [ "$TOTAL_CHANGES" -gt "20" ]; then
    echo "   ... и ещё $((TOTAL_CHANGES - 20)) файлов"
    echo ""
fi

###############################################################################
# Step 8: Commit
###############################################################################

print_step "Шаг 8: Создание commit..."

git add .

COMMIT_MESSAGE="feat: sync from bolt.new - $(date +%Y-%m-%d\ %H:%M)"

git commit -m "$COMMIT_MESSAGE"

print_success "Commit создан: $COMMIT_MESSAGE"

###############################################################################
# Step 9: Pull Before Push
###############################################################################

print_step "Шаг 9: Проверка удалённого репозитория..."

git fetch origin

# Check if there are remote changes
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u} 2>/dev/null || echo "")
BASE=$(git merge-base @ @{u} 2>/dev/null || echo "")

if [ -n "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    if [ "$LOCAL" = "$BASE" ]; then
        print_warning "Удалённый репозиторий обновился, делаем pull..."
        git pull origin main --rebase
        print_success "Rebase завершён"
    else
        print_error "Есть конфликты с удалённым репозиторием"
        echo ""
        echo "🔧 Выполните вручную:"
        echo "   git pull origin main --rebase"
        echo "   # Разрешите конфликты"
        echo "   git push origin main"
        exit 1
    fi
else
    print_success "Удалённый репозиторий актуален"
fi

###############################################################################
# Step 10: Push to GitHub
###############################################################################

print_step "Шаг 10: Push на GitHub..."

git push origin main

print_success "Push завершён"

###############################################################################
# Step 11: Cleanup
###############################################################################

print_step "Шаг 11: Очистка..."

rm -rf "$HOME/Downloads/${PROJECT_NAME}-temp"
rm "$HOME/Downloads/${PROJECT_NAME}.env.backup" 2>/dev/null || true

print_success "Временные файлы удалены"

###############################################################################
# Final Summary
###############################################################################

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ СИНХРОНИЗАЦИЯ ЗАВЕРШЕНА УСПЕШНО${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📊 Статистика:"
echo "   • Изменений: $TOTAL_CHANGES файлов"
echo "   • Пакетов: $PACKAGE_COUNT"
echo "   • Backup: ~/$BACKUP_NAME"
echo ""
echo "🔗 Ссылки:"
echo "   • GitHub: $GITHUB_REPO"
echo "   • Локально: $GIT_REPO_PATH"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Проверьте GitHub: $GITHUB_REPO"
echo "   2. Убедитесь что .env не виден на GitHub"
echo "   3. Проверьте что все файлы на месте"
echo "   4. Удалите backup через несколько дней: rm -rf ~/$BACKUP_NAME"
echo ""
echo -e "${GREEN}Удачи! 🚀${NC}"
echo ""

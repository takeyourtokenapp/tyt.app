# Take Your Token - Landing Page Deployment Guide

## Обзор

Production-ready landing page для проекта TYT (Take Your Token) - предтечи платформы Digital Miners.

### Технологии

- React 18 + TypeScript
- Vite
- Tailwind CSS
- Lucide React (иконки)

## Локальная разработка

### Установка зависимостей

```bash
npm install
```

### Запуск dev сервера

```bash
npm run dev
```

Приложение будет доступно по адресу: `http://localhost:5173`

### Сборка для production

```bash
npm run build
```

Готовые файлы будут в папке `dist/`

## Деплой на Hostinger

### Шаг 1: Подготовка файлов

1. Выполните сборку проекта:
```bash
npm run build
```

2. Все необходимые файлы находятся в папке `dist/`

### Шаг 2: Загрузка на Hostinger

#### Вариант A: Через File Manager

1. Войдите в панель управления Hostinger
2. Перейдите в File Manager
3. Найдите корневую папку вашего домена `takeyourtoken.app` (обычно `public_html`)
4. Загрузите все содержимое папки `dist/` в корневую папку сайта
5. Убедитесь, что файл `index.html` находится в корне

#### Вариант B: Через FTP

1. Используйте FTP клиент (FileZilla, Cyberduck и т.д.)
2. Подключитесь к вашему хостингу:
   - Host: ftp.takeyourtoken.app (или IP из панели Hostinger)
   - Username: ваш FTP логин
   - Password: ваш FTP пароль
3. Перейдите в папку `public_html` или корневую папку домена
4. Загрузите все файлы из папки `dist/`

### Шаг 3: Настройка DNS (если еще не настроено)

1. Войдите в панель управления доменом
2. Настройте A-запись:
   - Type: A
   - Name: @ (или оставьте пустым)
   - Value: IP адрес сервера Hostinger
   - TTL: 14400 (или автоматически)

3. Настройте CNAME для www (опционально):
   - Type: CNAME
   - Name: www
   - Value: takeyourtoken.app
   - TTL: 14400

### Шаг 4: Настройка .htaccess (для Single Page Application)

Создайте файл `.htaccess` в корне сайта со следующим содержимым:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>

# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
  ExpiresByType text/javascript "access plus 1 month"
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html
  AddOutputFilterByType DEFLATE text/css
  AddOutputFilterByType DEFLATE text/javascript
  AddOutputFilterByType DEFLATE application/javascript
  AddOutputFilterByType DEFLATE application/json
</IfModule>
```

### Шаг 5: Проверка

1. Откройте https://takeyourtoken.app в браузере
2. Проверьте, что все секции загружаются корректно
3. Проверьте адаптивность на мобильных устройствах
4. Проверьте навигацию по якорным ссылкам

## Структура файлов на хостинге

После деплоя структура должна выглядеть так:

```
public_html/ (или корень домена)
├── index.html
├── favicon.svg
├── assets/
│   ├── index-[hash].css
│   └── index-[hash].js
└── .htaccess
```

## Troubleshooting

### Проблема: Сайт не загружается

**Решение:**
- Проверьте, что `index.html` находится в правильной папке
- Проверьте права доступа к файлам (должны быть 644)
- Проверьте логи ошибок в панели Hostinger

### Проблема: Навигация не работает

**Решение:**
- Убедитесь, что файл `.htaccess` создан и содержит правила выше
- Проверьте, что mod_rewrite включен на сервере

### Проблема: Стили не загружаются

**Решение:**
- Проверьте, что папка `assets/` загружена целиком
- Проверьте пути к файлам в `index.html`
- Очистите кэш браузера

## Обновление сайта

1. Внесите изменения в код
2. Выполните `npm run build`
3. Удалите старую папку `assets/` на хостинге
4. Загрузите новые файлы из `dist/`
5. Очистите кэш CDN (если используется)

## SEO

Сайт уже оптимизирован для SEO:
- Meta теги (title, description, keywords)
- Open Graph теги для социальных сетей
- Twitter Card теги
- Canonical URL
- Семантическая разметка HTML
- Адаптивный дизайн

## Безопасность

Рекомендуется добавить в `.htaccess`:

```apache
# Security headers
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-XSS-Protection "1; mode=block"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
```

## Мониторинг

После деплоя рекомендуется:
1. Добавить Google Analytics (если необходимо)
2. Настроить Yandex.Metrica (если необходимо)
3. Проверить сайт в Google Search Console
4. Настроить мониторинг uptime

## Контакты

По вопросам технической поддержки обращайтесь к администраторам проекта TYT.

# ЧЕКЛИСТ ПЕРЕД ПУБЛИКАЦИЕЙ TYT PLATFORM

Используйте этот чеклист для быстрой проверки перед deployment.

---

## PRE-DEPLOYMENT (обязательно!)

### Supabase Configuration
- [ ] Site URL изменен на `https://takeyourtoken.app`
- [ ] Все redirect URLs добавлены
- [ ] Email templates проверены (нет localhost)
- [ ] CORS origins настроены
- [ ] Password policy определена (HIBP вкл/выкл)

### Environment Variables
- [ ] `.env` файл существует
- [ ] `VITE_SUPABASE_URL` правильный
- [ ] `VITE_SUPABASE_ANON_KEY` правильный
- [ ] Нет service_role key в `.env`

### Code Quality
- [ ] `npm run build` успешен
- [ ] Нет TypeScript ошибок
- [ ] Нет console errors в dev режиме
- [ ] Все images загружаются
- [ ] Dark/Light theme работает

---

## LOCAL TESTING

### Landing Page
- [ ] https://localhost:5173 загружается
- [ ] aOi сова отображается
- [ ] Orbital coins анимируются
- [ ] Stats cards видны
- [ ] Footer links работают

### Authentication
- [ ] Signup форма работает
- [ ] Password hints отображаются
- [ ] Login работает
- [ ] Dashboard загружается после login
- [ ] Logout работает

### Database
- [ ] Profile данные загружаются
- [ ] Можно обновить profile
- [ ] Нет RLS ошибок

---

## BUILD VERIFICATION

### Build Process
- [ ] `rm -rf dist node_modules/.vite` выполнен
- [ ] `npm run build` завершился успешно
- [ ] `dist/` folder создана
- [ ] `dist/index.html` существует
- [ ] `dist/assets/` folder существует

### Build Output
- [ ] CSS bundle < 200 KB
- [ ] JS bundle < 900 KB
- [ ] Total size < 1.2 MB
- [ ] Нет критических warnings

### Preview Test
- [ ] `npm run preview` запущен
- [ ] http://localhost:4173 работает
- [ ] Все функции работают как в dev

---

## DEPLOYMENT

### Hosting
- [ ] Deployment provider выбран (Vercel/Netlify/Custom)
- [ ] `dist/` folder загружен
- [ ] Environment variables настроены
- [ ] Custom domain подключен

### DNS
- [ ] A/CNAME records настроены
- [ ] DNS propagation проверена (`dig takeyourtoken.app`)
- [ ] SSL certificate активен
- [ ] HTTPS работает

---

## POST-DEPLOYMENT

### Functional Tests
- [ ] https://takeyourtoken.app загружается
- [ ] Signup работает
- [ ] Login работает
- [ ] Dashboard загружается
- [ ] Database queries работают
- [ ] Email links корректны (не localhost)

### Performance
- [ ] Page load < 3s
- [ ] Lighthouse score > 85
- [ ] No 404 errors
- [ ] Mobile responsive

### Browser Tests
- [ ] Chrome Desktop
- [ ] Chrome Mobile
- [ ] Firefox
- [ ] Safari Desktop
- [ ] Safari iOS

---

## MONITORING

### Setup
- [ ] Uptime monitoring настроен
- [ ] Error tracking настроен (Sentry)
- [ ] Analytics настроен (GA/Plausible)
- [ ] Supabase monitoring alerts настроены

### Verification
- [ ] Uptime monitor pinging
- [ ] Errors отслеживаются
- [ ] Analytics собирает данные

---

## SECURITY

### Checks
- [ ] Security headers настроены
- [ ] RLS enabled на всех tables
- [ ] Нет secrets в коде
- [ ] `.env` в `.gitignore`
- [ ] Rate limiting активен

---

## BACKUP

### Backups
- [ ] Code в Git репозитории
- [ ] Release tag создан (v1.0.0)
- [ ] Environment variables сохранены безопасно
- [ ] Database backup стратегия определена

---

## ROLLBACK PLAN

### Готовность
- [ ] Предыдущий working deployment доступен
- [ ] Rollback процедура понятна
- [ ] Backup доступен если нужен

---

## DOCUMENTATION

### Updated
- [ ] README.md обновлен
- [ ] PRODUCTION_READINESS.md прочитан
- [ ] API documentation актуальна
- [ ] Environment variables документированы

---

## FINAL CHECK

### Before Going Live
- [ ] Все пункты выше отмечены ✅
- [ ] Team проинформирована о запуске
- [ ] Support channels готовы
- [ ] Marketing materials готовы (опционально)

---

## LAUNCH DAY

### Go Live
- [ ] Final deployment выполнен
- [ ] DNS переключен на production
- [ ] Smoke tests пройдены
- [ ] Monitoring работает
- [ ] Team on standby for first 2 hours

### Post-Launch (first 24 hours)
- [ ] Monitor error logs
- [ ] Monitor uptime
- [ ] Check user signups
- [ ] Respond to issues quickly
- [ ] Gather initial feedback

---

**КОГДА ВСЕ ОТМЕЧЕНО - ВЫ ГОТОВЫ К ЗАПУСКУ! 🚀**

# TYT Platform - Недостающие элементы и инструменты
**Дата**: 13 декабря 2024

## 📊 Сводка

Этот документ содержит список всех функций, таблиц базы данных и инструментов, которые **созданы в базе данных**, но **не имеют полного UI** или **не интегрированы** в приложение.

---

## 🗄️ База данных: Таблицы БЕЗ полного UI

### 1. **Bitcoin Ecosystem** (Частично реализовано)

**Таблицы**:
- `bitcoin_transactions` (20+ полей)
- `bitcoin_addresses` (30+ полей)
- `bitcoin_utxos`
- `bitcoin_fee_estimates`
- `lightning_channels`
- `lightning_invoices`
- `liquid_transactions`

**Что есть**:
- Базовая поддержка депозитов BTC
- Генерация адресов

**Что НЕ реализовано**:
- ❌ Детальный просмотр транзакций Bitcoin
- ❌ UTXO менеджмент
- ❌ Fee estimation UI
- ❌ Lightning Network interface
  - Открытие/закрытие каналов
  - Отправка через Lightning
  - Invoice генерация
- ❌ Liquid Network transfers
- ❌ PSBT (Partially Signed Bitcoin Transactions)
- ❌ Multi-sig wallet UI
- ❌ Replace-by-fee (RBF)

**Приоритет**: Средний (для advanced users)

---

### 2. **Cross-Chain Bridge** (НЕ реализовано)

**Таблицы**:
- `cross_chain_transfers`

**Поля**:
- from_blockchain, to_blockchain
- bridge_provider (Wormhole)
- source_tx_hash, destination_tx_hash
- status tracking

**Что НЕ реализовано**:
- ❌ UI для cross-chain переводов
- ❌ Выбор цепочек from/to
- ❌ Bridge fee калькулятор
- ❌ Status tracking UI
- ❌ Wormhole интеграция

**Приоритет**: Высокий (ключевая функция multi-chain)

---

### 3. **Internal Swap System** (НЕ реализовано)

**Таблицы**:
- `custodial_internal_swaps`

**Функционал**:
- Swap между активами в кастодиальном кошельке
- Rate provider: internal/external
- Swap fees

**Что НЕ реализовано**:
- ❌ Swap UI interface
- ❌ Price quotes
- ❌ Slippage settings
- ❌ Swap history view
- ❌ Rate comparison

**Приоритет**: Высокий (удобство для пользователей)

---

### 4. **Game Clans & Wars** (НЕ реализовано)

**Таблицы**:
- `game_clans` (16 полей)
- `game_clan_members`
- `game_tournaments`
- `game_tournament_participants`
- `game_tournament_rewards`

**Функционал**:
- Создание кланов
- Clan rankings
- Hashrate wars
- Tournaments с BTC/TYT наградами
- Clan member ranks (Private → Leader)

**Что НЕ реализовано**:
- ❌ Clan creation UI
- ❌ Clan list/search
- ❌ Join clan interface
- ❌ Clan dashboard
- ❌ Tournament system
- ❌ Battle/war interface
- ❌ Clan leaderboards

**Приоритет**: Средний (геймификация)

---

### 5. **Fiat On/Off-Ramp** (НЕ реализовано)

**Таблицы**:
- `fiat_transactions`

**Функционал**:
- Покупка крипты за фиат (USD, EUR)
- Продажа крипты за фиат
- Payment providers (Stripe, MoonPay, etc.)
- Payment methods (card, bank)

**Что НЕ реализовано**:
- ❌ Buy crypto с карты
- ❌ Sell crypto за фиат
- ❌ Payment provider интеграция
- ❌ KYC для fiat

**Приоритет**: Высокий (accessibility)

---

### 6. **KYC Document Management** (Частично реализовано)

**Таблицы**:
- `kyc_documents`

**Типы документов**:
- passport, id_card, drivers_license
- proof_of_address, selfie

**Что есть**:
- `kyc_verifications` status

**Что НЕ реализовано**:
- ❌ Document upload UI
- ❌ Document viewer для админа
- ❌ Approval/rejection workflow
- ❌ Document types selection
- ❌ Re-upload после rejection

**Приоритет**: Высокий (compliance)

---

### 7. **Academy Quests** (НЕ реализовано)

**Таблицы**:
- `academy_quests` (4 квеста в БД)
- `academy_quest_completions`

**Типы квестов**:
- platform_action (купить майнер, сделать депозит)
- social_engagement (Twitter follow, Telegram join)
- educational (пройти трек)
- community (пригласить друзей)

**Награды**:
- XP + TYT tokens

**Что НЕ реализовано**:
- ❌ Quest list UI
- ❌ Quest progress tracking
- ❌ Social verification
- ❌ Quest rewards claim
- ❌ Quest completion notifications

**Приоритет**: Средний (engagement)

---

### 8. **NFT Collections** (НЕ реализовано)

**Таблицы**:
- `nft_collections`

**Функционал**:
- Коллекции майнеров (разные серии)
- Floor price tracking
- Rarity tiers
- Collection stats

**Что НЕ реализовано**:
- ❌ Collections list
- ❌ Collection detail page
- ❌ Rarity information
- ❌ Collection analytics

**Приоритет**: Низкий

---

### 9. **Marketplace Offers** (Частично реализовано)

**Таблицы**:
- `marketplace_offers`

**Функционал**:
- Предложения на листинги
- Bidding system
- Offer expiry
- Accept/reject

**Что НЕ реализовано**:
- ❌ Make offer UI
- ❌ View offers on listing
- ❌ Accept/reject offers
- ❌ Offer notifications
- ❌ Counter-offers

**Приоритет**: Средний

**Файл существует**: `src/pages/app/MarketplaceActions.tsx` (НЕ в роутах!)

---

### 10. **Community Announcements** (НЕ реализовано)

**Таблицы**:
- `community_announcements`

**Функционал**:
- Системные объявления
- Targeted announcements (по VIP, по региону)
- Priority levels
- Время показа

**Что НЕ реализовано**:
- ❌ Announcements banner/modal
- ❌ Admin создание announcements
- ❌ Targeting logic
- ❌ Dismiss tracking

**Приоритет**: Средний

---

### 11. **GoBoxes & Loot System** (НЕ реализовано)

**Таблицы**:
- `goboxes`
- `gobox_drops`

**Функционал**:
- Лутбоксы с майнерами/аватарами
- Rarity system
- Probability based drops

**Что НЕ реализовано**:
- ❌ GoBox store
- ❌ Opening animation
- ❌ Drop rewards
- ❌ Drop history

**Приоритет**: Низкий

---

### 12. **Foundation Grants** (Частично реализовано)

**Таблицы**:
- `foundation_grants`
- `foundation_grant_applications`
- `foundation_campaigns`

**Что есть**:
- `GrantApplicationForm` component

**Что НЕ реализовано**:
- ❌ Grant list public view
- ❌ Application status tracking
- ❌ Admin grant approval
- ❌ Campaign management
- ❌ Campaign donation tracking

**Приоритет**: Высокий (transparency)

---

### 13. **Donation Receipts NFT** (НЕ реализовано)

**Таблицы**:
- `foundation_donation_receipts`

**Функционал**:
- Soulbound NFT certificates
- Tax deduction receipts
- On-chain proof

**Что НЕ реализовано**:
- ❌ Auto-generate после donation
- ❌ Download PDF
- ❌ View NFT receipt
- ❌ Blockchain mint

**Приоритет**: Средний

---

### 14. **Referral Earnings Detail** (Частично реализовано)

**Таблицы**:
- `referral_earnings`

**Что есть**:
- Basic referral tracking
- `ReferralDashboard`

**Что НЕ реализовано**:
- ❌ Detailed earnings breakdown
- ❌ Commission по event type
- ❌ Payment history
- ❌ Withdrawal earnings

**Приоритет**: Средний

---

### 15. **User Discount System Detail** (Частично реализовано)

**Таблицы**:
- `user_discounts`

**Функционал**:
- Aggregated discount view
- TYT balance-based discount
- veTYT discount
- Service button
- VIP discount

**Что НЕ реализовано**:
- ❌ Discount calculator UI
- ❌ "Days covered" visualization
- ❌ Discount breakdown chart
- ❌ History of applied discounts

**Приоритет**: Низкий (есть в maintenance)

---

### 16. **Wallet Sync Logs** (НЕ реализовано)

**Таблицы**:
- `wallet_sync_logs`
- `connected_wallets`

**Функционал**:
- Sync между external wallet и custodial
- Sync history
- Error tracking

**Что НЕ реализовано**:
- ❌ External wallet connection UI
- ❌ Manual sync button
- ❌ Sync status
- ❌ Sync logs viewer

**Приоритет**: Средний

---

### 17. **Daily Withdrawal Tracking** (Реализовано в backend)

**Таблицы**:
- `daily_withdrawal_tracking`

**Функционал**:
- Limits based on KYC
- Daily quotas

**Что есть**:
- Backend enforcement

**Что может быть улучшено**:
- ⚠️ Daily limit progress bar
- ⚠️ "Reset in X hours" countdown

**Приоритет**: Низкий

---

### 18. **Reward Snapshots** (Backend only)

**Таблицы**:
- `reward_snapshots`
- `daily_rewards_summary`

**Функционал**:
- Daily aggregate stats
- Historical data
- Network hashrate snapshots

**Что НЕ реализовано**:
- ❌ Analytics dashboard
- ❌ Historical charts
- ❌ Network stats page

**Приоритет**: Низкий

---

### 19. **Service Button Activations** (Частично реализовано)

**Таблицы**:
- `service_button_activations`

**Что есть**:
- Service button в Dashboard

**Что НЕ реализовано**:
- ❌ Activation history
- ❌ Total savings view
- ❌ Streak tracking

**Приоритет**: Низкий

---

### 20. **Token Burn Events** (Частично реализовано)

**Таблицы**:
- `token_burn_events`
- `burn_pool`
- `burn_mint_distributions`

**Что есть**:
- `BurnReports` page

**Что может быть улучшено**:
- ⚠️ Live burn countdown
- ⚠️ Burn animation/visual
- ⚠️ CharityMint distribution view

**Приоритет**: Средний

---

## 📄 Файлы БЕЗ интеграции

### 1. **MarketplaceActions.tsx**
- Существует: ✅
- В роутах: ❌
- Функционал: Actions для marketplace (buy, list, cancel)

**Решение**: Добавить роут `/app/marketplace/:id/actions`

---

## 🔧 Database Functions БЕЗ UI

### Bitcoin Functions
- `generate_bitcoin_address()` - ✅ используется
- `monitor_bitcoin_deposits()` - edge function
- `calculate_bitcoin_fees()` - нужен UI

### Charity Staking
- `create_charity_stake()` - ✅ используется
- `withdraw_charity_stake()` - ✅ используется
- `calculate_charity_rewards()` - автомат

### veTYT Governance
- `create_vetyt_lock()` - ✅ используется
- `unlock_vetyt()` - ✅ используется
- `calculate_voting_power()` - ✅ используется
- `create_proposal()` - ✅ используется
- `cast_vote()` - ✅ используется
- `finalize_proposal()` - нужен admin UI

### Cross-chain
- ❌ Нет функций для bridge (нужна интеграция)

### Swap
- ❌ Нет функций для internal swap

---

## 🎯 Приоритизация реализации

### 🔴 ВЫСОКИЙ приоритет

1. **Cross-Chain Bridge UI** - ключевая multi-chain функция
2. **Internal Swap System** - удобство для пользователей
3. **Fiat On-Ramp** - доступность для новых пользователей
4. **KYC Document Upload** - compliance требование
5. **Foundation Grants Public View** - прозрачность
6. **MarketplaceActions route** - уже написано, нужно просто подключить

### 🟡 СРЕДНИЙ приоритет

7. **Bitcoin Advanced Features** (Lightning, Liquid, PSBT)
8. **Academy Quests System**
9. **Marketplace Offers/Bidding**
10. **Community Announcements**
11. **Game Clans** (если хотим геймификацию)
12. **Donation Receipt NFTs**
13. **Burn Event Visuals**

### 🟢 НИЗКИЙ приоритет

14. **NFT Collections Page**
15. **GoBoxes/Loot System**
16. **Wallet Sync UI**
17. **Advanced Analytics**
18. **Service Button History**
19. **Discount Breakdown**

---

## 📊 Статистика

**Таблицы в БД**: 60+
**Таблицы с полным UI**: ~35 (58%)
**Таблицы БЕЗ UI**: ~25 (42%)

**Основные категории недостающего**:
- Bitcoin Advanced (5 таблиц)
- Cross-chain/Swap (2 таблицы)
- Game/Clans (5 таблиц)
- Fiat (1 таблица)
- Quests (2 таблицы)
- NFT системы (3 таблицы)
- Community (2 таблицы)
- Admin tools (5 таблиц)

---

## 🚀 Рекомендации

### Для Production MVP
**Достаточно текущего состояния** + следующие 6 фич:

1. Cross-Chain Bridge
2. Internal Swap
3. KYC Document Upload
4. MarketplaceActions route
5. Fiat On-Ramp (опционально)
6. Foundation Grants View

### Для Full Launch
Добавить:
- Academy Quests
- Game Clans
- Bitcoin Advanced
- Marketplace Offers

---

**Вывод**: Платформа имеет **солидную базу (58% покрытия)**, но для полной реализации экосистемы нужно добавить еще **6-10 ключевых UI компонентов**.

# 🧠 PhantomCoinServer — Серверная часть

## 🔧 Общая информация о проекте

**PhantomCoinServer** — это backend-приложение, обслуживающее клиентскую часть PhantomCoin. Оно обеспечивает авторизацию, работу с базами данных, безопасное хранение данных, общение с внешними API, обработку cron-задач, обмен сообщениями через Kafka и взаимодействие с Telegram-ботом.

### ✨ Основной функционал:

- **🔐 Аутентификация пользователей** (JWT + bcrypt/argon2).
- **📡 Поддержка WebSocket-соединений** через ws.
- **⏲ Планировщик задач через node-cron** (например, обновление курсов валют).
- **🛡 Безопасное хранение паролей** (argon2, bcrypt).
- **📬 Интеграция с Telegram-ботом** через telegraf.
- **🗃 Подключение к БД**(mysql2, redis).
- **💬 Интеграция с Kafka** — обмен сообщениями между микросервисами.
- **🧠 Интеграция с OpenAI SDK** — AI-алгоритмы для прогнозов.
- **🍪 Обработка cookies и CORS.**
- **🌎 REST API на базе Express.**

---

## ⚙️ Используемые технологии

| Пакет / Библиотека           | Назначение                                                             |
|------------------------------|------------------------------------------------------------------------|
| express                      | Основной фреймворк для построения API                                  |
| jsonwebtoken                 | Аутентификация через токены                                            |
| argon2, bcrypt               | Хеширование паролей                                                    |
| mysql2                       | Работа с MySQL базой данных                                            |
| redis                        | Хранилище сессий и кэша                                                |
| dotenv                       | Управление переменными окружения                                       |
| cors                         | Обработка междоменных запросов                                         |
| cookie-parser                | Работа с HTTP cookies                                                  |
| nodemon, ts-node-dev         | Горячая перезагрузка при разработке                                    |
| node-cron                    | Планировщик задач                                                      |
| telegraf                     | Telegram-бот                                                           |
| kafkajs                      | Обмен сообщениями через Kafka                                          |
| openai                       | Интеграция с OpenAI API                                                |
| qrcode                       | Генерация QR-кодов                                                     |
| ws                           | WebSocket-сервер                                                       |
| axios                        | Запросы к внешним API                                                  |
| typescript                   | Статическая типизация                                                  |

---

## 🚀 Установка и запуск

```
# Установка
git clone https://github.com/LopatkoSaha/PhantomCoinServer.git
cd PhantomCoinApp
npm install

# Запуск в dev-режиме с hot-reload
npm run dev

# Сборка и запуск
npm run start

# Запуск контейнера через Docker Compose
npm run up

# Остановка контейнера
npm run down

```

## 🧱 Структура проекта

```
src/
├── controllers/      # Обработчики маршрутов
├── helpers/          # Вспомогательные функции
├── llmModels/        # Взаимодействие с AI
├── middlewares/      # Промежуточные функции Express
├── model/            # Работа с БД (в т.ч. миграции и подключения)
├── redisDb/          # Настройки Redis
├── routes/           # Определение маршрутов API
├── telegram/         # Взаимодействие с Telegram
├── types/            # Общие интерфейсы и типы
├── webSocket/        # WebSocket-сервер
├── cron.ts           # Cron-задачи (node-cron)
├── kafkaProducer.ts  # Настройки Kafka
└── index.ts          # Точка входа

```

## 📄 Авторство

* 👨‍💼 Руководитель проекта: [Andrey Lopatko](https://github.com/d00dde)

* 👨‍💻 Основной разработчик: [LopatkoSaha](https://github.com/LopatkoSaha)
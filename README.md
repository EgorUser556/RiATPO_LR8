Проект содержит автоматизированные UI-тесты для альтернативного задания лабораторной работы №8 по дисциплине РиАТПО. Тесты написаны на TypeScript и выполняются с помощью Selenium WebDriver, Jest и Google Chrome.
Тестируемое веб-приложение доступно по адресу `http://svyatoslav.biz/testlab/wt/`.

## Структура проекта

```text
code/
├── test/
│   └── wt.spec.ts        # основной набор автотестов
├── package.json          # зависимости и npm-скрипты
├── tsconfig.json         # конфигурация TypeScript
├── jest.config.ts        # конфигурация Jest
└── README.md             # описание проекта и инструкция по запуску
```

## Предварительные требования

Перед запуском необходимо установить:

- Node.js
- npm
- Google Chrome

## Установка зависимостей

Находясь в корне проекта, выполните:

```bash
npm install
```

Если TypeScript сообщает об отсутствии деклараций для Selenium WebDriver, необходимо дополнительно установить типы:

```bash
npm install -D @types/selenium-webdriver
```

Пакет `@types/selenium-webdriver` предоставляет TypeScript definitions для `selenium-webdriver`.

## Локальный запуск тестов

1. Откройте терминал в корневой папке проекта.
2. Убедитесь, что все зависимости установлены.
3. Выполните команду:

```bash
npm test
```

Jest запускается через npm-скрипт из `package.json`, а Selenium WebDriver открывает браузер Chrome и последовательно выполняет тесты.

## Очистка кэша Jest

Если после изменения тестов запускается старая версия файлов, можно очистить кэш Jest:

```bash
npx jest --clearCache
```

Опция `--clearCache` поддерживается CLI Jest и удаляет директорию кэша.
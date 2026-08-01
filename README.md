# TORRO BURGER

Статический сайт бургерной TORRO BURGER: видео-заставка, hero «CHERRY BURGER»,
меню из 76 позиций с фотографиями, корзина и адреса филиалов.

**Живой сайт:** https://cherry-crav.vercel.app

## Стек

Чистые HTML + CSS + JS, без сборки и без зависимостей.
Единственная библиотека — [Lenis](https://github.com/darkroomengineering/lenis)
для инерционного скролла (лежит файлом в `assets/js/`).

## Структура

```
index.html            главная: hero → меню → адреса → футер
menu/index.html       страница бургеров с карточками
contact/index.html    форма и адреса
spices/index.html     ингредиенты
assets/
  css/style.css       вся вёрстка и анимации
  js/cart.js          корзина (localStorage, ключ torro_cart)
  js/main.js          прелоадер, курсор, reveal-анимации, шторка переходов
  js/lenis.min.js
  fonts/              Modak + Mouse Memoirs (latin, latin-ext)
  img/                декор и hero
  img/menu/           76 фотографий блюд
  video/loader.mp4    заставка
```

## Запуск локально

```bash
python3 -m http.server 8124
```

Открывать через `http://localhost:8124/`, а не через `file://` —
иначе не работают абсолютные ссылки вида `/menu/`.

## Деплой

```bash
npx vercel deploy --prod --yes
```

Сборка не нужна — это статика, подойдёт любой хостинг
(Vercel, Netlify, GitHub Pages, Cloudflare Pages).

## Пересоздать сайт с нуля

В файле [`TORRO-BURGER-PROMPT.md`](TORRO-BURGER-PROMPT.md) лежит единый промпт:
его можно целиком вставить в Claude Code, и сайт соберётся заново — со скачиванием
всех ассетов и полным исходным кодом.

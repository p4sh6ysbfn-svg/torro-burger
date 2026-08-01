# TORRO BURGER

Сайт бургерной TORRO BURGER: видео-заставка, hero «CHERRY BURGER», меню из 76 позиций
с настоящими фотографиями блюд, корзина и адреса филиалов.

**Живой сайт:** https://cherry-crav.vercel.app

Репозиторий self-contained: код, все фотографии, шрифты и данные меню уже внутри.
Никаких API-ключей и внешних файлов не нужно.

## Запуск

Нужен только `git` и `python3` (он есть на macOS и Linux из коробки):

```bash
git clone https://github.com/ВАШ_ЛОГИН/torro-burger.git
cd torro-burger
python3 -m http.server 5173
```

Откроется на http://localhost:5173

Сборка не нужна — это чистые HTML + CSS + JS. Подойдёт любой другой статический
сервер (`npx serve`, `php -S localhost:5173`, Live Server в VS Code).
Только не открывайте `index.html` через `file://` — сломаются абсолютные ссылки
вида `/menu/` и не будет работать корзина.

## Страницы

| Путь | Что там |
|---|---|
| `/` | Главная: заставка → hero → меню (76 позиций) → адреса → футер |
| `/menu/` | Карточки шести хитов с фото и кнопкой «в корзину» |
| `/contact/` | Форма обратной связи и адреса |
| `/spices/` | Ингредиенты |

## Структура

```
index.html            главная
menu/ contact/ spices/  внутренние страницы
assets/
  css/style.css       вся вёрстка и анимации
  js/cart.js          корзина (localStorage, ключ torro_cart)
  js/main.js          прелоадер, курсор, reveal-анимации, шторка переходов
  js/lenis.min.js     инерционный скролл
  fonts/              Modak + Mouse Memoirs (latin, latin-ext)
  img/                декор и hero
  img/menu/           76 фотографий блюд
  video/loader.mp4    заставка
```

## Пересобрать сайт с нуля

В [`PROMPT.md`](PROMPT.md) лежит единый промпт: его можно целиком вставить
в Claude Code / Cursor, и сайт соберётся заново — со скачиванием всех ассетов
и полным исходным кодом. Там же спецификация дизайна, чек-лист проверки
и инструкция по деплою.

## Деплой

```bash
npx vercel deploy --prod --yes
```

Или Netlify / GitHub Pages / Cloudflare Pages — сборка не требуется.

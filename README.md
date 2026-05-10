# 🦹 Hero Intelligence File

A villain-themed superhero database web app. Browse, search, sort, and paginate through 500+ superheroes using data from the [Superhero API](https://github.com/akabab/superhero-api).

## Preview

> Dark-themed table with hero icons, powerstats, biography details, and alignment badges (good / neutral / bad).

## Features

- 🔍 **Search** by name, full name, race, gender, place of birth, or alignment — filters on every keystroke
- 🔃 **Sort** by any column — click a header to sort, click again to reverse; missing values always sort last
- 📄 **Pagination** — choose between 10 / 20 / 50 / 100 results per page, or show all
- 🖼️ Hero icons, metric height/weight, and color-coded alignment badges
- Fully client-side — no backend needed

## Tech Stack

- HTML / CSS / Vanilla JavaScript
- Data: [akabab/superhero-api](https://github.com/akabab/superhero-api) (fetched at runtime)
- Fonts: Bebas Neue + Share Tech Mono (Google Fonts)

## File Structure

```
superhero-project/
├── index.html       # Page structure and table skeleton
├── style.css        # Dark villain theme, table and pagination styles
└── main.js          # Fetch, filter, sort, Pagination, render logic
```

## Getting Started

No build step or dependencies required. Just open `index.html` in a browser, or serve it locally:

```bash
# Using Node.js (npx)
npx serve .
```

Then visit `http://localhost:3000`.

## How It Works

The app follows a simple pipeline on every state change:

```
allHeroes → filterHeroes() → sortHeroes() → paginateHeroes() → renderTable()
```

All state (search query, sort column, current page, page size) is stored in global variables. Any interaction calls `update()`, which runs the full pipeline and re-renders the table.

## Data Source

Hero data is fetched at runtime from:
```
https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json
```
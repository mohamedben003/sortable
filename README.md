# 🦹 Hero Intelligence File — Project Scaffold

## File Structure

```
superhero-project/
├── index.html   ← Mohamed (HTML skeleton, shared structure)
├── style.css    ← Mohamed (base styles, everyone can extend)
├── main.js      ← Everyone works here (clearly labelled sections)
└── README.md    ← This file
```

---

##  Foundation

**Files:** `index.html`, `style.css`, `main.js` (top section)

**Responsibilities:**
- [x] HTML skeleton with table headers and controls layout
- [x] `fetch()` call — loads all heroes into `allHeroes[]`
- [x] `renderTable(heroes)` — renders rows into `<tbody>`
- [x] `update()` — the central pipeline: filter → sort → paginate → render
- [x] `getSortValue(hero, col)` helper for Karima

**Do NOT change:** the `filterHeroes()`, `sortHeroes()`, `paginateHeroes()` signatures — the pipeline depends on them.

---

## 👤 Hichame — Search

**Section in `main.js`:** look for `Hichame — SEARCH`

**Your TODO list:**
1. [x] Implement `filterHeroes(heroes)`:
   - Filter by `searchQuery` on selected field (default: `name`) (case-insensitive)
   - If `searchQuery` is empty, return all heroes unchanged
   - Return the filtered array (do NOT mutate input)
2. [x] Hook up the `#search-input` element:
   - Listen for `"input"` events
   - Update the global `searchQuery` variable
   - Reset `currentPage = 1`
   - Call `update()`
3. [x] **New Feature:** Added `#search-field-select` to specify the field for searching (Name, Full Name, Race, etc.).

**Key rule:** Search should filter on every single keystroke, no button needed.

---

## 👤 Mohamed — Pagination

**Section in `main.js`:** look for `Mohamed — PAGINATION`

**Your TODO list:**
1. Implement `paginateHeroes(heroes)`:
   - Use global `pageSize` (number or `"all"`) and `currentPage`
   - Slice the array to return only the current page's heroes
   - While here, also update the pagination UI: total pages, prev/next buttons
   - Return the sliced array (do NOT mutate input)
2. Hook up `#page-size-select`:
   - On `"change"`, update `pageSize`, reset `currentPage = 1`, call `update()`
3. Add Prev/Next buttons inside `#pagination` div:
   - On click, change `currentPage`, call `update()`
   - Disable Prev on page 1, disable Next on last page
   - Show current page info: e.g. "Page 2 of 14"

**Key rule:** Default page size is 20 (already set in HTML and in `pageSize` variable).

---

## 👤 Karima — Sort

**Section in `main.js`:** look for `Karima — SORT`

**Your TODO list:**
1. Implement `sortHeroes(heroes)`:
   - Sort a **copy** (`[...heroes]`) — never mutate input
   - Use global `sortCol` and `sortDir` (`"asc"` or `"desc"`)
   - Missing values (`null`, `"null"`, `"-"`, `""`) always go **last**
   - Numeric strings (`"82 kg"`, `"185 cm"`) → extract number and sort numerically
   - Everything else → sort alphabetically, case-insensitive
   - Use the provided `getSortValue(hero, col)` helper to get a value by column name
2. Hook up column header clicks on all `<th>` elements:
   - Same column clicked again → toggle `sortDir` between `"asc"` and `"desc"`
   - New column clicked → set `sortCol` to that column, reset `sortDir = "asc"`
   - Call `update()` after each change
3. Update visual indicators:
   - Active `<th>` gets class `sorted-asc` or `sorted-desc` (CSS already handles ↑↓)
   - Remove those classes from all other headers

**Key rule:** On first load, table is sorted by `name` ascending (already set in state variables).

---

## Shared Rules

- **Never modify `allHeroes`** — it's the source of truth
- **Always call `update()`** to trigger a re-render — never call `renderTable()` directly
- **Reset `currentPage = 1`** whenever search or sort changes (Hichame and C do this)
- Each of your functions receives an array and **returns** a new array — no side effects on the data

// =============================================================
// main.js — Superhero Table Project
// Leader: owns this file, fetch, renderTable(), and update()
// =============================================================

// ─────────────────────────────────────────
// SHARED STATE (everyone reads these)
// ─────────────────────────────────────────
let allHeroes = [];       // raw data from API — never modify this
let searchQuery = "";     // set by Hichame
let sortCol = "name";     // set by Karima
let sortDir = "asc";      // set by Karima ("asc" | "desc")
let currentPage = 1;      // set by Mohamed
let pageSize = 20;        // set by Mohamed (number or "all")


// ─────────────────────────────────────────
// LEADER: FETCH DATA
// ─────────────────────────────────────────
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json())
  .then((heroes) => {
    allHeroes = heroes;
    update(); // first render once data is ready
  });


// ─────────────────────────────────────────
// LEADER: CENTRAL UPDATE PIPELINE
// This is the only function that triggers a re-render.
// Everyone calls update() when their state changes.
// ─────────────────────────────────────────
function update() {
  let result = allHeroes;

  result = filterHeroes(result);    // Hichame
  result = sortHeroes(result);      // Karima
  result = paginateHeroes(result);  // Mohamed (also updates pagination UI)

  renderTable(result);
}


// ─────────────────────────────────────────
// LEADER: RENDER TABLE ROWS
// Receives the final processed array and displays it.
// ─────────────────────────────────────────
function renderTable(heroes) {
  const tbody = document.getElementById("heroes-tbody");
  tbody.innerHTML = "";

  heroes.forEach((hero) => {
    const tr = document.createElement("tr");

    // Helper: returns "—" if value is missing/null/empty/"null"/"-"
    function val(v) {
      if (v === null || v === undefined || v === "" || v === "null" || v === "-") return "—";
      return v;
    }

    // Height: use second entry (metric), e.g. ["6'1\"", "185 cm"] → "185 cm"
    const height = Array.isArray(hero.appearance.height)
      ? val(hero.appearance.height[1])
      : val(hero.appearance.height);

    // Weight: use second entry (metric), e.g. ["181 lb", "82 kg"] → "82 kg"
    const weight = Array.isArray(hero.appearance.weight)
      ? val(hero.appearance.weight[1])
      : val(hero.appearance.weight);

    tr.innerHTML = `
      <td><img src="${hero.images.xs}" alt="${hero.name}" class="hero-icon" /></td>
      <td>${val(hero.name)}</td>
      <td>${val(hero.biography.fullName)}</td>
      <td>${val(hero.powerstats.intelligence)}</td>
      <td>${val(hero.powerstats.strength)}</td>
      <td>${val(hero.powerstats.speed)}</td>
      <td>${val(hero.powerstats.durability)}</td>
      <td>${val(hero.powerstats.power)}</td>
      <td>${val(hero.powerstats.combat)}</td>
      <td>${val(hero.appearance.race)}</td>
      <td>${val(hero.appearance.gender)}</td>
      <td>${height}</td>
      <td>${weight}</td>
      <td>${val(hero.biography.placeOfBirth)}</td>
      <td class="alignment ${val(hero.biography.alignment)}">${val(hero.biography.alignment)}</td>
    `;

    tbody.appendChild(tr);
  });
}


// =============================================================
// Hichame — SEARCH
// File: search.js (or add your code below this comment block)
// =============================================================

function filterHeroes(heroes) {
  // TODO (Hichame):
  // Filter `heroes` by `searchQuery` (case-insensitive match on hero.name).
  // Return the filtered array.
  // Do NOT modify allHeroes.
  // Example:
  //   if (!searchQuery) return heroes;
  //   return heroes.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return heroes; // placeholder — replace with real filter
}

// TODO (Hichame):
// 1. Get the #search-input element
// 2. Listen for "input" events
// 3. Update `searchQuery` and `currentPage = 1` then call update()


// =============================================================
// Karima — SORT
// File: sort.js (or add your code below this comment block)
// =============================================================

function sortHeroes(heroes) {
  // TODO (Karima):
  // Sort a COPY of `heroes` using `sortCol` and `sortDir`.
  // Rules:
  //   - Missing values (null, "null", "-", "") always go LAST
  //   - Numeric strings like "82 kg" or "185 cm" sort numerically
  //   - Everything else sorts alphabetically (case-insensitive)
  //   - "asc" = A→Z / low→high, "desc" = Z→A / high→low
  // Return the sorted copy. Do NOT mutate the input array.

  return [...heroes]; // placeholder — replace with real sort
}

// TODO (Karima):
// 1. Get all <th> elements in #heroes-table thead
// 2. Add "click" listeners to each
//    → if clicking the same col: toggle sortDir
//    → if clicking a new col: set sortCol, reset sortDir to "asc"
//    → call update()
// 3. Update visual indicators (↑ ↓) on the active <th>
// Helper to extract a sortable value from a hero by column name:
function getSortValue(hero, col) {
  switch (col) {
    case "name":         return hero.name;
    case "fullName":     return hero.biography.fullName;
    case "intelligence": return hero.powerstats.intelligence;
    case "strength":     return hero.powerstats.strength;
    case "speed":        return hero.powerstats.speed;
    case "durability":   return hero.powerstats.durability;
    case "power":        return hero.powerstats.power;
    case "combat":       return hero.powerstats.combat;
    case "race":         return hero.appearance.race;
    case "gender":       return hero.appearance.gender;
    case "height":       return Array.isArray(hero.appearance.height) ? hero.appearance.height[1] : hero.appearance.height;
    case "weight":       return Array.isArray(hero.appearance.weight) ? hero.appearance.weight[1] : hero.appearance.weight;
    case "placeOfBirth": return hero.biography.placeOfBirth;
    case "alignment":    return hero.biography.alignment;
    default:             return null;
  }
}

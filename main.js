// ─────────────────────────────────────────
// SHARED STATE (everyone reads these)
// ─────────────────────────────────────────
let allHeroes = [];       // raw data from API — never modify this
let searchQuery = "";     // set by Hichame
let searchField = "name";   // field to search in
let sortCol = "name";     // set by Karima
let sortDir = "asc";      // set by Karima ("asc" | "desc")
let currentPage = 1;      // set by Mohamed
let pageSize = 20;        // set by Mohamed (number or "all")


// ─────────────────────────────────────────
// FETCH DATA
// ─────────────────────────────────────────
fetch("https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json")
  .then((response) => response.json())
  .then((heroes) => {
    allHeroes = heroes;
    update(); // first render once data is ready
  });


// ─────────────────────────────────────────
// CENTRAL UPDATE PIPELINE
// This is the only function that triggers a re-render.
// Everyone calls update() when their state changes.
// ─────────────────────────────────────────
function update() {
  let result = allHeroes;

  result = filterHeroes(result);    // Hichame
  result = sortHeroes(result);      // Karima
  result = paginateHeroes(result);  // Mohamed (also updates pagination UI)

  updateSortIndicators();
  renderTable(result);
}


// ─────────────────────────────────────────
// RENDER TABLE ROWS
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
  if (!searchQuery) return heroes;
  const query = searchQuery.toLowerCase();
  
  return heroes.filter(hero => {
    const value = getSortValue(hero, searchField);
    if (value === null || value === undefined) return false;
    return String(value).toLowerCase().includes(query);
  });
}

const searchInput = document.getElementById("search-input");
searchInput.addEventListener("input", (e) => {
  searchQuery = e.target.value;
  currentPage = 1;
  update();
});

const searchFieldSelect = document.getElementById("search-field-select");
searchFieldSelect.addEventListener("change", (e) => {
  searchField = e.target.value;
  currentPage = 1;
  update();
});

function sortHeroes(heroes) {
  function isMissing(value) {
    return value === null || value === undefined || value === "" || value === "null" || value === "-";
  }

  function parseSortable(value) {
    if (typeof value === "number") return { type: "number", value };
    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed) {
        const num = convertValue(trimmed);
        if (!Number.isNaN(num)) return { type: "number", value: num };
      }
      return { type: "string", value: trimmed.toLowerCase() };
    }
    return { type: "string", value: String(value).toLowerCase() };
  }


}

// Initialize sorting UI once DOM is ready and before first render.
initSortHeaders();

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

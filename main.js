// SHARED STATE 

let allHeroes = [];       
let searchQuery = "";     
let searchField = "name"; 
let sortCol = "name";     
let sortDir = "asc";      
let currentPage = 1;      
let pageSize = 20;        


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

  result = filterHeroes(result);    
  result = sortHeroes(result);      
  result = paginateHeroes(result); 

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

  let sorted = [...heroes];

  sorted.sort((a, b) => {
    const rawA = getSortValue(a, sortCol);
    const rawB = getSortValue(b, sortCol);

    const missingA = isMissing(rawA);
    const missingB = isMissing(rawB);
    if (missingA || missingB) {
      if (missingA && missingB) return 0;
      return missingA ? 1 : -1;
    }

    const aItem = parseSortable(rawA);
    const bItem = parseSortable(rawB);

    let comparison = 0;
    if (aItem.type === "number" && bItem.type === "number") {
      comparison = aItem.value - bItem.value;
    } else {
      comparison = String(aItem.value).localeCompare(String(bItem.value), undefined, {
        numeric: false,
        sensitivity: "base"
      });
    }

    return sortDir === "asc" ? comparison : -comparison;
  });

  return sorted;
}

function convertValue(value) {
  value = value.toLowerCase();

  if (value.includes("tons")) {
    return parseFloat(value) * 1000;
  }

  if (value.includes("meters")) {
    return parseFloat(value) * 100;
  }

  return parseFloat(value);
}


function updateSortIndicators() {
  const headers = document.querySelectorAll("#heroes-table thead th");
  headers.forEach((th) => {
    if (!th.dataset.label) {
      th.dataset.label = th.textContent.replace(/[↑↓]/g, "").trim();
    }
    const label = th.dataset.label;
    const col = th.dataset.col;

    if (col === sortCol) {
      const arrow = sortDir === "asc" ? "↑" : "↓";
      th.textContent = `${label} ${arrow}`;
    } else {
      th.textContent = label;
    }
  });
}

function initSortHeaders() {
  const headers = document.querySelectorAll("#heroes-table thead th");
  headers.forEach((th) => {
    const col = th.dataset.col;
    if (!col || col === "icon") return;

    th.addEventListener("click", () => {
      if (sortCol === col) {
        sortDir = sortDir === "asc" ? "desc" : "asc";
      } else {
        sortCol = col;
        sortDir = "asc";
      }
      update();
    });
  });
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

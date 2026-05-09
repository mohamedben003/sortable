function paginateHeroes(heroes) {
  // "all" means show everything, no slicing needed
  if (pageSize === "all") {
    document.getElementById("page-info").textContent = `${heroes.length} results`;
    document.getElementById("prev-btn").disabled = true;
    document.getElementById("next-btn").disabled = true;
    return heroes;
  }

  const totalPages = Math.ceil(heroes.length / pageSize);

  // Safety: if current page is beyond last page, snap back
  if (currentPage > totalPages) currentPage = 1;

  const start = (currentPage - 1) * pageSize; // e.g. page 2, size 20 → start = 20
  const end = start + pageSize;               // → end = 40
  const pageHeroes = heroes.slice(start, end); // heroes[20] to heroes[39]

  // Update button states
  document.getElementById("prev-btn").disabled = currentPage === 1;
  document.getElementById("next-btn").disabled = currentPage === totalPages;

  // Update page info text
  document.getElementById("page-info").textContent = `Page ${currentPage} of ${totalPages}`;

  return pageHeroes;
}

const pageSizeSelect = document.getElementById("page-size-select");

pageSizeSelect.addEventListener("change", function () {
  const value = pageSizeSelect.value;

  if (value === "all") {
    pageSize = "all";
  } else {
    pageSize = Number(value); // "20" → 20
  }

  currentPage = 1; // go back to first page
  update();
});


// Building the Buttons :  
const pagination = document.getElementById("pagination");

const prevBtn = document.createElement("button");
prevBtn.textContent = "← Prev";
prevBtn.id = "prev-btn";

const pageInfo = document.createElement("span");
pageInfo.id = "page-info";

const nextBtn = document.createElement("button");
nextBtn.textContent = "Next →";
nextBtn.id = "next-btn";

pagination.appendChild(prevBtn);
pagination.appendChild(pageInfo);
pagination.appendChild(nextBtn);

prevBtn.addEventListener("click", function () {
  currentPage = currentPage - 1;
  update();
});

nextBtn.addEventListener("click", function () {
  currentPage = currentPage + 1;
  update();
});
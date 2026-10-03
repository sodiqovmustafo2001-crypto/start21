const themeBtn = document.getElementById("themeBtn");
const languageSelect = document.getElementById("languageSelect");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeBtn.textContent = "☀";
} else {
  themeBtn.textContent = "☾";
}

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");

  localStorage.setItem("theme", isDark ? "dark" : "light");

  themeBtn.textContent = isDark ? "☀" : "☾";
});

const savedLanguage = localStorage.getItem("language") || "uz";

languageSelect.value = savedLanguage;

const filterButtons = document.querySelectorAll(
  "#courseFilters button"
);

const courseCards = document.querySelectorAll(
  ".course-card-new"
);

const emptyCourses = document.getElementById("emptyCourses");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((item) => {
      item.classList.remove("active");
    });

    button.classList.add("active");

    const filter = button.dataset.filter;

    let visibleCount = 0;

    courseCards.forEach((card) => {
      const category = card.dataset.category;

      if (filter === "all" || category === filter) {
        card.style.display = "block";
        visibleCount++;
      } else {
        card.style.display = "none";
      }
    });

    emptyCourses.style.display =
      visibleCount === 0 ? "block" : "none";
  });
});

const searchInput = document.getElementById("courseSearch");
const searchButton = document.getElementById("searchButton");

function searchCourses() {
  const searchValue = searchInput.value
    .toLowerCase()
    .trim();

  let visibleCount = 0;

  courseCards.forEach((card) => {
    const text = card.textContent.toLowerCase();

    if (text.includes(searchValue)) {
      card.style.display = "block";
      visibleCount++;
    } else {
      card.style.display = "none";
    }
  });

  emptyCourses.style.display =
    visibleCount === 0 ? "block" : "none";
}

searchButton.addEventListener("click", searchCourses);

searchInput.addEventListener("input", searchCourses);

function updateThemeColor() {
  let meta = document.querySelector('meta[name="theme-color"]');

  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  meta.content = document.body.classList.contains("dark") ? "#07101f" : "#ffffff";
}

updateThemeColor();

const themeColorButton = document.getElementById("themeBtn");

if (themeColorButton) {
  themeColorButton.addEventListener("click", updateThemeColor);
}

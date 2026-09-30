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

const translations = {
  uz: {
    home: "Bosh sahifa",
    courses: "Kurslar",
    teachers: "Ustozlar",
    results: "Natijalar",
    branches: "Filiallar",
    about: "Biz haqimizda",
    login: "Kirish",
    register: "Ro‘yxatdan o‘tish",
    heroBadge: "O‘QUV MARKAZI",
    heroTitle: "Orzularingga START21 bilan erish!",
    heroText:
      "Zamonaviy ta’lim, tajribali ustozlar va individual yondashuv. Kelajagingni biz bilan qur.",
    coursesButton: "Kurslarni ko‘rish",
    contactButton: "Biz bilan bog‘lanish"
  },

  ru: {
    home: "Главная",
    courses: "Курсы",
    teachers: "Преподаватели",
    results: "Результаты",
    branches: "Филиалы",
    about: "О нас",
    login: "Войти",
    register: "Регистрация",
    heroBadge: "УЧЕБНЫЙ ЦЕНТР",
    heroTitle: "Достигай своих целей вместе со START21!",
    heroText:
      "Современное обучение, опытные преподаватели и индивидуальный подход. Строй своё будущее вместе с нами.",
    coursesButton: "Посмотреть курсы",
    contactButton: "Связаться с нами"
  },

  en: {
    home: "Home",
    courses: "Courses",
    teachers: "Teachers",
    results: "Results",
    branches: "Branches",
    about: "About us",
    login: "Login",
    register: "Register",
    heroBadge: "EDUCATION CENTER",
    heroTitle: "Reach your goals with START21!",
    heroText:
      "Modern education, experienced teachers and an individual approach. Build your future with us.",
    coursesButton: "View courses",
    contactButton: "Contact us"
  }
};

const languageElements = {
  home: document.querySelector('.nav__link[href="#home"]'),
  courses: document.querySelector('.nav__link[href="pages/courses.html"]'),
  teachers: document.querySelector('.nav__link[href="#teachers"]'),
  results: document.querySelector('.nav__link[href="#results"]'),
  branches: document.querySelector('.nav__link[href="#branches"]'),
  about: document.querySelector('.nav__link[href="#about"]'),
  login: document.querySelector(".login-btn"),
  register: document.querySelector(".register-btn"),
  heroBadge: document.querySelector(".hero__badge"),
  heroTitle: document.querySelector(".hero h1"),
  heroText: document.querySelector(".hero__content > p"),
  coursesButton: document.querySelector(".hero__buttons .btn--primary"),
  contactButton: document.querySelector(".hero__buttons .btn--secondary")
};

function changeLanguage(language) {
  const translation = translations[language];

  if (!translation) {
    return;
  }

  languageElements.home.textContent = translation.home;
  languageElements.courses.textContent = translation.courses;
  languageElements.teachers.textContent = translation.teachers;
  languageElements.results.textContent = translation.results;
  languageElements.branches.textContent = translation.branches;
  languageElements.about.textContent = translation.about;
  languageElements.login.textContent = translation.login;
  languageElements.register.textContent = translation.register;
  languageElements.heroBadge.textContent = translation.heroBadge;
  languageElements.heroText.textContent = translation.heroText;
  languageElements.coursesButton.textContent = translation.coursesButton;
  languageElements.contactButton.textContent = translation.contactButton;

  languageElements.heroTitle.innerHTML = translation.heroTitle.replace(
    "START21",
    "<span>START21</span>"
  );

  localStorage.setItem("language", language);
}

const savedLanguage = localStorage.getItem("language") || "uz";

languageSelect.value = savedLanguage;

changeLanguage(savedLanguage);

languageSelect.addEventListener("change", () => {
  changeLanguage(languageSelect.value);
});
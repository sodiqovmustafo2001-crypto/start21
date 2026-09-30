```javascript
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
    nav: [
      "Bosh sahifa",
      "Kurslar",
      "Ustozlar",
      "Natijalar",
      "Filiallar",
      "Biz haqimizda"
    ],
    login: "Kirish",
    register: "Ro‘yxatdan o‘tish",

    heroBadge: "O‘QUV MARKAZI",
    heroTitle: "Orzularingga START21 bilan erish!",
    heroText:
      "Zamonaviy ta’lim, tajribali ustozlar va individual yondashuv. Kelajagingni biz bilan qur.",
    heroPrimary: "Kurslarni ko‘rish",
    heroSecondary: "Biz bilan bog‘lanish",

    heroStats: [
      "Yillik tajriba",
      "Mamnun o‘quvchilar",
      "Filiallar",
      "Natija ko‘rsatkichi"
    ],

    student: "IELTS o‘quvchisi",
    progress: "Umumiy progress",
    ielts: "IELTS",
    grammar: "Grammar",
    reading: "Reading",
    goal: "Maqsad",
    result: "Natija",
    excellent: "Excellent",

    coursesLabel: "TA’LIM YO‘NALISHLARI",
    coursesTitle: "O‘zingga mos kursni tanla",
    coursesText:
      "Maqsadingizga mos yo‘nalishni tanlang va rivojlanishni bugundan boshlang.",

    courseNames: [
      "General English",
      "IELTS",
      "Intensive IELTS",
      "CEFR",
      "SAT",
      "DTM va milliy sertifikat"
    ],

    courseDescriptions: [
      "4 bosqich, har biri 2 oy. Ingliz tilining asosiy bilimlari",
      "4 oy. IELTS dan 6.5 va undan yuqori natija uchun",
      "4 oy. Qisqa muddatda kamida 5.5 ball uchun",
      "4 oy. Qisqa muddatda daraja sertifikati uchun",
      "Xalqaro imtihonga tayyorlov",
      "Oliy ta’limga kirish uchun tayyorlov"
    ],

    details: "Batafsil →",

    aboutLabel: "NIMA UCHUN START21?",
    aboutTitle: "Bilim ol. Rivojlan. Natijaga erish.",
    aboutText:
      "Biz o‘quvchini shunchaki darsga qatnashuvchi emas, o‘z maqsadi bor shaxs sifatida ko‘ramiz.",

    aboutTitles: [
      "Individual yondashuv",
      "Doimiy monitoring",
      "Mentorlik tizimi"
    ],

    aboutDescriptions: [
      "Har bir o‘quvchining rivojlanishini kuzatamiz.",
      "Testlar va natijalar orqali progressni o‘lchaymiz.",
      "O‘quvchi maqsadiga yetguncha qo‘llab-quvvatlanadi."
    ],

    teachersLabel: "USTOZLAR VA TIZIM",
    teachersTitle: "Nega aynan bizni tanlashadi?",
    teachersText:
      "Sifatli ta’lim uchun kerak bo‘lgan hamma narsa bir joyda.",

    teacherTitles: [
      "Tajribali o‘qituvchilar",
      "Mentorlik tizimi",
      "Online tizim",
      "Haftalik monitoring"
    ],

    teacherDescriptions: [
      "IELTS, CEFR, SAT bo‘yicha xalqaro sertifikatga ega ustozlar.",
      "Har bir o‘quvchiga individual yondashuv. Savollar javobsiz qolmaydi.",
      "O‘quvchilar har kunlik natijalarini online kuzatib borishadi.",
      "Haftalik testlar, oraliq baholash va ustozlar feedbacki."
    ],

    resultsLabel: "NATIJALAR",
    resultsTitle: "Harakat natija beradi",
    resultsText:
      "O‘quvchilarimizning rivojlanishi biz uchun eng muhim ko‘rsatkich.",

    resultNames: [
      "O‘quvchi",
      "Yillik tajriba",
      "Filial",
      "Natija"
    ],

    branchesLabel: "FILIALLAR",
    branchesTitle: "Bizning filiallar",
    branchesText: "O‘zingizga eng yaqin manzilda ta’lim oling.",
    branchText: "START21 o‘quv markazi filiali",

    ctaLabel: "KEYINGI QADAM SENIKI",
    ctaTitle: "Kelajagingni bugundan boshlagin.",
    ctaText:
      "O‘zingga mos kursni top va START21 bilan rivojlanishni boshlagin.",
    ctaButton: "Bepul testni boshlash →"
  },

  ru: {
    nav: [
      "Главная",
      "Курсы",
      "Преподаватели",
      "Результаты",
      "Филиалы",
      "О нас"
    ],
    login: "Войти",
    register: "Регистрация",

    heroBadge: "УЧЕБНЫЙ ЦЕНТР",
    heroTitle: "Достигай своих целей вместе со START21!",
    heroText:
      "Современное обучение, опытные преподаватели и индивидуальный подход. Строй своё будущее вместе с нами.",
    heroPrimary: "Посмотреть курсы",
    heroSecondary: "Связаться с нами",

    heroStats: [
      "Лет опыта",
      "Довольных учеников",
      "Филиалов",
      "Показатель результата"
    ],

    student: "Ученик IELTS",
    progress: "Общий прогресс",
    ielts: "IELTS",
    grammar: "Грамматика",
    reading: "Чтение",
    goal: "Цель",
    result: "Результат",
    excellent: "Отлично",

    coursesLabel: "НАПРАВЛЕНИЯ ОБУЧЕНИЯ",
    coursesTitle: "Выберите подходящий курс",
    coursesText:
      "Выберите направление, соответствующее вашей цели, и начните развиваться уже сегодня.",

    courseNames: [
      "General English",
      "IELTS",
      "Интенсивный IELTS",
      "CEFR",
      "SAT",
      "DTM и национальный сертификат"
    ],

    courseDescriptions: [
      "4 уровня, каждый по 2 месяца. Основы английского языка",
      "4 месяца. Для результата IELTS 6.5 и выше",
      "4 месяца. Для получения минимум 5.5 баллов за короткий срок",
      "4 месяца. Для получения сертификата уровня за короткий срок",
      "Подготовка к международному экзамену",
      "Подготовка для поступления в высшее учебное заведение"
    ],

    details: "Подробнее →",

    aboutLabel: "ПОЧЕМУ START21?",
    aboutTitle: "Учись. Развивайся. Достигай результата.",
    aboutText:
      "Мы видим в ученике не просто участника занятий, а человека со своими целями.",

    aboutTitles: [
      "Индивидуальный подход",
      "Постоянный мониторинг",
      "Система наставничества"
    ],

    aboutDescriptions: [
      "Следим за развитием каждого ученика.",
      "Измеряем прогресс с помощью тестов и результатов.",
      "Поддерживаем ученика до достижения его цели."
    ],

    teachersLabel: "ПРЕПОДАВАТЕЛИ И СИСТЕМА",
    teachersTitle: "Почему выбирают именно нас?",
    teachersText:
      "Всё необходимое для качественного обучения в одном месте.",

    teacherTitles: [
      "Опытные преподаватели",
      "Система наставничества",
      "Онлайн-система",
      "Еженедельный мониторинг"
    ],

    teacherDescriptions: [
      "Преподаватели с международными сертификатами по IELTS, CEFR и SAT.",
      "Индивидуальный подход к каждому ученику. Ни один вопрос не останется без ответа.",
      "Ученики могут отслеживать свои ежедневные результаты онлайн.",
      "Еженедельные тесты, промежуточная оценка и обратная связь преподавателей."
    ],

    resultsLabel: "РЕЗУЛЬТАТЫ",
    resultsTitle: "Усилия дают результат",
    resultsText:
      "Развитие наших учеников — самый важный показатель для нас.",

    resultNames: [
      "Учеников",
      "Лет опыта",
      "Филиала",
      "Результат"
    ],

    branchesLabel: "ФИЛИАЛЫ",
    branchesTitle: "Наши филиалы",
    branchesText: "Получайте образование в ближайшем к вам филиале.",
    branchText: "Филиал учебного центра START21",

    ctaLabel: "СЛЕДУЮЩИЙ ШАГ ЗА ТОБОЙ",
    ctaTitle: "Начни своё будущее уже сегодня.",
    ctaText:
      "Найди подходящий курс и начни развиваться вместе со START21.",
    ctaButton: "Начать бесплатный тест →"
  },

  en: {
    nav: [
      "Home",
      "Courses",
      "Teachers",
      "Results",
      "Branches",
      "About us"
    ],
    login: "Login",
    register: "Register",

    heroBadge: "EDUCATION CENTER",
    heroTitle: "Reach your goals with START21!",
    heroText:
      "Modern education, experienced teachers and an individual approach. Build your future with us.",
    heroPrimary: "View courses",
    heroSecondary: "Contact us",

    heroStats: [
      "Years of experience",
      "Happy students",
      "Branches",
      "Success rate"
    ],

    student: "IELTS student",
    progress: "Overall progress",
    ielts: "IELTS",
    grammar: "Grammar",
    reading: "Reading",
    goal: "Goal",
    result: "Result",
    excellent: "Excellent",

    coursesLabel: "LEARNING DIRECTIONS",
    coursesTitle: "Choose the right course for you",
    coursesText:
      "Choose a direction that matches your goal and start improving today.",

    courseNames: [
      "General English",
      "IELTS",
      "Intensive IELTS",
      "CEFR",
      "SAT",
      "DTM and National Certificate"
    ],

    courseDescriptions: [
      "4 levels, 2 months each. Essential English language skills",
      "4 months. For an IELTS score of 6.5 or higher",
      "4 months. For achieving at least 5.5 in a short period",
      "4 months. For obtaining a language level certificate",
      "Preparation for an international exam",
      "Preparation for university admission"
    ],

    details: "Learn more →",

    aboutLabel: "WHY START21?",
    aboutTitle: "Learn. Develop. Achieve results.",
    aboutText:
      "We see every student not simply as a participant, but as a person with their own goals.",

    aboutTitles: [
      "Individual approach",
      "Continuous monitoring",
      "Mentoring system"
    ],

    aboutDescriptions: [
      "We track the development of every student.",
      "We measure progress through tests and results.",
      "We support students until they achieve their goals."
    ],

    teachersLabel: "TEACHERS AND SYSTEM",
    teachersTitle: "Why do students choose us?",
    teachersText:
      "Everything you need for quality education in one place.",

    teacherTitles: [
      "Experienced teachers",
      "Mentoring system",
      "Online system",
      "Weekly monitoring"
    ],

    teacherDescriptions: [
      "Teachers with international certificates in IELTS, CEFR and SAT.",
      "An individual approach to every student. No question remains unanswered.",
      "Students can track their daily results online.",
      "Weekly tests, progress assessment and teacher feedback."
    ],

    resultsLabel: "RESULTS",
    resultsTitle: "Hard work brings results",
    resultsText:
      "The development of our students is the most important indicator for us.",

    resultNames: [
      "Students",
      "Years of experience",
      "Branches",
      "Success rate"
    ],

    branchesLabel: "BRANCHES",
    branchesTitle: "Our branches",
    branchesText: "Get your education at the branch closest to you.",
    branchText: "START21 education center branch",

    ctaLabel: "THE NEXT STEP IS YOURS",
    ctaTitle: "Start building your future today.",
    ctaText:
      "Find the right course and start developing with START21.",
    ctaButton: "Start free test →"
  }
};

function setText(element, text) {
  if (element) {
    element.textContent = text;
  }
}

function changeLanguage(language) {
  const t = translations[language];

  if (!t) {
    return;
  }

  const navLinks = document.querySelectorAll(".nav__link");

  navLinks.forEach((link, index) => {
    if (t.nav[index]) {
      link.textContent = t.nav[index];
    }
  });

  setText(document.querySelector(".login-btn"), t.login);
  setText(document.querySelector(".register-btn"), t.register);

  setText(document.querySelector(".hero__badge"), t.heroBadge);

  const heroTitle = document.querySelector(".hero h1");

  if (heroTitle) {
    heroTitle.innerHTML = t.heroTitle.replace(
      "START21",
      "<span>START21</span>"
    );
  }

  setText(
    document.querySelector(".hero__content > p"),
    t.heroText
  );

  setText(
    document.querySelector(".hero__buttons .btn--primary"),
    t.heroPrimary
  );

  setText(
    document.querySelector(".hero__buttons .btn--secondary"),
    t.heroSecondary
  );

  const heroStats = document.querySelectorAll(".hero__stats .stat span");

  heroStats.forEach((item, index) => {
    if (t.heroStats[index]) {
      item.textContent = t.heroStats[index];
    }
  });

  setText(
    document.querySelector(".hero-card__student div span"),
    t.student
  );

  setText(
    document.querySelector(".progress-box__top span"),
    t.progress
  );

  const heroCourses = document.querySelectorAll(
    ".hero-card__courses > div span"
  );

  if (heroCourses[0]) {
    heroCourses[0].textContent = t.ielts;
  }

  if (heroCourses[1]) {
    heroCourses[1].textContent = t.grammar;
  }

  if (heroCourses[2]) {
    heroCourses[2].textContent = t.reading;
  }

  const floatingCards = document.querySelectorAll(
    ".floating-card"
  );

  if (floatingCards[0]) {
    setText(floatingCards[0].querySelector("strong"), t.goal);
  }

  if (floatingCards[2]) {
    setText(floatingCards[2].querySelector("strong"), t.result);
    setText(floatingCards[2].querySelector("small"), t.excellent);
  }

  const sectionHeadings = document.querySelectorAll(
    ".section-heading"
  );

  if (sectionHeadings[0]) {
    setText(
      sectionHeadings[0].querySelector("span"),
      t.coursesLabel
    );

    setText(
      sectionHeadings[0].querySelector("h2"),
      t.coursesTitle
    );

    setText(
      sectionHeadings[0].querySelector("p"),
      t.coursesText
    );
  }

  const courseCards = document.querySelectorAll(
    ".courses-section:not(#teachers):not(#branches) .course-card"
  );

  courseCards.forEach((card, index) => {
    if (t.courseNames[index]) {
      setText(card.querySelector("h3"), t.courseNames[index]);
    }

    if (t.courseDescriptions[index]) {
      setText(card.querySelector("p"), t.courseDescriptions[index]);
    }

    setText(card.querySelector("span"), t.details);
  });

  setText(
    document.querySelector(".about-section .section-label"),
    t.aboutLabel
  );

  const aboutTitle = document.querySelector(".about-section h2");

  if (aboutTitle) {
    aboutTitle.innerHTML = t.aboutTitle.replace(
      "START21",
      "<span>START21</span>"
    );
  }

  setText(
    document.querySelector(".about-section .about__content > p"),
    t.aboutText
  );

  const aboutItems = document.querySelectorAll(".about-item");

  aboutItems.forEach((item, index) => {
    if (t.aboutTitles[index]) {
      setText(item.querySelector("h3"), t.aboutTitles[index]);
    }

    if (t.aboutDescriptions[index]) {
      setText(item.querySelector("p"), t.aboutDescriptions[index]);
    }
  });

  const aboutProgress = document.querySelector(
    ".dashboard-circle span"
  );

  setText(aboutProgress, "Progress");

  const lastResult = document.querySelector(
    ".dashboard-result span"
  );

  setText(lastResult, language === "uz" ? "So‘nggi natija" :
    language === "ru" ? "Последний результат" :
    "Latest result");

  const teacherSection = document.querySelector("#teachers");

  if (teacherSection) {
    setText(
      teacherSection.querySelector(".section-heading span"),
      t.teachersLabel
    );

    setText(
      teacherSection.querySelector(".section-heading h2"),
      t.teachersTitle
    );

    setText(
      teacherSection.querySelector(".section-heading p"),
      t.teachersText
    );

    const teacherCards = teacherSection.querySelectorAll(
      ".course-card"
    );

    teacherCards.forEach((card, index) => {
      if (t.teacherTitles[index]) {
        setText(card.querySelector("h3"), t.teacherTitles[index]);
      }

      if (t.teacherDescriptions[index]) {
        setText(card.querySelector("p"), t.teacherDescriptions[index]);
      }
    });
  }

  const resultsSection = document.querySelector("#results");

  if (resultsSection) {
    setText(
      resultsSection.querySelector(".section-heading span"),
      t.resultsLabel
    );

    setText(
      resultsSection.querySelector(".section-heading h2"),
      t.resultsTitle
    );

    setText(
      resultsSection.querySelector(".section-heading p"),
      t.resultsText
    );

    const resultCards = resultsSection.querySelectorAll(
      ".result-card span"
    );

    resultCards.forEach((item, index) => {
      if (t.resultNames[index]) {
        item.textContent = t.resultNames[index];
      }
    });
  }

  const branchesSection = document.querySelector("#branches");

  if (branchesSection) {
    setText(
      branchesSection.querySelector(".section-heading span"),
      t.branchesLabel
    );

    setText(
      branchesSection.querySelector(".section-heading h2"),
      t.branchesTitle
    );

    setText(
      branchesSection.querySelector(".section-heading p"),
      t.branchesText
    );

    const branchCards = branchesSection.querySelectorAll(
      ".course-card"
    );

    branchCards.forEach((card) => {
      setText(card.querySelector("p"), t.branchText);
    });
  }

  const cta = document.querySelector(".cta");

  if (cta) {
    setText(cta.querySelector("span"), t.ctaLabel);
    setText(cta.querySelector("h2"), t.ctaTitle);
    setText(cta.querySelector("p"), t.ctaText);
    setText(cta.querySelector("a"), t.ctaButton);
  }

  localStorage.setItem("language", language);
}

const savedLanguage =
  localStorage.getItem("language") || "uz";

languageSelect.value = savedLanguage;

changeLanguage(savedLanguage);

languageSelect.addEventListener("change", () => {
  changeLanguage(languageSelect.value);
});
```

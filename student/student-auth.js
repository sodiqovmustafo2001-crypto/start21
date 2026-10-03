function getStart21User() {
  try {
    return JSON.parse(localStorage.getItem("start21User")) || null;
  } catch {
    return null;
  }
}

function getStart21UserKey() {
  const user = getStart21User();

  if (!user) {
    return null;
  }

  return user.id || user.email;
}

function getStart21Results() {
  const userKey = getStart21UserKey();

  if (!userKey) {
    return {};
  }

  try {
    return JSON.parse(
      localStorage.getItem(`start21Results_${userKey}`) || "{}"
    ) || {};
  } catch {
    return {};
  }
}

function saveStart21Results(results) {
  const userKey = getStart21UserKey();

  if (!userKey) {
    return;
  }

  localStorage.setItem(
    `start21Results_${userKey}`,
    JSON.stringify(results)
  );
}

function getStart21Course() {
  const userKey = getStart21UserKey();

  if (!userKey) {
    return "IELTS";
  }

  return localStorage.getItem(`profileCourse_${userKey}`) || "IELTS";
}

function saveStart21Course(course) {
  const userKey = getStart21UserKey();

  if (!userKey) {
    return;
  }

  localStorage.setItem(`profileCourse_${userKey}`, course);
}   
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 5000;

const dataDir = path.join(__dirname, "data");
const usersFile = path.join(dataDir, "users.json");
const resultsFile = path.join(dataDir, "results.json");
const groupsFile = path.join(dataDir, "groups.json");
const attendanceFile = path.join(dataDir, "attendance.json");

app.use(cors());
app.use(express.json());

function ensureFile(filePath, defaultValue) {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, {
      recursive: true,
    });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), "utf8");
  }
}

ensureFile(usersFile, []);
ensureFile(resultsFile, {});
ensureFile(groupsFile, []);
ensureFile(attendanceFile, []);

function readJson(filePath, fallback) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function getUsers() {
  const users = readJson(usersFile, []);
  return Array.isArray(users) ? users : [];
}

function saveUsers(users) {
  writeJson(usersFile, users);
}

function getResults() {
  const results = readJson(resultsFile, {});
  return results && typeof results === "object" && !Array.isArray(results)
    ? results
    : {};
}

function saveResults(results) {
  writeJson(resultsFile, results);
}

function getGroups() {
  const groups = readJson(groupsFile, []);
  return Array.isArray(groups) ? groups : [];
}

function saveGroups(groups) {
  writeJson(groupsFile, groups);
}

function getAttendance() {
  const attendance = readJson(attendanceFile, []);
  return Array.isArray(attendance) ? attendance : [];
}

function saveAttendance(attendance) {
  writeJson(attendanceFile, attendance);
}

function publicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role || "student",
    groupIds: Array.isArray(user.groupIds) ? user.groupIds : [],
  };
}

function findUser(userId) {
  const users = getUsers();

  return users.find((user) => String(user.id) === String(userId));
}

function isTeacher(userId) {
  const user = findUser(userId);

  return Boolean(user && (user.role || "student") === "teacher");
}

function getTeacherGroups(teacherId) {
  return getGroups().filter(
    (group) => String(group.teacherId) === String(teacherId),
  );
}

function isTeacherOfGroup(teacherId, groupId) {
  const group = getGroups().find((item) => String(item.id) === String(groupId));

  if (!group) {
    return null;
  }

  if (String(group.teacherId) !== String(teacherId)) {
    return false;
  }

  return group;
}

function studentBelongsToGroup(studentId, groupId) {
  const student = findUser(studentId);

  if (!student) {
    return false;
  }

  const groupIds = Array.isArray(student.groupIds) ? student.groupIds : [];

  return groupIds.some((id) => String(id) === String(groupId));
}

function calculatePercentage(score, total) {
  if (
    score === undefined ||
    score === null ||
    total === undefined ||
    total === null ||
    Number(total) <= 0
  ) {
    return null;
  }

  const result = (Number(score) / Number(total)) * 100;

  if (!Number.isFinite(result)) {
    return null;
  }

  return Math.round(result);
}

function getStudentSkillPercentage(result) {
  if (!result) {
    return null;
  }

  if (
    result.percentage !== undefined &&
    result.percentage !== null &&
    result.percentage !== ""
  ) {
    const percentage = Number(result.percentage);

    return Number.isFinite(percentage) ? percentage : null;
  }

  return calculatePercentage(result.score, result.total);
}

function calculateStudentProgress(studentId) {
  const results = getResults();
  const studentResults = results[String(studentId)] || {};

  const types = ["listening", "reading", "writing", "speaking"];

  const scores = types
    .map((type) => getStudentSkillPercentage(studentResults[type]))
    .filter(
      (score) => score !== null && score !== undefined && !Number.isNaN(score),
    );

  const overall =
    scores.length > 0
      ? Math.round(
          scores.reduce((sum, score) => sum + score, 0) / scores.length,
        )
      : 0;

  const attendance = getAttendance().filter(
    (item) => String(item.studentId) === String(studentId),
  );

  const attendanceTotal = attendance.length;

  const attendancePresent = attendance.filter(
    (item) => item.status === "keldi",
  ).length;

  const attendancePercentage =
    attendanceTotal > 0
      ? Math.round((attendancePresent / attendanceTotal) * 100)
      : 0;

  return {
    overall,
    skills: {
      listening: getStudentSkillPercentage(studentResults.listening),
      reading: getStudentSkillPercentage(studentResults.reading),
      writing: getStudentSkillPercentage(studentResults.writing),
      speaking: getStudentSkillPercentage(studentResults.speaking),
    },
    attendance: {
      total: attendanceTotal,
      present: attendancePresent,
      percentage: attendancePercentage,
    },
  };
}

function normalizeResultPayload(body) {
  const {
    type,
    score,
    total,
    correct,
    percentage,
    comment,
    teacherId,
    groupId,
  } = body;

  let finalPercentage = percentage;

  if (
    finalPercentage === undefined &&
    score !== undefined &&
    total !== undefined
  ) {
    finalPercentage = calculatePercentage(score, total);
  }

  if (
    finalPercentage === undefined &&
    correct !== undefined &&
    total !== undefined
  ) {
    finalPercentage = calculatePercentage(correct, total);
  }

  return {
    type,
    score: score !== undefined && score !== "" ? Number(score) : undefined,
    total: total !== undefined && total !== "" ? Number(total) : undefined,
    correct:
      correct !== undefined && correct !== "" ? Number(correct) : undefined,
    percentage:
      finalPercentage !== undefined &&
      finalPercentage !== null &&
      finalPercentage !== ""
        ? Number(finalPercentage)
        : null,
    comment: comment !== undefined ? String(comment).trim() : "",
    teacherId: teacherId !== undefined ? Number(teacherId) : undefined,
    groupId: groupId !== undefined ? Number(groupId) : undefined,
  };
}

const allowedResultTypes = [
  "listening",
  "reading",
  "writing",
  "speaking",
  "mock",
];

const allowedAttendanceStatuses = ["keldi", "kelmadi", "sababli", "sababsiz"];

app.get("/", (req, res) => {
  res.json({
    message: "START21 Backend ishlayapti",
  });
});

app.post("/api/register", (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }

    const users = getUsers();

    const emailExists = users.some(
      (user) =>
        String(user.email).toLowerCase() === String(email).toLowerCase(),
    );

    if (emailExists) {
      return res.status(400).json({
        message: "Bu email allaqachon ro'yxatdan o'tgan",
      });
    }

    const newUser = {
      id: Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      password,
      role: "student",
      groupIds: [],
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    const results = getResults();

    results[String(newUser.id)] = {};

    saveResults(results);

    return res.status(201).json({
      message: "Ro'yxatdan o'tish muvaffaqiyatli",
      user: publicUser(newUser),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Serverda xatolik yuz berdi",
    });
  }
});

app.post("/api/login", (req, res) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        message: "Login va parolni kiriting",
      });
    }

    const users = getUsers();

    const user = users.find(
      (item) =>
        String(item.email).toLowerCase() === String(login).toLowerCase() ||
        String(item.phone) === String(login),
    );

    if (!user) {
      return res.status(401).json({
        message: "Email yoki telefon raqam topilmadi",
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Parol noto'g'ri",
      });
    }

    const results = getResults();

    return res.json({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      user: publicUser(user),
      results: results[String(user.id)] || {},
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Serverda xatolik yuz berdi",
    });
  }
});

app.get("/api/results/:userId", (req, res) => {
  try {
    const user = findUser(req.params.userId);

    if (!user) {
      return res.status(404).json({
        message: "Foydalanuvchi topilmadi",
      });
    }

    const results = getResults();

    return res.json({
      results: results[String(user.id)] || {},
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Natijalarni olishda xatolik",
    });
  }
});

app.post("/api/results/:userId", (req, res) => {
  try {
    const user = findUser(req.params.userId);

    if (!user) {
      return res.status(404).json({
        message: "Foydalanuvchi topilmadi",
      });
    }

    const { type, correct, total, score, percentage, comment } = req.body;

    if (!allowedResultTypes.includes(type)) {
      return res.status(400).json({
        message: "Noto'g'ri test turi",
      });
    }

    const results = getResults();

    const userKey = String(user.id);

    if (!results[userKey]) {
      results[userKey] = {};
    }

    let finalPercentage = percentage;

    if (
      finalPercentage === undefined &&
      score !== undefined &&
      total !== undefined
    ) {
      finalPercentage = calculatePercentage(score, total);
    }

    if (
      finalPercentage === undefined &&
      correct !== undefined &&
      total !== undefined
    ) {
      finalPercentage = calculatePercentage(correct, total);
    }

    results[userKey][type] = {
      correct:
        correct !== undefined && correct !== "" ? Number(correct) : undefined,
      total: total !== undefined && total !== "" ? Number(total) : undefined,
      score: score !== undefined && score !== "" ? Number(score) : undefined,
      percentage:
        finalPercentage !== undefined && finalPercentage !== null
          ? Number(finalPercentage)
          : null,
      comment: comment || "",
      updatedAt: new Date().toISOString(),
    };

    saveResults(results);

    return res.json({
      message: "Natija saqlandi",
      result: results[userKey][type],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Natijani saqlashda xatolik",
    });
  }
});

app.get("/api/profile/:userId", (req, res) => {
  try {
    const user = findUser(req.params.userId);

    if (!user) {
      return res.status(404).json({
        message: "Foydalanuvchi topilmadi",
      });
    }

    return res.json({
      user: publicUser(user),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Profilni olishda xatolik",
    });
  }
});

app.put("/api/profile/:userId", (req, res) => {
  try {
    const userId = String(req.params.userId);
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }

    const users = getUsers();

    const index = users.findIndex((item) => String(item.id) === userId);

    if (index === -1) {
      return res.status(404).json({
        message: "Foydalanuvchi topilmadi",
      });
    }

    const emailExists = users.some(
      (item, itemIndex) =>
        itemIndex !== index &&
        String(item.email).toLowerCase() === String(email).toLowerCase(),
    );

    if (emailExists) {
      return res.status(400).json({
        message: "Bu email boshqa foydalanuvchiga tegishli",
      });
    }

    users[index] = {
      ...users[index],
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
    };

    saveUsers(users);

    return res.json({
      message: "Profil yangilandi",
      user: publicUser(users[index]),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Profilni yangilashda xatolik",
    });
  }
});

app.get("/api/teacher/dashboard/:teacherId", (req, res) => {
  try {
    const teacherId = req.params.teacherId;

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const groups = getTeacherGroups(teacherId);

    const groupIds = groups.map((group) => String(group.id));

    const users = getUsers();

    const students = users.filter(
      (user) =>
        user.role !== "teacher" &&
        (user.groupIds || []).some((groupId) =>
          groupIds.includes(String(groupId)),
        ),
    );

    return res.json({
      teacher: publicUser(findUser(teacherId)),
      groups,
      studentCount: students.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Teacher dashboard xatosi",
    });
  }
});

app.post("/api/teacher/groups", (req, res) => {
  try {
    const { teacherId, name, course, level } = req.body;

    if (!teacherId || !name) {
      return res.status(400).json({
        message: "Teacher ID va guruh nomi kerak",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi guruh yarata oladi",
      });
    }

    const groups = getGroups();

    const newGroup = {
      id: Date.now(),
      name: String(name).trim(),
      course: course || "IELTS",
      level: level || "Intermediate",
      teacherId: Number(teacherId),
      studentIds: [],
      createdAt: new Date().toISOString(),
    };

    groups.push(newGroup);

    saveGroups(groups);

    return res.status(201).json({
      message: "Guruh yaratildi",
      group: newGroup,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Guruh yaratishda xatolik",
    });
  }
});

app.get("/api/teacher/groups", (req, res) => {
  try {
    const teacherId = req.query.teacherId;

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId kerak",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    return res.json({
      groups: getTeacherGroups(teacherId),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Guruhlarni olishda xatolik",
    });
  }
});

app.get("/api/teacher/groups/:groupId/students", (req, res) => {
  try {
    const { groupId } = req.params;
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId kerak",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const users = getUsers();

    const students = users.filter(
      (user) =>
        user.role !== "teacher" &&
        (user.groupIds || []).some((id) => String(id) === String(groupId)),
    );

    return res.json({
      group,
      students: students.map(publicUser),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchilarni olishda xatolik",
    });
  }
});

app.get("/api/teacher/students", (req, res) => {
  try {
    const { teacherId, q } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId kerak",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const groups = getTeacherGroups(teacherId);

    const groupIds = groups.map((group) => String(group.id));

    let students = getUsers().filter(
      (user) =>
        user.role !== "teacher" &&
        (user.groupIds || []).some((groupId) =>
          groupIds.includes(String(groupId)),
        ),
    );

    if (q) {
      const search = String(q).toLowerCase().trim();

      students = students.filter(
        (student) =>
          String(student.name).toLowerCase().includes(search) ||
          String(student.email).toLowerCase().includes(search) ||
          String(student.phone).toLowerCase().includes(search),
      );
    }

    return res.json({
      students: students.map(publicUser),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchilarni qidirishda xatolik",
    });
  }
});

app.post("/api/teacher/students", (req, res) => {
  try {
    const { teacherId, name, email, phone, password, groupId } = req.body;

    if (!teacherId || !name || !email || !phone || !password || !groupId) {
      return res.status(400).json({
        message: "Barcha maydonlarni to'ldiring",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi o'quvchi qo'sha oladi",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const users = getUsers();

    const emailExists = users.some(
      (user) =>
        String(user.email).toLowerCase() === String(email).toLowerCase(),
    );

    if (emailExists) {
      return res.status(400).json({
        message: "Bu email allaqachon mavjud",
      });
    }

    const newStudent = {
      id: Date.now(),
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      password,
      role: "student",
      groupIds: [Number(groupId)],
      createdAt: new Date().toISOString(),
    };

    users.push(newStudent);

    saveUsers(users);

    const groups = getGroups();

    const groupIndex = groups.findIndex(
      (item) => String(item.id) === String(groupId),
    );

    if (groupIndex !== -1) {
      if (!Array.isArray(groups[groupIndex].studentIds)) {
        groups[groupIndex].studentIds = [];
      }

      if (
        !groups[groupIndex].studentIds.some(
          (id) => String(id) === String(newStudent.id),
        )
      ) {
        groups[groupIndex].studentIds.push(newStudent.id);
      }
    }

    saveGroups(groups);

    const results = getResults();

    results[String(newStudent.id)] = {};

    saveResults(results);

    return res.status(201).json({
      message: "O'quvchi qo'shildi",
      student: publicUser(newStudent),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchi qo'shishda xatolik",
    });
  }
});

app.delete("/api/teacher/groups/:groupId/students/:studentId", (req, res) => {
  try {
    const { groupId, studentId } = req.params;
    const { teacherId } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId kerak",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const users = getUsers();

    const studentIndex = users.findIndex(
      (user) => String(user.id) === String(studentId),
    );

    if (studentIndex === -1) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    users[studentIndex].groupIds = (users[studentIndex].groupIds || []).filter(
      (id) => String(id) !== String(groupId),
    );

    saveUsers(users);

    const groups = getGroups();

    const groupIndex = groups.findIndex(
      (item) => String(item.id) === String(groupId),
    );

    if (groupIndex !== -1) {
      groups[groupIndex].studentIds = (
        groups[groupIndex].studentIds || []
      ).filter((id) => String(id) !== String(studentId));
    }

    saveGroups(groups);

    return res.json({
      message: "O'quvchi guruhdan chiqarildi",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchini guruhdan chiqarishda xatolik",
    });
  }
});

app.post("/api/teacher/students/:studentId/add-to-group", (req, res) => {
  try {
    const { studentId } = req.params;
    const { teacherId, groupId } = req.body;

    if (!teacherId || !groupId) {
      return res.status(400).json({
        message: "Teacher ID va group ID kerak",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const users = getUsers();

    const studentIndex = users.findIndex(
      (user) => String(user.id) === String(studentId),
    );

    if (studentIndex === -1) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    if (users[studentIndex].role === "teacher") {
      return res.status(400).json({
        message: "O'qituvchini student guruhiga qo'shib bo'lmaydi",
      });
    }

    if (!Array.isArray(users[studentIndex].groupIds)) {
      users[studentIndex].groupIds = [];
    }

    const exists = users[studentIndex].groupIds.some(
      (id) => String(id) === String(groupId),
    );

    if (!exists) {
      users[studentIndex].groupIds.push(Number(groupId));
    }

    saveUsers(users);

    const groups = getGroups();

    const groupIndex = groups.findIndex(
      (item) => String(item.id) === String(groupId),
    );

    if (groupIndex !== -1) {
      if (!Array.isArray(groups[groupIndex].studentIds)) {
        groups[groupIndex].studentIds = [];
      }

      const alreadyInGroup = groups[groupIndex].studentIds.some(
        (id) => String(id) === String(studentId),
      );

      if (!alreadyInGroup) {
        groups[groupIndex].studentIds.push(Number(studentId));
      }
    }

    saveGroups(groups);

    return res.json({
      message: "O'quvchi guruhga qo'shildi",
      student: publicUser(users[studentIndex]),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchini guruhga qo'shishda xatolik",
    });
  }
});

app.get("/api/teacher/students/:studentId", (req, res) => {
  try {
    const { studentId } = req.params;
    const { teacherId } = req.query;

    if (!teacherId || !isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    const teacherGroups = getTeacherGroups(teacherId);

    const belongs = (student.groupIds || []).some((studentGroupId) =>
      teacherGroups.some(
        (group) => String(group.id) === String(studentGroupId),
      ),
    );

    if (!belongs) {
      return res.status(403).json({
        message: "Bu o'quvchi sizning guruhingizda emas",
      });
    }

    const results = getResults();

    const attendance = getAttendance().filter(
      (item) => String(item.studentId) === String(studentId),
    );

    const groups = teacherGroups.filter((group) =>
      (student.groupIds || []).some((id) => String(id) === String(group.id)),
    );

    return res.json({
      student: publicUser(student),
      groups,
      results: results[String(studentId)] || {},
      attendance,
      progress: calculateStudentProgress(studentId),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchi profilini olishda xatolik",
    });
  }
});

app.get("/api/teacher/students/:studentId/results", (req, res) => {
  try {
    const { studentId } = req.params;
    const { teacherId } = req.query;

    if (!teacherId || !isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    const teacherGroups = getTeacherGroups(teacherId);

    const belongs = (student.groupIds || []).some((studentGroupId) =>
      teacherGroups.some(
        (group) => String(group.id) === String(studentGroupId),
      ),
    );

    if (!belongs) {
      return res.status(403).json({
        message: "Bu o'quvchi sizning guruhingizda emas",
      });
    }

    return res.json({
      results: getResults()[String(studentId)] || {},
      progress: calculateStudentProgress(studentId),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Natijalarni olishda xatolik",
    });
  }
});

app.post("/api/teacher/results/:studentId", (req, res) => {
  try {
    const { studentId } = req.params;

    const payload = normalizeResultPayload(req.body);

    const {
      teacherId,
      groupId,
      type,
      score,
      total,
      correct,
      percentage,
      comment,
    } = payload;

    if (!teacherId || !groupId || !type) {
      return res.status(400).json({
        message: "Teacher, group va test turi kerak",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    if (!allowedResultTypes.includes(type)) {
      return res.status(400).json({
        message: "Noto'g'ri test turi",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    if (!studentBelongsToGroup(studentId, groupId)) {
      return res.status(400).json({
        message: "O'quvchi bu guruhda emas",
      });
    }

    const results = getResults();

    const userKey = String(studentId);

    if (!results[userKey]) {
      results[userKey] = {};
    }

    results[userKey][type] = {
      score,
      correct,
      total,
      percentage,
      comment,
      teacherId,
      groupId,
      updatedAt: new Date().toISOString(),
    };

    saveResults(results);

    return res.json({
      message: "O'quvchi natijasi saqlandi",
      result: results[userKey][type],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Teacher natijasi saqlashda xatolik",
    });
  }
});

app.put("/api/teacher/results/:studentId/:type", (req, res) => {
  try {
    const { studentId, type } = req.params;

    const payload = normalizeResultPayload({
      ...req.body,
      type,
    });

    const { teacherId, groupId, score, total, correct, percentage, comment } =
      payload;

    if (!teacherId || !groupId) {
      return res.status(400).json({
        message: "Teacher va group ID kerak",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    if (!allowedResultTypes.includes(type)) {
      return res.status(400).json({
        message: "Noto'g'ri test turi",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    if (!studentBelongsToGroup(studentId, groupId)) {
      return res.status(400).json({
        message: "O'quvchi bu guruhda emas",
      });
    }

    const results = getResults();

    const userKey = String(studentId);

    if (!results[userKey]) {
      results[userKey] = {};
    }

    const oldResult = results[userKey][type] || {};

    results[userKey][type] = {
      ...oldResult,
      score: score !== undefined ? score : oldResult.score,
      correct: correct !== undefined ? correct : oldResult.correct,
      total: total !== undefined ? total : oldResult.total,
      percentage:
        percentage !== null ? percentage : (oldResult.percentage ?? null),
      comment: comment !== undefined ? comment : oldResult.comment || "",
      teacherId,
      groupId,
      updatedAt: new Date().toISOString(),
    };

    saveResults(results);

    return res.json({
      message: "Natija yangilandi",
      result: results[userKey][type],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Natijani yangilashda xatolik",
    });
  }
});

app.post("/api/teacher/attendance", (req, res) => {
  try {
    const { teacherId, groupId, studentId, date, status, reason, note } =
      req.body;

    if (!teacherId || !groupId || !studentId || !date || !status) {
      return res.status(400).json({
        message: "Davomat uchun barcha maydonlarni to'ldiring",
      });
    }

    if (!allowedAttendanceStatuses.includes(status)) {
      return res.status(400).json({
        message: "Davomat holati noto'g'ri",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    if (!studentBelongsToGroup(studentId, groupId)) {
      return res.status(400).json({
        message: "O'quvchi bu guruhda emas",
      });
    }

    const attendance = getAttendance();

    const existingIndex = attendance.findIndex(
      (item) =>
        String(item.groupId) === String(groupId) &&
        String(item.studentId) === String(studentId) &&
        String(item.date) === String(date),
    );

    const record = {
      id: existingIndex === -1 ? Date.now() : attendance[existingIndex].id,
      teacherId: Number(teacherId),
      groupId: Number(groupId),
      studentId: Number(studentId),
      date: String(date),
      status,
      reason: reason || "",
      note: note || "",
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex === -1) {
      attendance.push(record);
    } else {
      attendance[existingIndex] = record;
    }

    saveAttendance(attendance);

    return res.json({
      message: "Davomat saqlandi",
      attendance: record,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Davomat saqlashda xatolik",
    });
  }
});

app.get("/api/teacher/attendance/:groupId", (req, res) => {
  try {
    const { groupId } = req.params;
    const { teacherId, date } = req.query;

    if (!teacherId) {
      return res.status(400).json({
        message: "teacherId kerak",
      });
    }

    if (!isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const group = isTeacherOfGroup(teacherId, groupId);

    if (!group) {
      return res.status(403).json({
        message: "Bu guruh sizga tegishli emas",
      });
    }

    let attendance = getAttendance().filter(
      (item) => String(item.groupId) === String(groupId),
    );

    if (date) {
      attendance = attendance.filter(
        (item) => String(item.date) === String(date),
      );
    }

    return res.json({
      group,
      attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Davomatni olishda xatolik",
    });
  }
});

app.get("/api/teacher/students/:studentId/attendance", (req, res) => {
  try {
    const { studentId } = req.params;
    const { teacherId } = req.query;

    if (!teacherId || !isTeacher(teacherId)) {
      return res.status(403).json({
        message: "Faqat o'qituvchi uchun",
      });
    }

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    const teacherGroups = getTeacherGroups(teacherId);

    const belongs = (student.groupIds || []).some((studentGroupId) =>
      teacherGroups.some(
        (group) => String(group.id) === String(studentGroupId),
      ),
    );

    if (!belongs) {
      return res.status(403).json({
        message: "Bu o'quvchi sizning guruhingizda emas",
      });
    }

    const attendance = getAttendance().filter(
      (item) => String(item.studentId) === String(studentId),
    );

    return res.json({
      attendance,
      summary: calculateStudentProgress(studentId).attendance,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "O'quvchi davomatini olishda xatolik",
    });
  }
});

app.get("/api/student/:studentId/dashboard", (req, res) => {
  try {
    const student = findUser(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        message: "O'quvchi topilmadi",
      });
    }

    const results = getResults();

    const attendance = getAttendance().filter(
      (item) => String(item.studentId) === String(student.id),
    );

    return res.json({
      student: publicUser(student),
      results: results[String(student.id)] || {},
      attendance,
      progress: calculateStudentProgress(student.id),
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Student dashboard ma'lumotlarini olishda xatolik",
    });
  }
});

app.get("/api/student/attendance/:studentId", (req, res) => {
  try {
    const studentId = String(req.params.studentId);

    const student = findUser(studentId);

    if (!student) {
      return res.status(404).json({
        message: "O‘quvchi topilmadi",
      });
    }

    const groups = getGroups();

    const studentGroupIds = Array.isArray(student.groupIds)
      ? student.groupIds.map(String)
      : [];

    const studentGroupMap = {};

    groups.forEach((group) => {
      if (studentGroupIds.includes(String(group.id))) {
        studentGroupMap[String(group.id)] = {
          id: group.id,
          name: group.name,
        };
      }
    });

    let studentAttendance = getAttendance().filter(
      (item) =>
        String(item.studentId) === studentId &&
        studentGroupIds.includes(String(item.groupId)),
    );

    studentAttendance = studentAttendance
      .map((item) => ({
        id: item.id || null,
        studentId: item.studentId,
        groupId: item.groupId,
        groupName:
          studentGroupMap[String(item.groupId)]?.name || "Noma’lum guruh",
        date: item.date || "",
        status: item.status || "keldi",
        reason: item.reason || "",
        note: item.note || "",
      }))
      .sort((a, b) => String(b.date).localeCompare(String(a.date)));

    const present = studentAttendance.filter(
      (item) => item.status === "keldi",
    ).length;

    const absent = studentAttendance.filter(
      (item) => item.status === "kelmadi",
    ).length;

    const excused = studentAttendance.filter(
      (item) => item.status === "sababli",
    ).length;

    const unexcused = studentAttendance.filter(
      (item) => item.status === "sababsiz",
    ).length;

    const total = studentAttendance.length;

    const percentage =
      total > 0 ? Number(((present / total) * 100).toFixed(1)) : 0;

    return res.json({
      attendance: studentAttendance,
      summary: {
        total,
        present,
        absent,
        excused,
        unexcused,
        percentage,
      },
    });
  } catch (error) {
    console.error("Student attendance error:", error);

    return res.status(500).json({
      message: "Davomatni olishda server xatosi",
    });
  }
});

app.listen(PORT, () => {
  console.log(`START21 Backend ${PORT}-portda ishlayapti`);
});

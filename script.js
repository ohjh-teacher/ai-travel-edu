const STORAGE_KEY = "smartTravelClassSubmissions";
const INSTITUTIONS_KEY = "smartTravelClassInstitutions";
const ADMIN_UNLOCK_KEY = "smartTravelAdminUnlocked";
const ADMIN_PASSCODE = "2026";
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDbto7vFUwkaPZc7l0kyGX2qi4HjZQvvOg",
  authDomain: "aitraveledu.firebaseapp.com",
  projectId: "aitraveledu",
  storageBucket: "aitraveledu.firebasestorage.app",
  messagingSenderId: "19262129760",
  appId: "1:19262129760:web:bfb1777ee404368294e505"
};
const FIREBASE_COLLECTION = "week1Submissions";
const FIREBASE_INSTITUTIONS_COLLECTION = "institutions";

const weeks = [
  ["1주차", "AI와 여행지·여행 계획", "AI와 함께 여행지를 찾고 나만의 여행 일정을 만들어봅니다.", "weekOne", true],
  ["2주차", "카메라 기능과 설정", "스마트폰 카메라의 기본 기능과 사진 설정을 익혀봅니다.", "weekTwo", true],
  ["3주차", "갤러리앱과 사진 정리", "갤러리앱에서 사진을 찾고 앨범 만들기와 사진 수정을 연습합니다.", "weekThree", true],
  ["4주차", "지도와 길찾기", "지도 앱으로 길찾기와 여행 동선을 연습해 봅니다.", "", false],
  ["5주차", "기차·버스 이용", "스마트폰으로 교통편을 확인하고 예매 연습을 해봅니다.", "", false],
  ["6주차", "숙소와 맛집 찾기", "숙소와 맛집 정보를 검색하고 후기도 알아봅니다.", "", false],
  ["7주차", "AI 번역과 여행 회화 활용", "번역 기능과 AI 음성 대화를 활용하여 해외 여행 상황을 연습해 봅니다.", "", false],
  ["8주차", "키오스크·QR 활용", "키오스크 주문과 QR 기능을 체험하며 여행 중 필요한 기능을 익혀봅니다.", "", false],
  ["9주차", "안전한 스마트폰 활용", "위치 공유와 긴급신고 기능을 배우고 AI와 함께 위험 문자를 확인해 봅니다.", "", false],
  ["10주차", "AI와 여행 음악", "여행 분위기에 어울리는 음악을 찾고 AI 음악 생성 기능을 체험해 봅니다.", "", false],
  ["11주차", "AI와 여행 영상", "사진과 음악을 활용하여 감성 여행 영상을 만들어봅니다.", "", false],
  ["12주차", "여행 포토북 만들기", "사진과 감성 문장을 활용하여 여행 포토북을 완성해 봅니다.", "", false],
  ["13주차", "유튜브 영상 공유하기", "AI가 만든 제목과 설명글을 넣어 여행 영상을 공유해 봅니다.", "", false]
];

const screens = {
  home: document.getElementById("homeScreen"),
  weekOne: document.getElementById("weekOneScreen"),
  weekTwo: document.getElementById("weekTwoScreen"),
  weekThree: document.getElementById("weekThreeScreen"),
  submit: document.getElementById("submitScreen"),
  admin: document.getElementById("adminScreen")
};

const weekGrid = document.getElementById("weekGrid");
const toast = document.getElementById("toast");
const absenceBox = document.getElementById("absenceBox");
const saveMessage = document.getElementById("saveMessage");
const adminList = document.getElementById("adminList");
const classYearSelect = document.getElementById("classYear");
const institutionSelect = document.getElementById("institutionName");
const adminYearFilter = document.getElementById("adminYearFilter");
const adminInstitutionFilter = document.getElementById("adminInstitutionFilter");
const institutionForm = document.getElementById("institutionForm");
const institutionYearSelect = document.getElementById("institutionYear");
const institutionStartWeekSelect = document.getElementById("institutionStartWeek");
const institutionStartDateInput = document.getElementById("institutionStartDate");
const newInstitutionNameInput = document.getElementById("newInstitutionName");
const institutionToggleButton = document.getElementById("institutionToggleButton");
const institutionList = document.getElementById("institutionList");
const submitWeekLabel = document.getElementById("submitWeekLabel");
const submitClassYearSelect = document.getElementById("submitClassYear");
const submitInstitutionSelect = document.getElementById("submitInstitutionName");
const submitChecklist = document.getElementById("submitChecklist");
const submitAbsenceBox = document.getElementById("submitAbsenceBox");
const studentSaveMessage = document.getElementById("studentSaveMessage");
const closeSubmitButton = document.getElementById("closeSubmitButton");
const privacyConsent = document.getElementById("privacyConsent");
const submitFilesInput = document.getElementById("submitFiles");
let firebaseServicesPromise = null;
let institutionsCache = [];
let activeSubmitWeek = 1;

const currentYear = new Date().getFullYear();
const MAX_UPLOAD_FILES = 3;
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
const defaultInstitutions = [
  { name: "서울시민대학", year: currentYear, startWeek: 1 },
  { name: "장미 경로당", year: currentYear, startWeek: 1 },
  { name: "용답도서관", year: currentYear, startWeek: 1 },
  { name: "문정2동주민센터", year: currentYear, startWeek: 1 }
].map(normalizeInstitution);

const lessonChecklists = {
  1: [
    "AI 프롬프트를 입력했습니다.",
    "AI 질문을 읽고 내가 원하는 여행 스타일을 말했습니다.",
    "내가 원하는 여행 계획을 만들었습니다.",
    "여행계획을 인포그래픽 이미지로 만들었습니다.",
    "단체 톡방에 공유했습니다."
  ],
  2: [
    "카메라 앱을 열었습니다.",
    "사진을 잘 찍는 방법을 확인했습니다.",
    "카메라 화면 아이콘을 확인했습니다.",
    "퀵컨트롤 버튼을 눌러봤습니다.",
    "카메라 설정 화면을 살펴봤습니다.",
    "셀프카메라 촬영 방법을 연습했습니다."
  ],
  3: [
    "사진탭, 앨범탭, 컬렉션을 구분했습니다.",
    "새 앨범을 만들었습니다.",
    "카메라 사진을 만든 앨범으로 이동했습니다.",
    "사진 편집과 AI 기능을 살펴봤습니다.",
    "사진 삭제와 복원 방법을 확인했습니다."
  ]
};

function showScreen(name) {
  document.body.dataset.screen = name;

  Object.values(screens).forEach((screen) => {
    if (screen) {
      screen.classList.remove("is-active");
    }
  });

  if (screens[name]) {
    screens[name].classList.add("is-active");
  }

  window.scrollTo({ top: 0, behavior: "smooth" });

  if (name === "admin") {
    renderAdminList();
  }

  if (name === "submit") {
    renderSubmitScreen(activeSubmitWeek);
  }
}

function showToast(message) {
  if (!toast) {
    return;
  }

  toast.textContent = message;
  toast.classList.add("is-visible");
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 1800);
}

function ensureAdminAccess() {
  if (sessionStorage.getItem(ADMIN_UNLOCK_KEY) === "true") {
    return true;
  }

  const passcode = window.prompt("관리자 비밀번호를 입력해 주세요.");
  if (passcode === ADMIN_PASSCODE) {
    sessionStorage.setItem(ADMIN_UNLOCK_KEY, "true");
    return true;
  }

  if (passcode !== null) {
    showToast("관리자 비밀번호가 맞지 않습니다.");
  }

  return false;
}

function openAdminScreen() {
  if (ensureAdminAccess()) {
    showScreen("admin");
  }
}

function getSubmissions() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveSubmissions(submissions) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
}

function isFirebaseReady() {
  return FIREBASE_CONFIG && FIREBASE_CONFIG.projectId;
}

async function getFirebaseServices() {
  if (!isFirebaseReady()) {
    return null;
  }

  if (!firebaseServicesPromise) {
    firebaseServicesPromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js")
    ]).then(([appModule, firestoreModule, storageModule]) => {
      const app = appModule.initializeApp(FIREBASE_CONFIG);
      const db = firestoreModule.getFirestore(app);
      const storage = storageModule.getStorage(app);
      return {
        db,
        storage,
        addDoc: firestoreModule.addDoc,
        collection: firestoreModule.collection,
        deleteDoc: firestoreModule.deleteDoc,
        doc: firestoreModule.doc,
        getDocs: firestoreModule.getDocs,
        orderBy: firestoreModule.orderBy,
        query: firestoreModule.query,
        serverTimestamp: firestoreModule.serverTimestamp,
        setDoc: firestoreModule.setDoc,
        deleteObject: storageModule.deleteObject,
        getDownloadURL: storageModule.getDownloadURL,
        ref: storageModule.ref,
        uploadBytes: storageModule.uploadBytes
      };
    });
  }

  return firebaseServicesPromise;
}

async function submitToFirebase(data) {
  const services = await getFirebaseServices();
  if (!services) {
    return;
  }

  await services.addDoc(services.collection(services.db, FIREBASE_COLLECTION), {
    ...data,
    createdAt: services.serverTimestamp()
  });
}

async function getFirebaseSubmissions() {
  const services = await getFirebaseServices();
  if (!services) {
    return null;
  }

  const snapshot = await services.getDocs(
    services.query(
      services.collection(services.db, FIREBASE_COLLECTION),
      services.orderBy("createdAt", "desc")
    )
  );

  return snapshot.docs.map((doc) => ({
    firebaseId: doc.id,
    ...doc.data()
  }));
}

function normalizeInstitution(institution) {
  const year = Number(institution.year) || currentYear;
  const name = String(institution.name || "").trim();
  const startWeek = Math.min(Math.max(Number(institution.startWeek) || 1, 1), 13);

  return {
    key: institution.key || `${year}-${encodeURIComponent(name)}`,
    name,
    year,
    startWeek,
    startDate: String(institution.startDate || ""),
    hidden: Boolean(institution.hidden)
  };
}

function getLocalInstitutions() {
  const raw = localStorage.getItem(INSTITUTIONS_KEY);
  const saved = raw ? JSON.parse(raw) : [];
  return mergeInstitutions([...defaultInstitutions, ...saved.map(normalizeInstitution)]);
}

function saveLocalInstitutions(institutions) {
  localStorage.setItem(INSTITUTIONS_KEY, JSON.stringify(institutions));
}

function mergeInstitutions(institutions) {
  const map = new Map();
  institutions
    .map(normalizeInstitution)
    .filter((institution) => institution.name)
    .forEach((institution) => {
      const existing = map.get(institution.key);
      if (!existing) {
        map.set(institution.key, institution);
        return;
      }

      map.set(institution.key, {
        ...existing,
        ...institution,
        startDate: institution.startDate || existing.startDate,
        hidden: Boolean(institution.hidden)
      });
    });

  return Array.from(map.values()).sort((a, b) => (
    b.year - a.year || a.name.localeCompare(b.name, "ko")
  ));
}

async function getFirebaseInstitutions() {
  const services = await getFirebaseServices();
  if (!services) {
    return null;
  }

  const snapshot = await services.getDocs(
    services.collection(services.db, FIREBASE_INSTITUTIONS_COLLECTION)
  );

  return snapshot.docs.map((doc) => normalizeInstitution({
    key: doc.id,
    ...doc.data()
  }));
}

async function saveInstitutionToFirebase(institution) {
  const services = await getFirebaseServices();
  if (!services) {
    return;
  }

  await services.setDoc(
    services.doc(services.db, FIREBASE_INSTITUTIONS_COLLECTION, institution.key),
    {
      name: institution.name,
      year: institution.year,
      startWeek: institution.startWeek,
      startDate: institution.startDate,
      hidden: institution.hidden,
      updatedAt: services.serverTimestamp()
    }
  );
}

async function loadInstitutions() {
  institutionsCache = getLocalInstitutions();
  renderInstitutionOptions();

  try {
    const firebaseInstitutions = await getFirebaseInstitutions();
    if (firebaseInstitutions) {
      institutionsCache = mergeInstitutions([...institutionsCache, ...firebaseInstitutions]);
      saveLocalInstitutions(institutionsCache);
    }
  } catch (error) {
    showToast("기관 목록은 기기 저장값을 사용합니다.");
  }

  renderInstitutionOptions();
}

function getSelectedInstitution(select = institutionSelect) {
  return institutionsCache.find((institution) => institution.key === select?.value);
}

function renderInstitutionOptions() {
  const selectedYear = Number(classYearSelect?.value) || currentYear;
  const studentInstitutions = institutionsCache.filter((institution) => institution.year === selectedYear);
  const submitSelectedYear = Number(submitClassYearSelect?.value) || currentYear;
  const submitInstitutions = institutionsCache.filter((institution) => institution.year === submitSelectedYear);

  if (institutionSelect) {
    institutionSelect.innerHTML = '<option value="">기관을 선택하세요</option>';
    studentInstitutions.filter((institution) => !institution.hidden).forEach((institution) => {
      const option = document.createElement("option");
      option.value = institution.key;
      option.textContent = institution.name;
      institutionSelect.appendChild(option);
    });
  }

  if (submitInstitutionSelect) {
    const selectedSubmitInstitution = submitInstitutionSelect.value;
    submitInstitutionSelect.innerHTML = '<option value="">기관을 선택하세요</option>';
    submitInstitutions.filter((institution) => !institution.hidden).forEach((institution) => {
      const option = document.createElement("option");
      option.value = institution.key;
      option.textContent = institution.name;
      submitInstitutionSelect.appendChild(option);
    });
    submitInstitutionSelect.value = selectedSubmitInstitution;
  }

  if (adminInstitutionFilter) {
    const selectedFilter = adminInstitutionFilter.value;
    adminInstitutionFilter.innerHTML = '<option value="">전체 기관</option>';
    institutionsCache
      .filter((institution) => (
        String(institution.year) === String(adminYearFilter?.value || currentYear) && !institution.hidden
      ))
      .forEach((institution) => {
        const option = document.createElement("option");
        option.value = institution.name;
        option.textContent = `${institution.name} (${institution.startWeek}주차 시작)`;
        adminInstitutionFilter.appendChild(option);
      });
    adminInstitutionFilter.value = selectedFilter;
  }

  renderInstitutionList();
}

function populateYearSelects() {
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  [classYearSelect, adminYearFilter, institutionYearSelect, submitClassYearSelect].forEach((select) => {
    if (!select) {
      return;
    }

    select.innerHTML = "";
    years.forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = `${year}년`;
      select.appendChild(option);
    });
    select.value = String(currentYear);
  });
}

function getWeekInfo(weekNumber) {
  const index = Math.max(Number(weekNumber) - 1, 0);
  const week = weeks[index];

  if (!week) {
    return {
      number: `${weekNumber}주차`,
      title: `${weekNumber}주차 수업`,
      description: ""
    };
  }

  return {
    number: week[0],
    title: week[1],
    description: week[2]
  };
}

function buildSubmitUrl(weekNumber) {
  const url = new URL(window.location.href);
  url.hash = "";
  url.search = "";
  url.searchParams.set("view", "submit");
  url.searchParams.set("week", String(weekNumber));
  return url.toString();
}

function setupSubmitQrLinks() {
  document.querySelectorAll(".submit-qr").forEach((container) => {
    const weekNumber = Number(container.dataset.week) || 1;
    const submitUrl = buildSubmitUrl(weekNumber);
    const image = container.querySelector("img");
    const link = container.querySelector("a");

    if (image) {
      image.src = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(submitUrl)}`;
    }

    if (link) {
      link.href = submitUrl;
    }
  });
}

function renderSubmitChecklist(weekNumber) {
  if (!submitChecklist) {
    return;
  }

  const items = lessonChecklists[weekNumber] || [
    "오늘 수업 내용을 따라 해봤습니다.",
    "새로운 기능을 연습했습니다.",
    "결과물을 확인했습니다.",
    "다음 수업 준비를 했습니다."
  ];

  submitChecklist.innerHTML = "";
  items.forEach((item) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${escapeHtml(item)}"> ${escapeHtml(item)}`;
    submitChecklist.appendChild(label);
  });
}

function renderSubmitScreen(weekNumber) {
  activeSubmitWeek = Math.min(Math.max(Number(weekNumber) || 1, 1), 13);
  const weekInfo = getWeekInfo(activeSubmitWeek);

  if (submitWeekLabel) {
    submitWeekLabel.textContent = `${weekInfo.number} 후기 제출`;
  }

  const submitTitle = document.getElementById("submitTitle");
  if (submitTitle) {
    submitTitle.textContent = `${weekInfo.number} | ${weekInfo.title}`;
  }

  renderSubmitChecklist(activeSubmitWeek);
  renderInstitutionOptions();
}

function populateStartWeekSelect() {
  if (!institutionStartWeekSelect) {
    return;
  }

  institutionStartWeekSelect.innerHTML = "";
  for (let week = 1; week <= 13; week += 1) {
    const option = document.createElement("option");
    option.value = String(week);
    option.textContent = `${week}주차`;
    institutionStartWeekSelect.appendChild(option);
  }
}

function buildWeekCards() {
  if (!weekGrid) {
    return;
  }

  weekGrid.innerHTML = "";

  weeks.forEach(([number, title, description, screenName, isReady], index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = `week-card ${isReady ? "is-ready" : "is-disabled"}`;
    card.innerHTML = `
      <span class="week-number">${number}</span>
      <span class="week-title">${title}</span>
      <span class="week-state">${description}</span>
    `;

    if (isReady && screenName) {
      card.addEventListener("click", () => showScreen(screenName));
    } else {
      card.setAttribute("aria-disabled", "true");
      card.addEventListener("click", () => showToast(`${index + 1}주차는 준비 중입니다.`));
    }

    weekGrid.appendChild(card);
  });
}

async function copyPrompt(targetId) {
  const target = document.getElementById(targetId);
  if (!target) {
    showToast("복사할 내용을 찾지 못했습니다.");
    return;
  }

  const promptText = target.textContent.trim();

  try {
    await navigator.clipboard.writeText(promptText);
    showToast("복사했습니다.");
  } catch (error) {
    const textArea = document.createElement("textarea");
    textArea.value = promptText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.remove();
    showToast("복사했습니다.");
  }
}

function getSelectedCheckboxes(container = document) {
  return Array.from(container.querySelectorAll(".check-list input:checked")).map((item) => item.value);
}

function getNextAttendance() {
  const selected = document.querySelector('input[name="nextAttendance"]:checked');
  return selected ? selected.value : "";
}

function getSubmitNextAttendance() {
  const selected = document.querySelector('input[name="submitNextAttendance"]:checked');
  return selected ? selected.value : "";
}

function getSubmitFiles() {
  return Array.from(submitFilesInput?.files || []);
}

function validateUploadFiles(files) {
  if (files.length > MAX_UPLOAD_FILES) {
    return `사진은 최대 ${MAX_UPLOAD_FILES}장까지 올릴 수 있습니다.`;
  }

  const invalidType = files.find((file) => !file.type.startsWith("image/"));
  if (invalidType) {
    return "사진 또는 이미지 파일만 올릴 수 있습니다.";
  }

  const oversized = files.find((file) => file.size > MAX_UPLOAD_SIZE);
  if (oversized) {
    return "사진 한 장의 크기는 5MB 이하여야 합니다.";
  }

  return "";
}

function validateSubmission(data, options = {}) {
  if (!data.name) {
    return "이름을 입력해 주세요.";
  }

  if (!/^\d{4}$/.test(data.phoneLast4)) {
    return "연락처 뒷번호 4자리를 입력해 주세요.";
  }

  if (!data.institutionName) {
    return "학습 중인 기관명을 선택해 주세요.";
  }

  if (!data.classYear) {
    return "수업 연도를 선택해 주세요.";
  }

  if (!data.nextAttendance) {
    return "다음 수업 참여 여부를 선택해 주세요.";
  }

  if (!data.review) {
    return "오늘 내가 직접 해본 기능 1가지를 적어 주세요.";
  }

  if (options.requirePrivacyConsent && !data.privacyConsent) {
    return "개인정보 저장 동의에 체크해 주세요.";
  }

  if (data.nextAttendance === "참여할 수 없습니다." && !data.absenceReason) {
    return "참여할 수 없는 사유를 입력해 주세요.";
  }

  return "";
}

function saveSubmissionLocally(data) {
  const submissions = getSubmissions();
  const existingIndex = submissions.findIndex((item) => (
    item.submissionId === data.submissionId ||
    (item.name === data.name && item.phoneLast4 === data.phoneLast4 && item.weekNumber === data.weekNumber)
  ));

  if (existingIndex >= 0) {
    submissions[existingIndex] = data;
  } else {
    submissions.push(data);
  }

  saveSubmissions(submissions);
}

function sanitizeStorageSegment(value) {
  return String(value || "unknown")
    .trim()
    .replace(/[\\/#?%*:|"<>]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80) || "unknown";
}

async function uploadSubmissionFiles(files, data) {
  if (!files.length) {
    return [];
  }

  const services = await getFirebaseServices();
  if (!services) {
    throw new Error("Firebase Storage is not ready.");
  }

  const basePath = [
    "submissions",
    String(data.classYear || currentYear),
    sanitizeStorageSegment(data.institutionName),
    `week-${data.weekNumber || 1}`,
    sanitizeStorageSegment(data.submissionId)
  ].join("/");

  const uploads = files.map(async (file, index) => {
    const fileName = `${index + 1}-${Date.now()}-${sanitizeStorageSegment(file.name)}`;
    const path = `${basePath}/${fileName}`;
    const fileRef = services.ref(services.storage, path);
    await services.uploadBytes(fileRef, file, {
      contentType: file.type,
      customMetadata: {
        studentName: data.name,
        phoneLast4: data.phoneLast4,
        institutionName: data.institutionName,
        weekNumber: String(data.weekNumber || "")
      }
    });
    const url = await services.getDownloadURL(fileRef);

    return {
      name: file.name,
      size: file.size,
      type: file.type,
      path,
      url
    };
  });

  return Promise.all(uploads);
}

async function submitStudentReview() {
  const selectedInstitution = getSelectedInstitution(submitInstitutionSelect);
  const phoneLast4 = document.getElementById("submitPhoneLast4")?.value.trim() || "";
  const submittedAt = new Date().toLocaleString("ko-KR");
  const data = {
    name: document.getElementById("submitStudentName")?.value.trim() || "",
    phoneLast4,
    classYear: Number(submitClassYearSelect?.value) || currentYear,
    institutionKey: selectedInstitution?.key || "",
    institutionName: selectedInstitution?.name || "",
    institutionStartWeek: selectedInstitution?.startWeek || 1,
    institutionStartDate: selectedInstitution?.startDate || "",
    weekNumber: activeSubmitWeek,
    attendanceStatus: "출석",
    completedItems: getSelectedCheckboxes(document.getElementById("submitScreen")),
    review: document.getElementById("submitReviewText")?.value.trim() || "",
    nextAttendance: getSubmitNextAttendance(),
    absenceReason: document.getElementById("submitAbsenceReason")?.value.trim() || "",
    privacyConsent: Boolean(privacyConsent?.checked),
    submittedAt,
    submissionId: `${Date.now()}-${activeSubmitWeek}-${phoneLast4}`
  };
  const files = getSubmitFiles();

  const errorMessage = validateSubmission(data, { requirePrivacyConsent: true });
  if (errorMessage) {
    studentSaveMessage.textContent = errorMessage;
    if (closeSubmitButton) {
      closeSubmitButton.hidden = true;
    }
    return;
  }

  const fileErrorMessage = validateUploadFiles(files);
  if (fileErrorMessage) {
    studentSaveMessage.textContent = fileErrorMessage;
    if (closeSubmitButton) {
      closeSubmitButton.hidden = true;
    }
    return;
  }

  const submitButton = document.getElementById("studentSubmitButton");
  if (submitButton) {
    submitButton.disabled = true;
  }
  studentSaveMessage.textContent = files.length ? "사진을 올리고 있습니다. 잠시만 기다려 주세요." : "제출하고 있습니다.";

  try {
    const attachments = await uploadSubmissionFiles(files, data);
    data.attachments = attachments;
    saveSubmissionLocally(data);
    await submitToFirebase(data);
    studentSaveMessage.textContent = "제출했습니다. 오늘 수업 기록이 저장되었습니다.";
    if (closeSubmitButton) {
      closeSubmitButton.hidden = false;
    }
    showToast("제출했습니다.");
  } catch (error) {
    studentSaveMessage.textContent = "제출하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 눌러주세요.";
    if (closeSubmitButton) {
      closeSubmitButton.hidden = true;
    }
    showToast("제출하지 못했습니다.");
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
    }
  }
}

function closeSubmitWindow() {
  window.close();

  window.setTimeout(() => {
    if (!window.closed && studentSaveMessage) {
      studentSaveMessage.textContent = "창이 닫히지 않으면 브라우저의 뒤로가기 또는 X 버튼을 눌러 닫아주세요.";
    }
  }, 250);
}

async function submitReview() {
  const selectedInstitution = getSelectedInstitution();
  const phoneLast4 = document.getElementById("phoneLast4").value.trim();
  const submittedAt = new Date().toLocaleString("ko-KR");
  const data = {
    name: document.getElementById("studentName").value.trim(),
    phoneLast4,
    classYear: Number(classYearSelect?.value) || currentYear,
    institutionKey: selectedInstitution?.key || "",
    institutionName: selectedInstitution?.name || "",
    institutionStartWeek: selectedInstitution?.startWeek || 1,
    weekNumber: 1,
    attendanceStatus: "출석",
    completedItems: getSelectedCheckboxes(),
    review: document.getElementById("reviewText").value.trim(),
    nextAttendance: getNextAttendance(),
    absenceReason: document.getElementById("absenceReason").value.trim(),
    submittedAt,
    submissionId: `${Date.now()}-${phoneLast4}`
  };

  const errorMessage = validateSubmission(data);
  if (errorMessage) {
    saveMessage.textContent = errorMessage;
    return;
  }

  saveSubmissionLocally(data);

  try {
    await submitToFirebase(data);
    saveMessage.textContent = "제출했습니다. 오늘 수업 기록이 저장되었습니다.";
    showToast("제출했습니다.");
  } catch (error) {
    saveMessage.textContent = "내 기기에는 저장했습니다. 인터넷 연결 후 다시 제출해 주세요.";
    showToast("기기에 저장했습니다.");
  }
}

async function renderAdminList() {
  let submissions = getSubmissions().slice().reverse();
  adminList.innerHTML = "";

  try {
    const firebaseSubmissions = await getFirebaseSubmissions();
    if (firebaseSubmissions) {
      submissions = firebaseSubmissions;
    }
  } catch (error) {
    showToast("기기 저장 기록을 보여드립니다.");
  }

  const selectedYear = String(adminYearFilter?.value || currentYear);
  const selectedInstitution = adminInstitutionFilter?.value || "";
  const filteredSubmissions = submissions.filter((item) => {
    const itemYear = String(item.classYear || currentYear);
    const matchesYear = itemYear === selectedYear;
    const matchesInstitution = !selectedInstitution || item.institutionName === selectedInstitution;
    return matchesYear && matchesInstitution;
  });

  const institutionGroups = groupSubmissionsByInstitution(filteredSubmissions);

  if (filteredSubmissions.length === 0) {
    adminList.innerHTML = '<p class="empty-text">아직 제출 내역이 없습니다.</p>';
    return;
  }

  const summary = document.createElement("section");
  summary.className = "admin-summary";
  summary.innerHTML = `
    <article><strong>${filteredSubmissions.length}</strong><span>제출</span></article>
    <article><strong>${institutionGroups.length}</strong><span>기관</span></article>
    <article><strong>${filteredSubmissions.filter((item) => item.review).length}</strong><span>후기</span></article>
  `;
  adminList.appendChild(summary);

  institutionGroups.forEach(({ institutionName, items }) => {
    const group = document.createElement("section");
    group.className = "admin-institution-group";
    group.innerHTML = `<h2>${escapeHtml(institutionName)}</h2>`;
    adminList.appendChild(group);

    items.forEach((item) => {
    const card = document.createElement("article");
    card.className = "admin-card";
    const deleteKey = item.firebaseId || item.submissionId || `${item.name}-${item.phoneLast4}-${item.submittedAt}`;
    card.innerHTML = `
      <dl>
        <dt>연도</dt>
        <dd>${escapeHtml(item.classYear || currentYear)}년</dd>
        <dt>수업 주차</dt>
        <dd>${escapeHtml(item.weekNumber || 1)}주차</dd>
        <dt>이름</dt>
        <dd>${escapeHtml(item.name)}</dd>
        <dt>연락처 뒷번호</dt>
        <dd>${escapeHtml(item.phoneLast4)}</dd>
        <dt>기관 시작</dt>
        <dd>${escapeHtml(item.institutionStartWeek || 1)}주차</dd>
        <dt>출석 상태</dt>
        <dd>${escapeHtml(item.attendanceStatus)}</dd>
        <dt>학습 체크</dt>
        <dd>${item.completedItems?.length ? escapeHtml(item.completedItems.join(" / ")) : "체크 없음"}</dd>
        <dt>후기</dt>
        <dd>${item.review ? escapeHtml(item.review) : "후기 없음"}</dd>
        <dt>첨부 사진</dt>
        <dd>${renderAttachments(item.attachments)}</dd>
        <dt>다음 수업 참여 여부</dt>
        <dd>${escapeHtml(item.nextAttendance)}${item.absenceReason ? `<br>사유: ${escapeHtml(item.absenceReason)}` : ""}</dd>
        <dt>개인정보 동의</dt>
        <dd>${item.privacyConsent ? "동의" : "미기록"}</dd>
        <dt>제출 시간</dt>
        <dd>${escapeHtml(item.submittedAt)}</dd>
      </dl>
      <div class="admin-card-actions">
        <button class="secondary-button" type="button" data-action="delete-submission" data-delete-key="${escapeHtml(deleteKey)}" data-firebase-id="${escapeHtml(item.firebaseId || "")}" data-attachments="${escapeHtml(JSON.stringify(item.attachments || []))}">
          삭제
        </button>
      </div>
    `;
    adminList.appendChild(card);
  });
  });
}

async function deleteFirebaseSubmission(firebaseId) {
  if (!firebaseId) {
    return;
  }

  const services = await getFirebaseServices();
  if (!services) {
    return;
  }

  await services.deleteDoc(services.doc(services.db, FIREBASE_COLLECTION, firebaseId));
}

async function deleteSubmissionFiles(attachments = []) {
  if (!attachments.length) {
    return;
  }

  const services = await getFirebaseServices();
  if (!services) {
    return;
  }

  await Promise.allSettled(
    attachments
      .filter((attachment) => attachment.path)
      .map((attachment) => services.deleteObject(services.ref(services.storage, attachment.path)))
  );
}

function getLocalSubmissionByKey(deleteKey) {
  return getSubmissions().find((item) => {
    const itemKey = item.firebaseId || item.submissionId || `${item.name}-${item.phoneLast4}-${item.submittedAt}`;
    return itemKey === deleteKey;
  });
}

function deleteLocalSubmission(deleteKey) {
  const submissions = getSubmissions();
  const nextSubmissions = submissions.filter((item) => {
    const itemKey = item.firebaseId || item.submissionId || `${item.name}-${item.phoneLast4}-${item.submittedAt}`;
    return itemKey !== deleteKey;
  });
  saveSubmissions(nextSubmissions);
}

async function deleteSubmission(event) {
  const button = event.target.closest('[data-action="delete-submission"]');
  if (!button) {
    return;
  }

  const confirmed = window.confirm("이 제출 내역을 삭제할까요?");
  if (!confirmed) {
    return;
  }

  const deleteKey = button.dataset.deleteKey;
  const firebaseId = button.dataset.firebaseId;
  const attachments = button.dataset.attachments ? JSON.parse(button.dataset.attachments) : [];
  const localSubmission = getLocalSubmissionByKey(deleteKey);

  try {
    await deleteSubmissionFiles(attachments.length ? attachments : localSubmission?.attachments);
    await deleteFirebaseSubmission(firebaseId);
    deleteLocalSubmission(deleteKey);
    showToast("제출 내역을 삭제했습니다.");
  } catch (error) {
    showToast("삭제하지 못했습니다.");
  }

  renderAdminList();
}

function groupSubmissionsByInstitution(submissions) {
  const map = new Map();
  submissions.forEach((item) => {
    const institutionName = item.institutionName || "기관 미지정";
    if (!map.has(institutionName)) {
      map.set(institutionName, []);
    }
    map.get(institutionName).push(item);
  });

  return Array.from(map.entries()).map(([institutionName, items]) => ({
    institutionName,
    items
  }));
}

function formatFileSize(size) {
  if (!size) {
    return "";
  }

  if (size < 1024 * 1024) {
    return `${Math.round(size / 1024)}KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)}MB`;
}

function renderAttachments(attachments = []) {
  if (!attachments.length) {
    return "첨부 없음";
  }

  return `
    <div class="attachment-list">
      ${attachments.map((attachment) => `
        <figure class="attachment-item">
          <img src="${escapeHtml(attachment.url)}" alt="${escapeHtml(attachment.name || "첨부 사진")}">
          <figcaption>
            <span>${escapeHtml(attachment.name || "사진")}</span>
            <small>${escapeHtml(formatFileSize(attachment.size))}</small>
            <a href="${escapeHtml(attachment.url)}" download>다운로드</a>
          </figcaption>
        </figure>
      `).join("")}
    </div>
  `;
}

function renderInstitutionList() {
  if (!institutionList) {
    return;
  }

  const selectedYear = String(adminYearFilter?.value || currentYear);
  const institutions = institutionsCache.filter((institution) => String(institution.year) === selectedYear);

  if (institutions.length === 0) {
    institutionList.innerHTML = '<p class="empty-text compact-empty">등록된 기관이 없습니다.</p>';
    return;
  }

  institutionList.innerHTML = "";
  institutions.forEach((institution) => {
    const card = document.createElement("article");
    card.className = `institution-item ${institution.hidden ? "is-hidden" : ""}`;
    const weekOptions = Array.from({ length: 13 }, (_, index) => {
      const week = index + 1;
      return `<option value="${week}" ${week === institution.startWeek ? "selected" : ""}>${week}주차</option>`;
    }).join("");

    card.innerHTML = `
      <div class="institution-view">
        <strong>${escapeHtml(institution.name)}</strong>
        <span>${escapeHtml(institution.year)}년 · ${escapeHtml(formatDate(institution.startDate))} · 첫 수업 ${escapeHtml(institution.startWeek)}주차${institution.hidden ? " · 숨김" : ""}</span>
      </div>
      <form class="institution-edit-form" data-key="${escapeHtml(institution.key)}">
        <label><span>기관명</span><input name="name" type="text" value="${escapeHtml(institution.name)}" aria-label="기관명"></label>
        <label><span>첫 수업 주차</span><select name="startWeek" aria-label="첫 수업 주차">${weekOptions}</select></label>
        <label><span>수업 시작일</span><input name="startDate" type="date" value="${escapeHtml(institution.startDate)}" aria-label="수업 시작일"></label>
        <button class="secondary-button" type="submit">수정</button>
        <button class="secondary-button" type="button" data-action="toggle-hidden" data-key="${escapeHtml(institution.key)}">
          ${institution.hidden ? "다시 보이기" : "숨김"}
        </button>
      </form>
    `;
    institutionList.appendChild(card);
  });
}

function getInstitutionByKey(key) {
  return institutionsCache.find((institution) => institution.key === key);
}

function formatDate(value) {
  if (!value) {
    return "시작일 미정";
  }

  const [year, month, day] = value.split("-");
  return `${year}.${month}.${day}`;
}

async function persistInstitutionChange(institution, successMessage) {
  institutionsCache = mergeInstitutions(institutionsCache.map((item) => (
    item.key === institution.key ? institution : item
  )));
  saveLocalInstitutions(institutionsCache);
  renderInstitutionOptions();
  renderAdminList();

  try {
    await saveInstitutionToFirebase(institution);
    showToast(successMessage);
  } catch (error) {
    showToast("기기에 먼저 저장했습니다.");
  }
}

async function updateInstitution(event) {
  const form = event.target.closest(".institution-edit-form");
  if (!form) {
    return;
  }

  event.preventDefault();

  const institution = getInstitutionByKey(form.dataset.key);
  if (!institution) {
    showToast("기관을 찾지 못했습니다.");
    return;
  }

  const name = form.elements.name.value.trim();
  if (!name) {
    showToast("기관명을 입력해 주세요.");
    return;
  }

  await persistInstitutionChange({
    ...institution,
    name,
    startWeek: Number(form.elements.startWeek.value) || 1,
    startDate: form.elements.startDate.value
  }, "기관 정보를 수정했습니다.");
}

async function toggleInstitutionHidden(event) {
  const button = event.target.closest('[data-action="toggle-hidden"]');
  if (!button) {
    return;
  }

  const institution = getInstitutionByKey(button.dataset.key);
  if (!institution) {
    showToast("기관을 찾지 못했습니다.");
    return;
  }

  await persistInstitutionChange({
    ...institution,
    hidden: !institution.hidden
  }, institution.hidden ? "기관을 다시 보이게 했습니다." : "기관을 숨겼습니다.");
}

async function addInstitution(event) {
  event.preventDefault();

  const name = newInstitutionNameInput?.value.trim();
  const year = Number(institutionYearSelect?.value) || currentYear;
  const startWeek = Number(institutionStartWeekSelect?.value) || 1;
  const startDate = institutionStartDateInput?.value || "";

  if (!name) {
    showToast("기관명을 입력해 주세요.");
    return;
  }

  const institution = normalizeInstitution({ name, year, startWeek, startDate });
  institutionsCache = mergeInstitutions([...institutionsCache, institution]);
  saveLocalInstitutions(institutionsCache);
  renderInstitutionOptions();

  try {
    await saveInstitutionToFirebase(institution);
    showToast("기관을 추가했습니다.");
  } catch (error) {
    showToast("기기에 먼저 저장했습니다.");
  }

  newInstitutionNameInput.value = "";
  if (institutionStartDateInput) {
    institutionStartDateInput.value = "";
  }
  institutionForm?.classList.remove("is-visible");
  institutionToggleButton?.setAttribute("aria-expanded", "false");
  if (institutionToggleButton) {
    institutionToggleButton.textContent = "새 기관 등록";
  }
  renderAdminList();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function bindEvents() {
  document.getElementById("homeButton")?.addEventListener("click", () => showScreen("home"));
  document.getElementById("adminButton")?.addEventListener("click", openAdminScreen);
  document.getElementById("submitButton")?.addEventListener("click", submitReview);
  document.getElementById("studentSubmitButton")?.addEventListener("click", submitStudentReview);
  closeSubmitButton?.addEventListener("click", closeSubmitWindow);
  document.getElementById("printButton")?.addEventListener("click", () => window.print());
  classYearSelect?.addEventListener("change", renderInstitutionOptions);
  submitClassYearSelect?.addEventListener("change", renderInstitutionOptions);
  adminYearFilter?.addEventListener("change", () => {
    renderInstitutionOptions();
    renderAdminList();
  });
  adminInstitutionFilter?.addEventListener("change", renderAdminList);
  adminList?.addEventListener("click", deleteSubmission);
  institutionForm?.addEventListener("submit", addInstitution);
  institutionList?.addEventListener("submit", updateInstitution);
  institutionList?.addEventListener("click", toggleInstitutionHidden);
  institutionToggleButton?.addEventListener("click", () => {
    const isOpen = institutionForm?.classList.toggle("is-visible");
    institutionToggleButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
    institutionToggleButton.textContent = isOpen ? "기관 등록 닫기" : "새 기관 등록";
  });

  document.querySelectorAll(".copy-button").forEach((button) => {
    button.addEventListener("click", () => copyPrompt(button.dataset.copyTarget));
  });

  document.querySelectorAll('input[name="nextAttendance"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (absenceBox) {
        absenceBox.classList.toggle("is-visible", radio.value === "참여할 수 없습니다." && radio.checked);
      }
    });
  });

  document.querySelectorAll('input[name="submitNextAttendance"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      if (submitAbsenceBox) {
        submitAbsenceBox.classList.toggle("is-visible", radio.value === "참여할 수 없습니다." && radio.checked);
      }
    });
  });
}

function openInitialScreen() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("view") === "submit") {
    activeSubmitWeek = Math.min(Math.max(Number(params.get("week")) || 1, 1), 13);
    showScreen("submit");
    return;
  }

  showScreen("home");
}

populateYearSelects();
populateStartWeekSelect();
buildWeekCards();
setupSubmitQrLinks();
bindEvents();
loadInstitutions();
openInitialScreen();

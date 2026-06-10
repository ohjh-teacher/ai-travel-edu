const STORAGE_KEY = "smartTravelClassSubmissions";
const INSTITUTIONS_KEY = "smartTravelClassInstitutions";
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
const GOOGLE_FORM_ACTION = "https://docs.google.com/forms/d/e/1FAIpQLSdm9D1SE5WYQsr1DfZalDU3hDOCrGzmLehACksovrxyUki4AQ/formResponse";
const GOOGLE_FORM_ENTRIES = {
  name: "entry.1884265043",
  phoneLast4: "entry.1357804415",
  institutionName: "entry.108140407",
  completedItems: "entry.870245195",
  review: "entry.909756905",
  nextAttendance: "entry.1824725883",
  absenceReason: "entry.529825113",
  comment: "entry.513669972"
};

const weeks = [
  ["1주차", "AI와 여행지", "AI와 유튜브를 활용하여 여행지를 검색하고 저장해 봅니다.", "weekOne", true],
  ["2주차", "AI와 여행 계획", "AI에게 여행 코스와 준비물을 추천받아 여행 일정을 만들어봅니다.", "weekTwo", true],
  ["3주차", "여행 사진과 감성 기록", "여행 사진을 촬영하고 AI 감성 문장으로 추억을 기록해 봅니다.", "", false],
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
const newInstitutionNameInput = document.getElementById("newInstitutionName");
const institutionToggleButton = document.getElementById("institutionToggleButton");
let firebaseServicesPromise = null;
let institutionsCache = [];

const currentYear = new Date().getFullYear();
const defaultInstitutions = [
  { name: "서울시민대학", year: currentYear, startWeek: 1 },
  { name: "장미 경로당", year: currentYear, startWeek: 1 },
  { name: "용답도서관", year: currentYear, startWeek: 1 },
  { name: "문정2동주민센터", year: currentYear, startWeek: 1 }
].map(normalizeInstitution);

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
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
    ]).then(([appModule, firestoreModule]) => {
      const app = appModule.initializeApp(FIREBASE_CONFIG);
      const db = firestoreModule.getFirestore(app);
      return {
        db,
        addDoc: firestoreModule.addDoc,
        collection: firestoreModule.collection,
        doc: firestoreModule.doc,
        getDocs: firestoreModule.getDocs,
        orderBy: firestoreModule.orderBy,
        query: firestoreModule.query,
        serverTimestamp: firestoreModule.serverTimestamp,
        setDoc: firestoreModule.setDoc
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

  return snapshot.docs.map((doc) => doc.data());
}

function normalizeInstitution(institution) {
  const year = Number(institution.year) || currentYear;
  const name = String(institution.name || "").trim();
  const startWeek = Math.min(Math.max(Number(institution.startWeek) || 1, 1), 13);

  return {
    key: institution.key || `${year}-${encodeURIComponent(name)}`,
    name,
    year,
    startWeek
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
      map.set(institution.key, institution);
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

function getSelectedInstitution() {
  return institutionsCache.find((institution) => institution.key === institutionSelect?.value);
}

function renderInstitutionOptions() {
  const selectedYear = Number(classYearSelect?.value) || currentYear;
  const studentInstitutions = institutionsCache.filter((institution) => institution.year === selectedYear);

  if (institutionSelect) {
    institutionSelect.innerHTML = '<option value="">기관을 선택하세요</option>';
    studentInstitutions.forEach((institution) => {
      const option = document.createElement("option");
      option.value = institution.key;
      option.textContent = `${institution.name} (${institution.startWeek}주차 시작)`;
      institutionSelect.appendChild(option);
    });
  }

  if (adminInstitutionFilter) {
    const selectedFilter = adminInstitutionFilter.value;
    adminInstitutionFilter.innerHTML = '<option value="">전체 기관</option>';
    institutionsCache
      .filter((institution) => String(institution.year) === String(adminYearFilter?.value || currentYear))
      .forEach((institution) => {
        const option = document.createElement("option");
        option.value = institution.name;
        option.textContent = `${institution.name} (${institution.startWeek}주차 시작)`;
        adminInstitutionFilter.appendChild(option);
      });
    adminInstitutionFilter.value = selectedFilter;
  }
}

function populateYearSelects() {
  const years = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2];
  [classYearSelect, adminYearFilter, institutionYearSelect].forEach((select) => {
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

function getSelectedCheckboxes() {
  return Array.from(document.querySelectorAll(".check-list input:checked")).map((item) => item.value);
}

function getNextAttendance() {
  const selected = document.querySelector('input[name="nextAttendance"]:checked');
  return selected ? selected.value : "";
}

function validateSubmission(data) {
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

  if (data.nextAttendance === "참여할 수 없습니다." && !data.absenceReason) {
    return "참여할 수 없는 사유를 입력해 주세요.";
  }

  return "";
}

async function submitToGoogleForm(data) {
  const formData = new FormData();
  formData.append(GOOGLE_FORM_ENTRIES.name, data.name);
  formData.append(GOOGLE_FORM_ENTRIES.phoneLast4, data.phoneLast4);
  formData.append(GOOGLE_FORM_ENTRIES.institutionName, data.institutionName);
  data.completedItems.forEach((item) => {
    formData.append(GOOGLE_FORM_ENTRIES.completedItems, item);
  });
  formData.append(GOOGLE_FORM_ENTRIES.review, data.review);
  formData.append(GOOGLE_FORM_ENTRIES.nextAttendance, data.nextAttendance);
  formData.append(GOOGLE_FORM_ENTRIES.absenceReason, data.absenceReason);
  formData.append(GOOGLE_FORM_ENTRIES.comment, "");

  await fetch(GOOGLE_FORM_ACTION, {
    method: "POST",
    body: formData,
    mode: "no-cors"
  });
}

async function submitReview() {
  const selectedInstitution = getSelectedInstitution();
  const data = {
    name: document.getElementById("studentName").value.trim(),
    phoneLast4: document.getElementById("phoneLast4").value.trim(),
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
    submittedAt: new Date().toLocaleString("ko-KR")
  };

  const errorMessage = validateSubmission(data);
  if (errorMessage) {
    saveMessage.textContent = errorMessage;
    return;
  }

  const submissions = getSubmissions();
  const existingIndex = submissions.findIndex((item) => (
    item.name === data.name && item.phoneLast4 === data.phoneLast4
  ));

  if (existingIndex >= 0) {
    submissions[existingIndex] = data;
  } else {
    submissions.push(data);
  }

  saveSubmissions(submissions);

  try {
    await Promise.all([
      submitToGoogleForm(data),
      submitToFirebase(data)
    ]);
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
        <dt>다음 수업 참여 여부</dt>
        <dd>${escapeHtml(item.nextAttendance)}${item.absenceReason ? `<br>사유: ${escapeHtml(item.absenceReason)}` : ""}</dd>
        <dt>제출 시간</dt>
        <dd>${escapeHtml(item.submittedAt)}</dd>
      </dl>
    `;
    adminList.appendChild(card);
  });
  });
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

async function addInstitution(event) {
  event.preventDefault();

  const name = newInstitutionNameInput?.value.trim();
  const year = Number(institutionYearSelect?.value) || currentYear;
  const startWeek = Number(institutionStartWeekSelect?.value) || 1;

  if (!name) {
    showToast("기관명을 입력해 주세요.");
    return;
  }

  const institution = normalizeInstitution({ name, year, startWeek });
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
  document.getElementById("adminButton")?.addEventListener("click", () => showScreen("admin"));
  document.getElementById("submitButton")?.addEventListener("click", submitReview);
  document.getElementById("printButton")?.addEventListener("click", () => window.print());
  classYearSelect?.addEventListener("change", renderInstitutionOptions);
  adminYearFilter?.addEventListener("change", () => {
    renderInstitutionOptions();
    renderAdminList();
  });
  adminInstitutionFilter?.addEventListener("change", renderAdminList);
  institutionForm?.addEventListener("submit", addInstitution);
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
}

populateYearSelects();
populateStartWeekSelect();
buildWeekCards();
bindEvents();
loadInstitutions();

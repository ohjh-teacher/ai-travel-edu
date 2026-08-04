const SPECIAL_FIREBASE_CONFIG = window.AI_TRAVEL_FIREBASE_CONFIG;
const SPECIAL_SUBMISSIONS_COLLECTION = "week1Submissions";
const SPECIAL_STORAGE_KEY = "smartTravelClassSubmissions";
const SPECIAL_PAGE_CONFIG = document.body.dataset;
const SPECIAL_LECTURE_ID = SPECIAL_PAGE_CONFIG.lectureId || "custom-travel";
const SPECIAL_LECTURE_TITLE = SPECIAL_PAGE_CONFIG.lectureTitle || "AI 가이드와 함께 떠나는 맞춤 여행";
const SPECIAL_FIXED_INSTITUTION = {
  key: SPECIAL_PAGE_CONFIG.institutionKey || "bangbae-open-culture-center",
  name: SPECIAL_PAGE_CONFIG.institutionName || "방배열린문화센터(방배4동 주민센터)",
  startWeek: 1
};
const SPECIAL_MAX_FILES = 3;
const SPECIAL_MAX_FILE_SIZE = 5 * 1024 * 1024;

const specialReviewForm = document.getElementById("specialReviewForm");
const specialReviewYear = document.getElementById("specialReviewYear");
const specialReviewInstitution = document.getElementById("specialReviewInstitution");
const specialReviewFiles = document.getElementById("specialReviewFiles");
const specialReviewPrivacy = document.getElementById("specialReviewPrivacy");
const specialReviewMessage = document.getElementById("specialReviewMessage");
const specialReviewSubmit = document.getElementById("specialReviewSubmit");
const specialReviewReturn = document.getElementById("specialReviewReturn");
const specialCurrentYear = new Date().getFullYear();
let specialFirebasePromise = null;

function getSpecialFirebaseServices() {
  if (!specialFirebasePromise) {
    specialFirebasePromise = Promise.all([
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
      import("https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js")
    ]).then(([appModule, firestoreModule, storageModule]) => {
      const app = appModule.initializeApp(SPECIAL_FIREBASE_CONFIG);
      return {
        db: firestoreModule.getFirestore(app),
        storage: storageModule.getStorage(app),
        addDoc: firestoreModule.addDoc,
        collection: firestoreModule.collection,
        serverTimestamp: firestoreModule.serverTimestamp,
        getDownloadURL: storageModule.getDownloadURL,
        ref: storageModule.ref,
        uploadBytes: storageModule.uploadBytes
      };
    });
  }

  return specialFirebasePromise;
}

function populateSpecialYears() {
  [specialCurrentYear - 1, specialCurrentYear, specialCurrentYear + 1].forEach((year) => {
    const option = document.createElement("option");
    option.value = String(year);
    option.textContent = `${year}년`;
    specialReviewYear.appendChild(option);
  });
  specialReviewYear.value = String(specialCurrentYear);
}

function renderSpecialInstitutions() {
  specialReviewInstitution.innerHTML = "";
  const option = document.createElement("option");
  option.value = SPECIAL_FIXED_INSTITUTION.key;
  option.textContent = SPECIAL_FIXED_INSTITUTION.name;
  option.dataset.name = SPECIAL_FIXED_INSTITUTION.name;
  option.dataset.startWeek = String(SPECIAL_FIXED_INSTITUTION.startWeek);
  specialReviewInstitution.appendChild(option);
}

function sanitizeSpecialPath(value) {
  return String(value || "unknown").replace(/[^a-zA-Z0-9가-힣._-]/g, "-");
}

function getSelectedSpecialInstitution() {
  const option = specialReviewInstitution.options[specialReviewInstitution.selectedIndex];
  return {
    key: option?.value || "",
    name: option?.dataset.name || option?.textContent || "개인 참여",
    startWeek: Number(option?.dataset.startWeek) || 1
  };
}

function validateSpecialFiles(files) {
  if (files.length > SPECIAL_MAX_FILES) {
    return "이미지는 최대 3장까지 올릴 수 있습니다.";
  }
  if (files.some((file) => !file.type.startsWith("image/"))) {
    return "이미지 파일만 올릴 수 있습니다.";
  }
  if (files.some((file) => file.size > SPECIAL_MAX_FILE_SIZE)) {
    return "이미지는 한 장당 5MB 이하만 올릴 수 있습니다.";
  }
  return "";
}

async function uploadSpecialFiles(files, data) {
  if (!files.length) {
    return [];
  }

  const services = await getSpecialFirebaseServices();
  const basePath = [
    "submissions",
    String(data.classYear),
    sanitizeSpecialPath(data.institutionName),
    `special-${SPECIAL_LECTURE_ID}`,
    sanitizeSpecialPath(data.submissionId)
  ].join("/");

  return Promise.all(files.map(async (file, index) => {
    const fileName = `${index + 1}-${Date.now()}-${sanitizeSpecialPath(file.name)}`;
    const path = `${basePath}/${fileName}`;
    const fileRef = services.ref(services.storage, path);
    await services.uploadBytes(fileRef, file, {
      contentType: file.type,
      customMetadata: {
        studentName: data.name,
        phoneLast4: data.phoneLast4,
        institutionName: data.institutionName,
        courseType: "special",
        lectureId: SPECIAL_LECTURE_ID
      }
    });
    return {
      name: file.name,
      size: file.size,
      type: file.type,
      path,
      url: await services.getDownloadURL(fileRef)
    };
  }));
}

function saveSpecialSubmissionLocally(data) {
  const saved = JSON.parse(localStorage.getItem(SPECIAL_STORAGE_KEY) || "[]");
  const existingIndex = saved.findIndex((item) => item.submissionId === data.submissionId);
  if (existingIndex >= 0) {
    saved[existingIndex] = data;
  } else {
    saved.push(data);
  }
  localStorage.setItem(SPECIAL_STORAGE_KEY, JSON.stringify(saved));
}

async function submitSpecialReview(event) {
  event.preventDefault();
  const name = document.getElementById("specialReviewName").value.trim();
  const phoneLast4 = document.getElementById("specialReviewPhone").value.trim();
  const review = document.getElementById("specialReviewText").value.trim();
  const completedItems = Array.from(document.querySelectorAll('input[name="specialCompleted"]:checked')).map((item) => item.value);
  const files = Array.from(specialReviewFiles.files || []);
  const institution = getSelectedSpecialInstitution();

  if (!name) {
    specialReviewMessage.textContent = "이름을 입력해 주세요.";
    return;
  }
  if (!/^\d{4}$/.test(phoneLast4)) {
    specialReviewMessage.textContent = "휴대전화 뒷번호 4자리를 숫자로 입력해 주세요.";
    return;
  }
  if (completedItems.length === 0) {
    specialReviewMessage.textContent = "오늘 해낸 것을 한 가지 이상 선택해 주세요.";
    return;
  }
  if (!review) {
    specialReviewMessage.textContent = "가장 재미있었던 점을 적어 주세요.";
    return;
  }
  if (!specialReviewPrivacy.checked) {
    specialReviewMessage.textContent = "개인정보 수집 동의가 필요합니다.";
    return;
  }

  const fileError = validateSpecialFiles(files);
  if (fileError) {
    specialReviewMessage.textContent = fileError;
    return;
  }

  const submittedAt = new Date().toLocaleString("ko-KR");
  const data = {
    name,
    phoneLast4,
    classYear: Number(specialReviewYear.value) || specialCurrentYear,
    institutionKey: institution.key,
    institutionName: institution.name,
    institutionStartWeek: institution.startWeek,
    weekNumber: "특강",
    courseType: "special",
    lectureId: SPECIAL_LECTURE_ID,
    lectureTitle: SPECIAL_LECTURE_TITLE,
    attendanceStatus: "출석",
    completedItems,
    review,
    nextAttendance: "해당 없음",
    absenceReason: "",
    privacyConsent: true,
    submittedAt,
    submissionId: `${Date.now()}-special-${phoneLast4}`
  };

  specialReviewSubmit.disabled = true;
  specialReviewMessage.textContent = files.length ? "이미지와 후기를 저장하고 있습니다." : "후기를 저장하고 있습니다.";

  try {
    const services = await getSpecialFirebaseServices();
    data.attachments = await uploadSpecialFiles(files, data);
    const savedDocument = await services.addDoc(services.collection(services.db, SPECIAL_SUBMISSIONS_COLLECTION), {
      ...data,
      createdAt: services.serverTimestamp()
    });
    data.firebaseId = savedDocument.id;
    saveSpecialSubmissionLocally(data);
    specialReviewForm.reset();
    specialReviewYear.value = String(specialCurrentYear);
    renderSpecialInstitutions();
    specialReviewMessage.textContent = "제출했습니다. 오늘의 특강 후기가 저장되었습니다. 이제 이 화면을 닫아 주세요.";
    if (specialReviewReturn) specialReviewReturn.hidden = false;
  } catch (error) {
    specialReviewMessage.textContent = "제출하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 눌러 주세요.";
  } finally {
    specialReviewSubmit.disabled = false;
  }
}

populateSpecialYears();
specialReviewYear.addEventListener("change", renderSpecialInstitutions);
specialReviewForm.addEventListener("submit", submitSpecialReview);
renderSpecialInstitutions();

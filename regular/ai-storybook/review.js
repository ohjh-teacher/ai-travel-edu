(() => {
  "use strict";

  const MAX_FILES = 3;
  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const form = document.getElementById("storybookReviewForm");
  const yearSelect = document.getElementById("storybookReviewYear");
  const filesInput = document.getElementById("storybookReviewFiles");
  const privacyInput = document.getElementById("storybookReviewPrivacy");
  const submitButton = document.getElementById("storybookReviewSubmit");
  const message = document.getElementById("storybookReviewMessage");
  const returnLink = document.getElementById("storybookReviewReturn");
  const currentYear = new Date().getFullYear();
  let firebasePromise;

  function setMessage(text) {
    message.textContent = text;
  }

  function populateYears() {
    [currentYear - 1, currentYear, currentYear + 1].forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = `${year}년`;
      yearSelect.appendChild(option);
    });
    yearSelect.value = String(currentYear);
  }

  function getFirebaseServices() {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js")
      ]).then(([appModule, firestoreModule, storageModule]) => {
        const app = appModule.initializeApp(window.AI_TRAVEL_FIREBASE_CONFIG);
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
    return firebasePromise;
  }

  function safePath(value) {
    return String(value || "unknown").replace(/[^a-zA-Z0-9가-힣_-]/g, "-");
  }

  function validateFiles(files) {
    if (files.length > MAX_FILES) return "워크시트 이미지는 최대 3장까지 첨부할 수 있습니다.";
    if (files.some((file) => !file.type.startsWith("image/"))) return "이미지 파일만 첨부할 수 있습니다.";
    if (files.some((file) => file.size > MAX_FILE_SIZE)) return "이미지는 장당 5MB 이하로 첨부해 주세요.";
    return "";
  }

  async function uploadFiles(files, data, services) {
    const basePath = [
      "submissions",
      String(data.classYear),
      "ai-storybook-regular",
      "week-1",
      safePath(data.submissionId)
    ].join("/");

    return Promise.all(files.map(async (file, index) => {
      const path = `${basePath}/${index + 1}-${Date.now()}-${safePath(file.name)}`;
      const fileRef = services.ref(services.storage, path);
      await services.uploadBytes(fileRef, file, {
        contentType: file.type,
        customMetadata: {
          studentName: data.name,
          phoneLast4: data.phoneLast4,
          courseType: "regular",
          lectureId: "ai-storybook-week-1"
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

  async function submitReview(event) {
    event.preventDefault();
    const name = document.getElementById("storybookReviewName").value.trim();
    const phoneLast4 = document.getElementById("storybookReviewPhone").value.trim();
    const review = document.getElementById("storybookReviewText").value.trim();
    const completedItems = Array.from(document.querySelectorAll('input[name="storybookCompleted"]:checked')).map((item) => item.value);
    const files = Array.from(filesInput.files || []);

    if (!name) return setMessage("이름을 입력해 주세요.");
    if (!/^\d{4}$/.test(phoneLast4)) return setMessage("휴대전화 뒷번호 4자리를 숫자로 입력해 주세요.");
    if (!completedItems.length) return setMessage("오늘 해낸 것을 한 가지 이상 선택해 주세요.");
    if (!review) return setMessage("오늘 수업에서 기억에 남은 점을 적어 주세요.");
    if (!privacyInput.checked) return setMessage("개인정보 수집 동의가 필요합니다.");

    const fileError = validateFiles(files);
    if (fileError) return setMessage(fileError);

    const data = {
      name,
      phoneLast4,
      classYear: Number(yearSelect.value) || currentYear,
      institutionKey: "ai-storybook-regular",
      institutionName: "AI 그림동화책 정규과정",
      institutionStartWeek: 1,
      weekNumber: 1,
      courseType: "regular",
      lectureId: "ai-storybook-week-1",
      lectureTitle: "AI 그림동화책 1주차",
      attendanceStatus: "출석",
      completedItems,
      review,
      nextAttendance: "미확인",
      absenceReason: "",
      privacyConsent: true,
      submittedAt: new Date().toLocaleString("ko-KR"),
      submissionId: `${Date.now()}-storybook-${phoneLast4}`
    };

    submitButton.disabled = true;
    setMessage(files.length ? "워크시트 이미지와 후기를 저장하고 있습니다." : "후기를 저장하고 있습니다.");

    try {
      const services = await getFirebaseServices();
      data.attachments = await uploadFiles(files, data, services);
      await services.addDoc(services.collection(services.db, "week1Submissions"), {
        ...data,
        createdAt: services.serverTimestamp()
      });
      form.reset();
      yearSelect.value = String(currentYear);
      setMessage("제출했습니다. 후기와 워크시트가 저장되었습니다.");
      returnLink.hidden = false;
    } catch (error) {
      setMessage("제출하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 눌러 주세요.");
    } finally {
      submitButton.disabled = false;
    }
  }

  populateYears();
  form.addEventListener("submit", submitReview);
})();
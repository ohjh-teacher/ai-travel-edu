(() => {
  "use strict";
  const COURSE_ID = "yongsan-elementary-ai";
  const COURSE_TITLE = "AI 창작 놀이터";
  const COLLECTION = "week1Submissions";
  const DEFAULT_INSTITUTION_KEY = "yongsan-youth-center-elementary";
  const DEFAULT_INSTITUTION_NAME = "용산청소년센터_초등";
  const yearSelect = document.getElementById("reviewYear");
  const institutionSelect = document.getElementById("reviewInstitution");
  const form = document.getElementById("yongsanElementaryReviewForm");
  const submitButton = document.getElementById("reviewSubmit");
  const message = document.getElementById("reviewMessage");
  const currentYear = new Date().getFullYear();
  const week = Math.min(4, Math.max(1, Number(new URLSearchParams(location.search).get("week")) || 1));
  let firebasePromise;

  document.getElementById("weekHeading").textContent = week + "주차 수업 후기 남기기";
  function setMessage(text) { message.textContent = text; }
  function populateYears() {
    [currentYear - 1, currentYear, currentYear + 1].forEach((year) => {
      const option = document.createElement("option");
      option.value = String(year); option.textContent = year + "년"; yearSelect.appendChild(option);
    });
    yearSelect.value = String(currentYear);
  }
  function getFirebaseServices() {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
      ]).then(([appModule, firestoreModule]) => {
        const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(window.AI_TRAVEL_FIREBASE_CONFIG);
        return {
          db: firestoreModule.getFirestore(app), addDoc: firestoreModule.addDoc,
          getDocs: firestoreModule.getDocs, collection: firestoreModule.collection,
          serverTimestamp: firestoreModule.serverTimestamp
        };
      });
    }
    return firebasePromise;
  }
  async function loadInstitutions() {
    institutionSelect.innerHTML = '<option value="' + DEFAULT_INSTITUTION_KEY + '" data-name="' + DEFAULT_INSTITUTION_NAME + '" data-start-week="1" selected>' + DEFAULT_INSTITUTION_NAME + '</option>';
    institutionSelect.disabled = true;
    try {
      const services = await getFirebaseServices();
      const snapshot = await services.getDocs(services.collection(services.db, "institutions"));
      const selectedYear = Number(yearSelect.value) || currentYear;
      snapshot.docs.map((doc) => ({key: doc.id, ...doc.data()}))
        .filter((item) => Number(item.year) === selectedYear && !item.hidden && item.name)
        .sort((a,b) => String(a.name).localeCompare(String(b.name), "ko"))
        .filter((item) => item.name !== DEFAULT_INSTITUTION_NAME)
        .forEach((item) => {
          const option = document.createElement("option");
          option.value = item.key; option.textContent = item.name;
          option.dataset.name = item.name; option.dataset.startWeek = String(Number(item.startWeek) || 1);
          institutionSelect.appendChild(option);
        });
      if (institutionSelect.options.length === 1) {
        const option = document.createElement("option"); option.textContent = "등록된 기관이 없습니다"; option.disabled = true; institutionSelect.appendChild(option);
      }
    } catch (error) {
      const option = document.createElement("option"); option.textContent = "추가 기관 목록을 불러오지 못했습니다"; option.disabled = true; institutionSelect.appendChild(option);
    } finally { institutionSelect.disabled = false; }
  }
  async function submitReview(event) {
    event.preventDefault();
    const name = document.getElementById("reviewName").value.trim();
    const phoneLast4 = document.getElementById("reviewPhone").value.trim();
    const review = document.getElementById("reviewText").value.trim();
    const completedItems = Array.from(document.querySelectorAll('input[name="completed"]:checked')).map((item) => item.value);
    const selected = institutionSelect.options[institutionSelect.selectedIndex];
    if (!institutionSelect.value) return setMessage("기관명을 선택해 주세요.");
    if (!name) return setMessage("이름을 입력해 주세요.");
    if (!/^\d{4}$/.test(phoneLast4)) return setMessage("휴대전화 뒷번호 4자리를 숫자로 입력해 주세요.");
    if (!completedItems.length) return setMessage("오늘 해낸 것을 한 가지 이상 선택해 주세요.");
    if (!review) return setMessage("오늘 수업에서 기억에 남은 점을 적어 주세요.");
    if (!document.getElementById("reviewPrivacy").checked) return setMessage("개인정보 수집 동의가 필요합니다.");
    const data = {
      name, phoneLast4, classYear: Number(yearSelect.value) || currentYear,
      institutionKey: institutionSelect.value, institutionName: selected?.dataset.name || selected?.textContent || "",
      institutionStartWeek: Number(selected?.dataset.startWeek) || 1,
      weekNumber: week, courseId: COURSE_ID, questionVersion: 1, courseType: "regular",
      lectureId: COURSE_ID + "-week-" + week, lectureTitle: COURSE_TITLE + " " + week + "주차",
      attendanceStatus: "출석", completedItems,
      questionAnswers: [
        ...completedItems.map((answer) => ({question: "오늘 해낸 것", answer})),
        {question: "오늘 수업에서 가장 기억에 남은 점", answer: review}
      ],
      review, nextAttendance: "미확인", absenceReason: "", privacyConsent: true,
      submittedAt: new Date().toLocaleString("ko-KR"),
      submissionId: Date.now() + "-yongsan-elementary-" + phoneLast4
    };
    submitButton.disabled = true; setMessage("후기를 저장하고 있습니다.");
    try {
      const services = await getFirebaseServices();
      await services.addDoc(services.collection(services.db, COLLECTION), {...data, createdAt: services.serverTimestamp()});
      form.reset(); yearSelect.value = String(currentYear);
      await loadInstitutions(); setMessage("제출했습니다. 이제 이 화면을 닫아 주세요.");
    } catch (error) { setMessage("제출하지 못했습니다. 인터넷 연결을 확인한 뒤 다시 눌러 주세요."); }
    finally { submitButton.disabled = false; }
  }
  populateYears(); yearSelect.addEventListener("change", loadInstitutions);
  form.addEventListener("submit", submitReview); loadInstitutions();
})();

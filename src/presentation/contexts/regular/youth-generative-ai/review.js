(() => {
  "use strict";
  const params = new URLSearchParams(location.search);
  const requestedWeek = Number(params.get("week"));
  const week = Number.isInteger(requestedWeek) && requestedWeek >= 1 && requestedWeek <= 7 ? requestedWeek : 1;
  const courseId = "youth-generative-ai";
  const form = document.getElementById("review-form");
  const button = document.getElementById("submit-button");
  const message = document.getElementById("message");
  const questions = ["오늘 직접 만든 결과물은 무엇인가요?", "가장 어려웠거나 다음에 고쳐 보고 싶은 점은 무엇인가요?", "오늘 수업은 어땠나요?"];
  const storageKey = `${courseId}-week-${week}-submitted`;
  let submitted = sessionStorage.getItem(storageKey) === "yes";
  let firebasePromise;
  document.getElementById("review-title").textContent = `${week}주차 수업 후기`;
  if (submitted) { button.disabled = true; message.textContent = "이 화면에서 이미 후기를 제출했습니다."; }

  function firebaseServices() {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
      ]).then(([appModule, firestore]) => {
        const app = appModule.initializeApp(window.AI_TRAVEL_FIREBASE_CONFIG);
        return { db: firestore.getFirestore(app), addDoc: firestore.addDoc, collection: firestore.collection, serverTimestamp: firestore.serverTimestamp };
      });
    }
    return firebasePromise;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitted || !form.reportValidity()) return;
    const name = document.getElementById("student-name").value.trim();
    const institutionName = document.getElementById("institution-name").value.trim() || "기관 미지정";
    const result = document.getElementById("result-answer").value.trim();
    const next = document.getElementById("next-answer").value.trim();
    const checkedRating = form.querySelector('input[name="rating"]:checked');
    if (!name || !result || !next || !checkedRating || !document.getElementById("consent").checked) {
      message.textContent = "모든 필수 항목을 작성하고 저장에 동의해 주세요.";
      return;
    }
    const rating = checkedRating.parentElement.textContent.trim();
    const data = {
      courseId,
      questionVersion: 1,
      courseType: "regular",
      lectureId: `${courseId}-week-${week}`,
      lectureTitle: `생성형 AI, 일상에서 콘텐츠 제작까지 ${week}주차`,
      weekNumber: week,
      classYear: new Date().getFullYear(),
      institutionName,
      name,
      review: result,
      questionAnswers: [
        { question: questions[0], answer: result },
        { question: questions[1], answer: next },
        { question: questions[2], answer: rating }
      ],
      satisfaction: Number(checkedRating.value),
      privacyConsent: true,
      submittedAt: new Date().toLocaleString("ko-KR")
    };
    button.disabled = true;
    message.textContent = "후기를 저장하고 있어요.";
    try {
      const services = await firebaseServices();
      await services.addDoc(services.collection(services.db, "week1Submissions"), { ...data, createdAt: services.serverTimestamp() });
      submitted = true;
      sessionStorage.setItem(storageKey, "yes");
      form.reset();
      message.textContent = "제출했습니다. 이 화면을 닫아 주세요.";
    } catch (error) {
      button.disabled = false;
      message.textContent = "저장하지 못했습니다. 연결을 확인한 뒤 다시 제출해 주세요.";
    }
  });
})();

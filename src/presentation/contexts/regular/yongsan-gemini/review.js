(() => {
  "use strict";

  const form = document.getElementById("yongsanReviewForm");
  const button = document.getElementById("submitReview");
  const message = document.getElementById("submitMessage");
  const questions = [
    "AI에게 처음 어떤 그림을 만들어 달라고 말했나요?",
    "AI가 만든 그림에서 내 생각과 달랐던 부분은 무엇인가요?",
    "그 부분을 고치려고 AI에게 어떤 말을 했나요?",
    "오늘 수업은 어땠나요?",
    "가장 재미있었던 것이나 다음 시간에 더 해보고 싶은 것을 써 주세요."
  ];
  let firebasePromise;
  let submitted = false;

  function firebaseServices() {
    if (!firebasePromise) {
      firebasePromise = Promise.all([
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js"),
        import("https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js")
      ]).then(([appModule, firestore]) => {
        const app = appModule.initializeApp(window.AI_TRAVEL_FIREBASE_CONFIG);
        return {
          db: firestore.getFirestore(app),
          addDoc: firestore.addDoc,
          collection: firestore.collection,
          serverTimestamp: firestore.serverTimestamp
        };
      });
    }
    return firebasePromise;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (submitted || !form.reportValidity()) return;

    const name = document.getElementById("studentName").value.trim();
    const answers = [1, 2, 3, 5].map((number) =>
      document.getElementById(`answer${number}`).value.trim()
    );
    const rating = form.querySelector('input[name="satisfaction"]:checked')?.value || "";
    if (!name || answers.some((answer) => !answer) || !rating) {
      message.textContent = "모든 질문에 한 줄 이상 답해 주세요.";
      return;
    }
    if (!document.getElementById("privacyConsent").checked) {
      message.textContent = "저장 동의를 확인해 주세요.";
      return;
    }

    const ratingLabel = form.querySelector('input[name="satisfaction"]:checked').nextElementSibling.textContent.trim();
    const questionAnswers = [
      { question: questions[0], answer: answers[0] },
      { question: questions[1], answer: answers[1] },
      { question: questions[2], answer: answers[2] },
      { question: questions[3], answer: ratingLabel },
      { question: questions[4], answer: answers[3] }
    ];
    button.disabled = true;
    message.textContent = "후기를 저장하고 있어요.";
    try {
      const services = await firebaseServices();
      await services.addDoc(services.collection(services.db, "week1Submissions"), {
        courseId: "yongsan-gemini",
        questionVersion: 1,
        courseType: "regular",
        lectureId: "yongsan-gemini-week-1",
        lectureTitle: "Gemini 생성형 AI 놀이터 · 1주차",
        classYear: new Date().getFullYear(),
        institutionName: "용산청소년센터",
        weekNumber: 1,
        name,
        satisfaction: Number(rating),
        questionAnswers,
        review: answers[3],
        privacyConsent: true,
        submittedAt: new Date().toLocaleString("ko-KR"),
        submissionId: `${Date.now()}-yongsan-${Math.random().toString(36).slice(2, 10)}`,
        createdAt: services.serverTimestamp()
      });
      submitted = true;
      form.reset();
      message.textContent = "제출했어요. 이제 이 화면을 닫아 주세요.";
    } catch (error) {
      button.disabled = false;
      message.textContent = "제출하지 못했어요. 인터넷 연결을 확인하고 다시 눌러 주세요.";
    }
  });
})();

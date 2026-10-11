(() => {
  "use strict";
  const lessons = [
    {
      title: "AI와 첫 대화, 나의 주제 정하기",
      lead: "일상에서 궁금하거나 바꾸고 싶은 일을 한 가지 고르고, 7주 동안 만들 콘텐츠의 출발점으로 삼습니다.",
      concept: ["생성형 AI는 입력을 바탕으로 새 글·이미지·소리 등을 만듭니다.", "답을 그대로 믿거나 개인정보를 입력하지 않습니다.", "좋은 요청에는 목적, 대상, 원하는 결과 형태가 들어갑니다."],
      prompt: "나는 일상에서 [관심사]를 자주 생각해. 청년이 공감할 만한 콘텐츠 주제를 찾고 싶어. 한 번에 질문 하나씩 해 줘. 내가 답한 사실만 사용하고, 마지막에 주제·대상·핵심 메시지를 세 줄로 정리해 줘.",
      practice: ["관심사를 단어 세 개 또는 짧은 문장으로 적습니다.", "AI의 질문에 답하며 주제·대상·메시지를 고릅니다.", "내 생각과 다른 부분을 고쳐 주제 카드를 저장합니다."],
      result: "주제 카드: 주제 1개 · 읽거나 볼 사람 · 전하고 싶은 메시지 1문장",
      next: "2주차에는 이 주제 카드로 사실과 자료를 조사합니다."
    },
    {
      title: "찾고 확인하고 요약하기",
      lead: "1주차 주제 카드에서 확인이 필요한 질문을 뽑고, 믿을 수 있는 자료로 사실을 점검합니다.",
      concept: ["AI의 출처 목록에 없는 자료가 섞일 수 있습니다.", "작성 기관, 게시 날짜, 원문 주소를 직접 확인합니다.", "의견과 확인된 사실을 구분해 기록합니다."],
      prompt: "지난주 내 주제 카드는 [주제 카드]야. 이 주제로 콘텐츠를 만들기 전에 확인할 질문 세 개를 뽑아 줘. 답을 단정하지 말고, 각 질문에 어떤 공식 자료나 원문을 찾아야 하는지 알려 줘.",
      practice: ["세 질문 중 가장 중요한 것부터 검색합니다.", "원문을 열어 기관·날짜·내용을 대조합니다.", "확인한 사실과 출처를 사실 메모에 적고, 못 확인한 내용은 보류합니다."],
      result: "사실 메모: 확인한 내용 3개 · 원문 주소와 날짜 · 아직 불확실한 내용",
      next: "3주차에는 사실 메모만 근거로 소개글을 씁니다."
    },
    {
      title: "일상 아이디어를 글 콘텐츠로",
      lead: "확인한 사실과 내 경험을 구분해, 읽는 사람이 이해하기 쉬운 짧은 글을 만듭니다.",
      concept: ["제목은 내용을 과장하지 않고 핵심을 알려 줍니다.", "AI가 새 사실·수치·경험을 지어내지 않도록 요청합니다.", "내 목소리에 맞게 표현을 고친 뒤 소리 내어 읽습니다."],
      prompt: "내 주제 카드와 사실 메모를 바탕으로 청년에게 보여 줄 소개글을 써 줘. 제목 한 개, 본문 120자 안팎, 마지막 행동 제안 한 문장으로 구성해 줘. 메모에 없는 사실이나 내 경험은 만들지 말고 빈칸으로 남겨 줘.",
      practice: ["주제 카드와 확인한 사실만 같은 대화방에 넣습니다.", "초안을 만들고 어려운 말·과장을 표시합니다.", "독자에게 자연스럽게 읽히도록 다시 요청하고 직접 수정합니다."],
      result: "글 초안: 제목 · 짧은 본문 · 행동 제안 · 사용한 출처",
      next: "4주차에는 이 글의 핵심 장면을 이미지로 표현합니다."
    },
    {
      title: "이미지 만들고 다듬기",
      lead: "3주차 글에서 한 장면을 고르고, 시선과 색·구도를 설명해 이미지로 만듭니다.",
      concept: ["이미지는 사실을 증명하는 자료로 쓰지 않습니다.", "타인의 얼굴·상표·저작물을 허락 없이 재현하지 않습니다.", "생성한 이미지의 손·글자·배경을 확대해 확인합니다."],
      prompt: "내 글의 핵심 메시지는 [핵심 메시지]야. 이를 보여 줄 16:9 가로 이미지 한 장을 만들어 줘. 주인공은 [대상], 장소는 [장소], 분위기는 [색과 빛]으로 해 줘. 이미지 안에는 글자를 넣지 말아 줘.",
      practice: ["글의 핵심 장면을 한 문장으로 정합니다.", "대상·장소·분위기를 바꿔 두 가지 시안을 만듭니다.", "어색한 부분을 수정하고 실제 사진처럼 오해될 표현은 피합니다."],
      result: "대표 이미지 1장 · 이미지 설명 한 문장 · 사용한 생성 도구 기록",
      next: "5주차에는 글과 이미지에 어울리는 소리를 만듭니다."
    },
    {
      title: "음악과 소리로 분위기 만들기",
      lead: "지금까지 만든 글과 이미지를 보고 영상에 어울리는 짧은 배경음악을 설계합니다.",
      concept: ["분위기·악기·속도·길이를 설명하면 원하는 소리에 가까워집니다.", "실존 가수의 목소리나 특정 곡을 그대로 흉내 내도록 요청하지 않습니다.", "내보내기와 공개 사용 조건은 사용한 서비스에서 확인합니다."],
      prompt: "[글의 주제]를 소개하는 30초 영상에 쓸 배경음악 아이디어를 써 줘. 분위기는 [밝음/차분함], 악기는 [악기], 속도는 [느림/보통/빠름]이야. 말소리를 가리지 않도록 단순한 연주곡으로 설명해 줘.",
      practice: ["글과 이미지의 분위기를 단어 세 개로 적습니다.", "AI가 제안한 설명으로 짧은 연주곡 두 개를 만듭니다.", "영상에 더 어울리는 곡을 고르고 파일·사용 조건을 기록합니다."],
      result: "30초 안팎 음악 1개 · 분위기 설명 · 사용 가능 범위 메모",
      next: "6주차에는 이미지와 음악을 장면표에 맞춰 영상으로 묶습니다."
    },
    {
      title: "짧은 영상으로 연결하기",
      lead: "글·이미지·음악을 한 편의 짧은 영상에 넣고 시작, 핵심, 마무리 순서를 정합니다.",
      concept: ["짧은 영상도 메시지 한 가지가 분명해야 합니다.", "화면마다 글을 적게 넣고 소리 없이 봐도 이해되게 만듭니다.", "이미지·음악 파일의 권리와 공개 범위를 다시 확인합니다."],
      prompt: "내 소개글은 [글], 대표 이미지는 [이미지 설명], 음악은 [분위기]야. 30초 영상 장면표를 3장면으로 만들어 줘. 각 장면의 시간, 화면, 화면 글자, 음악 변화를 적고 메모에 없는 사실은 추가하지 마.",
      practice: ["장면표를 보고 각 장면에 넣을 자료를 고릅니다.", "영상 도구에서 이미지·제목·음악을 순서대로 배치합니다.", "처음부터 끝까지 재생해 글자 크기·길이·소리 크기를 조정합니다."],
      result: "30초 안팎 영상 초안 · 장면표 · 사용한 자산 목록",
      next: "7주차에는 사실과 권리를 최종 점검하고 공유합니다."
    },
    {
      title: "완성작 점검과 공유",
      lead: "7주 동안 만든 콘텐츠를 다시 보고, 내가 고른 메시지가 정확히 전달되는지 확인합니다.",
      concept: ["화면의 사실·숫자·출처를 다시 확인합니다.", "개인정보와 타인의 얼굴·목소리·저작물이 들어갔는지 살핍니다.", "공개할 범위를 정하고 AI를 사용한 부분을 설명할 수 있어야 합니다."],
      prompt: "내 영상의 제목과 장면표는 [제목과 장면표]야. 공유 전 점검표를 만들어 줘. 사실과 출처, 개인정보, 이미지·음악 사용 권한, 자막 가독성, AI 사용 표시를 각각 한 문장 질문으로 적어 줘. 확인되지 않은 항목은 ‘확인 필요’로 남겨 줘.",
      practice: ["점검표에서 확인 필요 항목을 하나씩 해결합니다.", "완성작을 보여 주고 주제·제작 과정·수정한 점을 짧게 소개합니다.", "공개 범위와 파일 보관 위치를 정하고 서로 피드백을 나눕니다."],
      result: "최종 영상 1편 · 점검표 · 제작 과정 소개 3문장",
      next: "수업이 끝난 뒤에도 같은 점검표로 새 콘텐츠를 만들어 보세요."
    }
  ];

  const params = new URLSearchParams(location.search);
  const number = Number(params.get("week"));
  const week = Number.isInteger(number) && number >= 1 && number <= lessons.length ? number : 1;
  const lesson = lessons[week - 1];
  const deck = document.getElementById("deck");
  document.title = `${week}주차 | ${lesson.title}`;
  document.getElementById("week-label").textContent = `${week}주차 · ${lesson.title}`;

  function slide(kicker, title, content) {
    const section = document.createElement("section");
    section.className = "slide";
    section.innerHTML = `<p class="kicker"></p><h2></h2>`;
    section.querySelector(".kicker").textContent = kicker;
    section.querySelector("h2").textContent = title;
    section.append(content);
    return section;
  }
  function paragraph(value, className = "") {
    const p = document.createElement("p");
    p.textContent = value;
    if (className) p.className = className;
    return p;
  }
  function list(items, ordered = false) {
    const el = document.createElement(ordered ? "ol" : "ul");
    items.forEach((item) => { const li = document.createElement("li"); li.textContent = item; el.append(li); });
    return el;
  }
  const opening = document.createElement("section");
  opening.className = "slide";
  opening.append(paragraph(`WEEK ${week} · GENERATIVE AI`, "kicker"));
  const heading = document.createElement("h1"); heading.textContent = lesson.title; opening.append(heading);
  opening.append(paragraph(lesson.lead, "lead"), paragraph(`${week}주차 · 생성형 AI, 일상에서 콘텐츠 제작까지`, "tag"));
  deck.append(opening);
  deck.append(slide("핵심 개념 · 안전 원칙", "먼저 알아볼 것", list(lesson.concept)));
  const promptBody = document.createElement("div");
  const promptBox = document.createElement("div"); promptBox.className = "prompt-box";
  promptBox.append(paragraph(lesson.prompt));
  const copyButton = document.createElement("button"); copyButton.type = "button"; copyButton.textContent = "예시 문장 복사";
  copyButton.addEventListener("click", async () => { await navigator.clipboard.writeText(lesson.prompt); copyButton.textContent = "복사했습니다"; });
  promptBox.append(copyButton); promptBody.append(promptBox, paragraph("[대괄호] 안의 내용은 내 주제와 결과물에 맞게 바꿔 입력하세요.", "note"));
  deck.append(slide("설명과 시범", "이렇게 AI에게 요청해요", promptBody));
  deck.append(slide("단계별 실습", "직접 만들어 봐요", list(lesson.practice, true)));
  const resultBody = document.createElement("div");
  resultBody.append(paragraph(lesson.result, "lead"), paragraph(lesson.next, "note"));
  deck.append(slide("결과 확인 · 다음 주 연결", "오늘 남길 결과물", resultBody));
  const reviewBody = document.createElement("div"); reviewBody.className = "review-layout";
  const reviewText = document.createElement("div");
  reviewText.append(paragraph("휴대전화로 QR을 찍거나 아래 링크를 눌러 오늘의 후기를 제출해 주세요."));
  const reviewLink = document.createElement("a"); reviewLink.href = `review.html?week=${week}`; reviewLink.textContent = "후기 제출 화면 열기 →";
  reviewText.append(reviewLink); reviewBody.append(reviewText);
  const qr = document.createElement("img");
  const reviewUrl = `https://aitraveledu.web.app/regular/youth-generative-ai/review.html?week=${week}`;
  qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(reviewUrl)}`;
  qr.alt = `${week}주차 후기 제출 QR코드`; reviewBody.append(qr);
  deck.append(slide("수업 후기", "오늘 배운 것을 남겨요", reviewBody));

  const slides = [...deck.querySelectorAll(".slide")];
  const prev = document.getElementById("prev-slide");
  const next = document.getElementById("next-slide");
  const count = document.getElementById("slide-count");
  let current = 0;
  function show(index) {
    current = Math.max(0, Math.min(slides.length - 1, index));
    slides.forEach((item, i) => { item.classList.toggle("active", i === current); item.setAttribute("aria-hidden", String(i !== current)); });
    prev.disabled = current === 0; next.disabled = current === slides.length - 1;
    count.textContent = `${current + 1} / ${slides.length}`;
  }
  prev.addEventListener("click", () => show(current - 1));
  next.addEventListener("click", () => show(current + 1));
  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown"].includes(event.key)) show(current + 1);
    if (["ArrowLeft", "PageUp"].includes(event.key)) show(current - 1);
  });
  show(0);
})();

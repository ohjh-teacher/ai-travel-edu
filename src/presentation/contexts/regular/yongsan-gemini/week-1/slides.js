(() => {
  const slides = [...document.querySelectorAll(".slide")];
  const previousButton = document.getElementById("prevButton");
  const nextButton = document.getElementById("nextButton");
  const currentSlide = document.getElementById("currentSlide");
  const totalSlides = document.getElementById("totalSlides");
  const progressBar = document.getElementById("progressBar");
  const fullscreenButton = document.getElementById("fullscreenButton");
  const dailyDialog = document.getElementById("dailyDialog");
  const dailyDialogTitle = document.getElementById("dailyDialogTitle");
  const dailyTopics = [...dailyDialog.querySelectorAll(".daily-dialog-topic")];
  const extraTopic = document.getElementById("extraTopic");
  const extraTopicDetails = document.getElementById("extraTopicDetails");
  const oldSlideLinks = { 36:27, 37:28, 38:29, 39:30, 40:31, 41:31, 42:32, 43:33, 44:33, 45:34, 46:35 };
  const extraDetails = {
    said: {
      title: "내가 말한 것",
      lead: "“축구하는 문어를 그려줘.”",
      details: [["확실히 알려 준 것", "주인공은 문어이고, 하는 일은 축구예요."], ["생각해 볼 점", "색, 장소, 표정, 축구공 모습은 아직 말하지 않았어요."]],
      summary: "AI에게 말한 내용과 내가 머릿속으로만 생각한 내용을 구분해 봐요."
    },
    filled: {
      title: "AI가 채운 것",
      lead: "내가 말하지 않은 부분은 어떻게 나왔나요?",
      details: [["그림에서 찾기", "문어의 색·장소·표정·축구공 모습을 하나씩 확인해요."], ["왜 다를까요?", "AI는 말한 것을 바탕으로 그림을 완성하지만, 말하지 않은 내 생각까지 정확히 알지는 못해요."]],
      summary: "실제 생성된 그림을 보며 예상과 달랐던 부분을 이야기해 봐요."
    },
    "part-who": {
      title: "누가?",
      lead: "그림의 주인공을 알려 줘요.",
      details: [["짧은 말", "문어"], ["더 자세한 말", "보라색 문어"]],
      summary: "색이나 특징을 더하면 주인공을 구체적으로 설명할 수 있어요."
    },
    "part-where": {
      title: "어디서?",
      lead: "주인공이 있는 장소를 알려 줘요.",
      details: [["짧은 말", "운동장"], ["더 자세한 말", "초등학교 운동장"]],
      summary: "장소를 말하지 않으면 AI가 바닷속처럼 다른 곳을 그릴 수도 있어요."
    },
    "part-what": {
      title: "무엇을?",
      lead: "주인공이 하는 행동을 알려 줘요.",
      details: [["짧은 말", "축구"], ["더 자세한 말", "축구를 하며 골을 넣어요"]],
      summary: "무엇을 하는지 말하면 장면의 중심이 분명해져요."
    },
    "part-how": {
      title: "어떤 모습?",
      lead: "보여 주고 싶은 자세나 표정을 더해요.",
      details: [["예시", "골을 넣고 여덟 개의 팔을 흔들며 신나 해요."], ["살펴보기", "AI가 팔과 축구공을 어떻게 그렸는지 확인해 봐요."]],
      summary: "원하는 모습을 한두 가지 더 알려 줘도 좋아요."
    },
    "part-feel": {
      title: "어떤 느낌?",
      lead: "그림의 분위기와 표현 방식을 알려 줘요.",
      details: [["예시", "밝고 신나는 만화처럼 그려 줘."], ["다른 선택", "차분한 느낌이나 종이공예처럼 보이는 모습도 생각할 수 있어요."]],
      summary: "느낌을 바꾸면 같은 장면도 다르게 보일 수 있어요."
    },
    "short-prompt": {
      title: "첫 번째 프롬프트",
      lead: "“축구하는 문어를 그려줘.”",
      details: [["알 수 있는 것", "문어가 축구한다는 사실만 알 수 있어요."], ["AI가 채울 부분", "색, 장소, 표정, 그림의 느낌은 여러 가지로 나올 수 있어요."]],
      summary: "짧게 시작해도 괜찮아요. 결과를 보고 필요한 말을 더할 수 있어요."
    },
    "detailed-prompt": {
      title: "두 번째 프롬프트",
      lead: "보라색 문어가 초등학교 운동장에서 축구하는 장면",
      details: [["추가한 내용", "보라색, 초등학교 운동장, 골을 넣는 행동, 팔을 흔드는 모습, 밝은 만화 느낌을 알려 줬어요."], ["비교할 점", "이 말을 더한 뒤 AI가 만든 그림에서 어떤 부분이 달라졌는지 찾아봐요."]],
      summary: "장소·행동·느낌을 더하면 원하는 그림에 가까워질 수 있지만, 언제나 똑같이 나오지는 않아요."
    },
    "day-night": {
      title: "‘낮 / 밤’만 바꿔 비교하기",
      lead: "다른 말은 그대로 두고 한 조건만 바꿔요.",
      details: [["A · 낮", "보라색 문어가 낮에 운동장에서 축구하는 모습을 신나는 만화로 그려줘."], ["B · 밤", "보라색 문어가 밤에 운동장에서 축구하는 모습을 신나는 만화로 그려줘."], ["비교하기", "빛과 색, 문어, 축구공, 예상 밖 변화를 찾아봐요."]],
      summary: "필요하면 A와 B를 각각 생성해 비교할 수 있어요. 지금 만든 그림에서는 낮을 밤으로 고친 결과를 먼저 살펴봐요."
    },
    "change-time": {
      title: "낮 → 밤",
      lead: "시간을 바꾸면 무엇이 달라질까요?",
      details: [["바꾸는 말", "운동장 배경을 낮에서 밤으로 바꿔줘."], ["확인할 점", "하늘의 빛과 색이 달라졌나요? 문어와 공은 그대로인가요?"]],
      summary: "바꾼 말과 달라진 그림을 함께 살펴보세요."
    },
    "change-place": {
      title: "학교 → 우주",
      lead: "장소만 바꾸면 어떤 장면이 될까요?",
      details: [["바꾸는 말", "학교 운동장을 우주로 바꿔줘."], ["확인할 점", "주인공의 행동은 남고, 배경만 달라졌나요?"]],
      summary: "다른 부분도 함께 달라질 수 있으니 결과를 직접 확인해요."
    },
    "change-style": {
      title: "만화 → 종이공예",
      lead: "같은 장면을 다른 느낌으로 표현해요.",
      details: [["바꾸는 말", "밝은 만화 대신 종이공예처럼 보이게 그려줘."], ["확인할 점", "색, 질감, 모양이 어떻게 달라졌나요?"]],
      summary: "그림의 표현 방식도 프롬프트로 바꿀 수 있어요."
    },
    "astronaut-who": {
      title: "누가?",
      lead: "그림의 주인공은 누구인가요?",
      details: [["예시 답", "우주비행사가"], ["문장에 넣기", "‘우주비행사가’로 시작해 볼 수 있어요."]],
      summary: "짝과 먼저 답한 뒤 예시와 비교해 봐요."
    },
    "astronaut-where": {
      title: "어디서?",
      lead: "우주비행사는 어디에 있나요?",
      details: [["예시 답", "달에서"], ["문장에 넣기", "‘우주비행사가 달에서’라고 이어 볼 수 있어요."]],
      summary: "배경을 보고 장소를 설명해요."
    },
    "astronaut-what": {
      title: "무엇을?",
      lead: "우주비행사는 무엇을 하나요?",
      details: [["예시 답", "피자를 먹어요"], ["문장에 넣기", "‘우주비행사가 달에서 피자를 먹어요’라고 이어 볼 수 있어요."]],
      summary: "그림에서 보이는 행동을 말해요."
    },
    "astronaut-look": {
      title: "어떤 모습?",
      lead: "주인공의 표정이나 자세는 어떤가요?",
      details: [["예시 답", "웃고 있어요"], ["문장에 넣기", "‘웃고 있는 우주비행사’처럼 말해 볼 수 있어요."]],
      summary: "모습을 더하면 장면이 자세해져요."
    },
    "astronaut-feel": {
      title: "어떤 느낌?",
      lead: "그림이 주는 느낌을 말해 볼까요?",
      details: [["예시 답", "즐거운 그림"], ["한 문장", "달에서 피자를 먹으며 웃고 있는 우주비행사를 즐거운 그림으로 그려줘."]],
      summary: "다섯 조각을 이어 자신만의 한 문장으로 만들어 봐요."
    },
    "revision-add": {
      title: "더하기",
      lead: "그림에 새로운 것을 넣고 싶을 때",
      details: [["말하는 방법", "“여기에 ________을 추가해줘.”"], ["예시", "“안경 쓴 모습을 추가해 줘.”"]],
      summary: "추가한 것이 그림에 들어갔는지 확인해요."
    },
    "revision-remove": {
      title: "빼기",
      lead: "그림에서 필요 없는 것을 없애고 싶을 때",
      details: [["말하는 방법", "없애고 싶은 대상을 콕 집어 말해요."], ["예시", "“배경의 나무는 빼 줘.”"]],
      summary: "없애 달라고 한 것 외에 다른 부분도 달라졌는지 살펴봐요."
    },
    "revision-change": {
      title: "한 부분만 바꾸기",
      lead: "남길 것과 바꿀 것을 함께 알려 줘요.",
      details: [["말하는 방법", "“________은 그대로 두고, ________을 바꿔줘.”"], ["예시", "“문어는 그대로 두고 낮을 밤으로 바꿔 줘.”"]],
      summary: "처음 그림과 수정한 그림을 나란히 비교해요."
    },
    "discovery-tell": {
      title: "말이나 글로 알려주기",
      lead: "AI는 내 머릿속을 볼 수 없어요.",
      details: [["오늘 해 본 일", "생각한 장면을 말로 설명해 그림을 부탁했어요."], ["기억할 점", "AI는 말하지 않은 내 생각까지 알 수 없어요."]],
      summary: "상상하고 → 말하기"
    },
    "discovery-change": {
      title: "설명에 따라 달라지는 결과",
      lead: "짧은 말에 조건을 더해 보았어요.",
      details: [["오늘 해 본 일", "색, 장소, 행동, 느낌을 더한 뒤 두 그림을 비교했어요."], ["기억할 점", "설명을 바꾸면 결과도 달라질 수 있어요."]],
      summary: "말하고 → 만들기"
    },
    "discovery-surprise": {
      title: "예상하지 못한 모습",
      lead: "말하지 않은 것도 그림에 생길 수 있어요.",
      details: [["오늘 해 본 일", "문어의 색, 장소, 표정, 축구공을 보며 예상과 다른 점을 찾았어요."], ["기억할 점", "AI가 만든 내용을 언제나 내 생각과 같다고 여기지 않아요."]],
      summary: "결과를 직접 살펴보기"
    },
    "discovery-retry": {
      title: "다시 요청하기",
      lead: "첫 그림이 끝은 아니에요.",
      details: [["오늘 해 본 일", "남길 것과 바꿀 것을 말해 그림을 고쳤어요."], ["기억할 점", "마음에 들지 않으면 한 가지씩 다시 요청할 수 있어요."]],
      summary: "만들고 → 고치기"
    },
    "discovery-judge": {
      title: "내가 보고 판단하기",
      lead: "결과를 확인하고 안전도 점검해요.",
      details: [["그림 확인", "원한 부분이 들어갔는지, 예상 밖의 모습은 없는지 봐요."], ["안전 확인", "내 정보나 다른 사람을 해치는 내용은 넣지 않아요."]],
      summary: "AI가 만든 그림은 내가 직접 살피고 결정해요."
    }
  };
  const requestedSlide = Number(new URLSearchParams(location.hash.slice(1)).get("slide")) || 1;
  const initial = oldSlideLinks[requestedSlide] || requestedSlide;
  let index = Math.min(Math.max(initial - 1, 0), slides.length - 1);
  let touchStartX = 0;

  function showSlide(nextIndex, updateHash = true) {
    if (dailyDialog.open) dailyDialog.close();
    index = Math.min(Math.max(nextIndex, 0), slides.length - 1);
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    currentSlide.textContent = String(index + 1);
    totalSlides.textContent = String(slides.length);
    progressBar.style.width = `${((index + 1) / slides.length) * 100}%`;
    previousButton.disabled = index === 0;
    nextButton.disabled = index === slides.length - 1;
    document.title = `${index + 1}/${slides.length} · Gemini 생성형 AI 놀이터 1주차`;
    if (updateHash) history.replaceState(null, "", `#slide=${index + 1}`);
  }

  function advance() {
    if (dailyDialog.open) return;
    const nextStep = slides[index].querySelector(".reveal-step:not(.is-revealed)");
    if (nextStep) {
      nextStep.classList.add("is-revealed");
      return;
    }
    showSlide(index + 1);
  }

  previousButton.addEventListener("click", () => showSlide(index - 1));
  nextButton.addEventListener("click", advance);
  document.querySelectorAll("[data-daily-topic]").forEach((button) => {
    button.addEventListener("click", () => {
      const topic = dailyTopics.find((item) => item.dataset.topic === button.dataset.dailyTopic);
      const detail = extraDetails[button.dataset.dailyTopic];
      if (!topic && !detail) return;
      dailyTopics.forEach((item) => { item.hidden = item !== topic; });
      extraTopic.hidden = !detail;
      if (detail) {
        document.getElementById("extraTopicTitle").textContent = detail.title;
        document.getElementById("extraTopicLead").textContent = detail.lead;
        extraTopicDetails.replaceChildren(...detail.details.map(([label, value]) => {
          const row = document.createElement("div");
          const term = document.createElement("dt");
          const description = document.createElement("dd");
          term.textContent = label;
          description.textContent = value;
          row.append(term, description);
          return row;
        }));
        document.getElementById("extraTopicSummary").textContent = detail.summary;
      }
      dailyDialogTitle.textContent = topic ? topic.querySelector("h2").textContent : detail.title;
      dailyDialog.querySelector(".daily-dialog-body").scrollTop = 0;
      dailyDialog.showModal();
    });
  });
  document.getElementById("dailyDialogClose").addEventListener("click", () => dailyDialog.close());
  fullscreenButton.addEventListener("click", async () => {
    if (document.fullscreenElement) await document.exitFullscreen();
    else await document.documentElement.requestFullscreen?.();
  });
  document.addEventListener("fullscreenchange", () => {
    fullscreenButton.textContent = document.fullscreenElement ? "전체화면 종료" : "전체화면";
  });
  document.addEventListener("keydown", (event) => {
    if (dailyDialog.open) return;
    if (event.key === " " && event.target instanceof Element && event.target.closest("button")) return;
    if (["ArrowRight", "PageDown", " "].includes(event.key)) {
      event.preventDefault();
      advance();
    } else if (["ArrowLeft", "PageUp", "Backspace"].includes(event.key)) {
      event.preventDefault();
      showSlide(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      showSlide(0);
    } else if (event.key === "End") {
      event.preventDefault();
      showSlide(slides.length - 1);
    }
  });
  document.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive:true });
  document.addEventListener("touchend", (event) => {
    if (dailyDialog.open) return;
    const distance = event.changedTouches[0].screenX - touchStartX;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) advance();
    else showSlide(index - 1);
  }, { passive:true });
  window.addEventListener("hashchange", () => {
    const value = Number(new URLSearchParams(location.hash.slice(1)).get("slide"));
    if (value) showSlide((oldSlideLinks[value] || value) - 1, false);
  });
  showSlide(index);
})();

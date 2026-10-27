const pdfSlides = [
  {page:3, part:'ROADMAP', title:'90분 특강 로드맵 및 핵심 목표', blocks:[
    'Part 1\nAI 개념 & 거버넌스\n보안, 비식별화, 환각검증',
    'Part 2\n프롬프트 기초\n페르소나, 4대 구조화',
    'Part 3\n상담 & 첨삭 실무\n자소서, 면접질문, 윤리지도',
    'Part 4\n공고분석 & 매칭\nJD 추출, 미스매칭 진단',
    'Part 5\n반복행정 자동화\n상담일지, 데이터 정제'
  ]},
  {page:4, part:'PART 1. AI OVERVIEW', title:'생성형 AI(ChatGPT, Gemini 등)의 개념과 메커니즘', blocks:[
    'LLM(대형 언어 모델) 작동 원리\n방대한 텍스트 데이터를 학습하여 확률적으로 가장 적절한 다음 단어를 예측하여 문장을 생성하는 인공지능 기술',
    '핵심 특징\n단순 검색엔진이 아닌 ‘문맥 이해 및 생성기’로 활용하여 요약, 작성, 번역, 분석을 즉시 수행'
  ]},
  {page:5, part:'PART 1. TRENDS', title:'공공부문 및 취업지원 영역에서의 AI 도입 트렌드', blocks:[
    '공공 행정 혁신\n반복성 문서 작업 단축 및 서비스 응답 속도 비약적 향상',
    '맞춤형 구직 상담\n개인별 역량 데이터 기반 지능형 일자리 추천 및 정밀 첨삭',
    '업무 효율 극대화\n상담사 본연의 ‘라포 형성’과 ‘우수 케어’에 집중할 수 있는 환경 제공'
  ]},
  {page:6, part:'PART 1. GOVERNANCE', title:'공공기관 생성형 AI 활용 가이드라인 (행안부/국정원)', blocks:[
    '행정안전부 기준\n공공데이터 활용 시 비식별화 필수, AI 생성물의 정확성 검증 의무 명시',
    '국가정보원 보안 기준\n비공개 업무 자료 입력 금지, 민간 생성형 AI 서비스 활용 시 학습 활용 거부(Opt-out) 설정 필수'
  ]},
  {page:7, part:'PART 1. SECURITY', title:'정보 보안과 데이터 반출 금지 원칙 (내부 망분리)', blocks:[
    '절대 입력 금지 데이터\n주민등록번호, 전화번호, 이름, 내부 비공개 공문, 미발표 정책 자료 등',
    '망분리 환경 대응 수칙\n내부망 자료 활용 시 개인 식별 정보 및 기밀 요소를 ‘가상 가명’으로 100% 치환 후 질문'
  ]},
  {page:8, part:'PART 1. PRIVACY', title:'구직자 개인정보 비식별화 조치법 (사례 비교)', blocks:[
    '잘못된 입력 (위험)\n“홍길동(950101-1******, 010-1234-5678, 대전 서구 거주) 지원자의 전자공학 전공 자소서를 검토해줘.”',
    '비식별화 올바른 입력\n“[구직자 A / 20대 후반 / 지방 4년제 전자공학과] 지원자의 자소서 내 주요 경험을 교정해줘.”'
  ]},
  {page:9, part:'PART 1. LIMITATIONS', title:'AI의 한계점 ①: 할루시네이션(Hallucination, 환각 현상)', blocks:[
    '환각 현상의 정의\nAI가 존재하지 않는 법령, 제도, 기업 채용 조건, 통계 숫자를 매우 그럴듯하게 거짓으로 만들어내는 현상',
    '취업 지원 시 위험 요소\n존재하지 않는 공공 지원금 정책이나 잘못된 자격 요건을 구직자에게 안내할 경우 행정 신뢰도 치명상'
  ]},
  {page:10, part:'PART 1. LIMITATIONS', title:'AI의 한계점 ②: 편향성과 최신 데이터 누락 문제', blocks:[
    '데이터 편향성\n기존 데이터 내 성별, 연령, 학력 편향이 평가 모델에 반영될 가능성 상존',
    '최신 정책 업데이트 시차\n당해 연도 변경된 고용노동부 지침이나 최신 채용공고를 모를 수 있음'
  ]},
  {page:11, part:'PART 1. HUMAN-IN-THE-LOOP', title:'교차 검증 프로세스: Human-in-the-loop', blocks:[
    '1. AI 초안 생성\n프롬프트 기반 빠른 도출',
    '2. 상담원 교차 검증 (HITL)\n수치·법령·팩트 체크',
    '3. 최종 제공 & 행정 적용\n신뢰 가능한 공공 서비스'
  ]},
  {page:12, part:'PART 1. CHECKLIST', title:'AI 사용 전 필수 체크리스트', blocks:[
    '개인식별정보(성명, 연락처, 주민번호)가 모두 제거되었는가?',
    '비공개 내부 공문 및 기밀 정보가 포함되지 않았는가?',
    'AI 답변 중 사업명, 지원금 액수, 법령 조항을 원문과 비교 검증했는가?',
    'AI 옵션에서 데이터 학습 활용 거부(Opt-out)가 설정되어 있는가?'
  ]},
  {page:13, part:'PART 2', title:'행정 업무용 프롬프트 엔지니어링 기초', blocks:['AI의 답변 퀄리티를 바꾸는 질문 기술'], divider:true},
  {page:14, part:'PART 2. PROMPT BASIS', title:'프롬프트 엔지니어링(Prompt Engineering)의 정의', blocks:[
    '개념 정의\nAI 모델로부터 최상의 정확도와 유용한 답변을 이끌어내기 위해 질문을 명확하게 구조화하고 설계하는 기술',
    '핵심 명제\n“모호하게 질문하면 모호하게 답하고, 구체적으로 질문하면 전문가처럼 답한다.”'
  ]},
  {page:15, part:'PART 2. PERSONA', title:'페르소나(Persona) 설정 기법', blocks:[
    'AI에게 명확한 역할과 관점을 부여하여 답변의 전문성과 톤앤매너를 제어합니다.',
    '“너는 10년 차 공공기관 취업지원 전문가이자 베테랑 직업상담원이야. 친절하면서도 객관적인 시각으로 구직자의 이력서를 분석하고 격려하는 어조로 답변해줘.”'
  ]},
  {page:16, part:'PART 2. 4 ELEMENTS', title:'프롬프트 구조화의 4대 핵심 요소', blocks:[
    '1. 역할 (Role)\n“취업전문가로서”',
    '2. 맥락 (Context)\n“20대 청년 구직자의 자소서 작성 상황”',
    '3. 임무 (Task)\n“STAR 기법 기반 성과 교정”',
    '4. 출력 형식 (Format)\n“표 양식 및 3가지 개선안”'
  ]},
  {page:17, part:'PART 2. HWP FORMATTING', title:'공공 행정문서(HWP) 맞춤형 출력 프롬프트 팁', blocks:[
    '개조식 문서 유도 지정어\n• “개조식 문장(-함, -임)으로 작성해줘.”\n• “상위 항목은 ‘○’, 하위 항목은 ‘□’, ‘-’ 기호를 사용해줘.”',
    '표(Table) 형식 유도\n• “결과는 마크다운 표(Table) 양식으로 제시해줘.”\n• 한글(HWP)에 복사-붙여넣기 시 바로 표로 전환 가능'
  ]},
  {page:18, part:'PART 2. BEFORE & AFTER', title:'프롬프트 비교 분석: Bad vs Good', blocks:[
    'Bad Prompt\n“이 구직자 자기소개서 좀 수정해줘.”\n→ 모호한 명령으로 인해 일반적이고 정형화된 평범한 답변 출력',
    'Good Prompt\n“취업상담원 관점에서 다음 자소서의 지원동기를 STAR 기법으로 재구성하고, 개조식 표 양식으로 ‘수정 전 vs 수정 후’를 비교해줘.”'
  ]},
  {page:19, part:'PART 2. ADVANCED TECH', title:'고급 프롬프트 기법: CoT & Few-shot', blocks:[
    'CoT (Chain of Thought)\n“단계별로 생각해서 답해줘”라는 문구를 추가하여 판단 오류와 할루시네이션을 최소화하는 기법',
    '지시: 아래 [본문]을 읽고 핵심 내용을 개조식 형태로 요약해 줘. 반드시 아래의 [예시]들과 동일한 기호 체계(❑, •, -)와 끝맺음(~함) 형식을 지켜야 해.\n\n[예시 1]\n- 입력: 오늘 회의에서는 내년도 예산을 올해보다 10% 증액하기로 합의했습니다. 마케팅 비용이 부족하다는 의견이 많았기 때문입니다.\n- 출력: ❑ 내년도 예산 편성 안 • 주요 내용: 전년 대비 예산 10% 증액 결정\n  - 사유: 마케팅 부문 예산 부족 의견 반영\n\n[본문]\n이번 보안 점검 결과, 많은 직원들이 공공데이터를 민간 AI에 입력할 때 개인정보를 지우지 않는 것으로 나타났습니다. 앞으로는 반드시 비식별화 처리를 한 뒤에 입력해야 보안 사고를 막을 수 있습니다.\n[출력] -> 여기에 AI가 예시와 똑같은 형식으로 정답을 채워 넣게 됩니다.'
  ]},
  {page:20, part:'PART 2. READY', title:'실습 준비: AI 툴 및 보안 세팅 확인', blocks:[
    '1. AI 로그인\nChatGPT / Gemini 접속',
    '2. 개인정보 필터링\n가명화 텍스트 준비',
    '3. 데이터 학습 Off\n개인정보 보호 옵션 확인\n설정 → 기록 및 데이터 → 모두를 위한 모델 개선(끄기)'
  ]},
  {page:21, part:'PART 3', title:'구직상담 및 서류 첨삭 실무', blocks:['구직상담, 이력서, 자기소개서 첨삭 AI 실무'], divider:true},
  {page:22, part:'PART 3. MAPPING', title:'직업상담 업무 단계별 AI 매핑 가이드라인', blocks:[
    '초기 상담\n질문지 생성 & 라포 형성 아이스브레이킹',
    '서류 분석\n이력서/자소서 구조화 및 키워드 도출',
    '서류 첨삭\n맞춤법, STAR 기법 성과 구체화',
    '면접 대비\n맞춤형 면접 질문 & 피드백 가이드'
  ]},
  {page:23, part:'PART 3. INTAKE CONSULTING', title:'초기 상담 질문 리스트 및 아이스브레이킹 프롬프트', blocks:[
    '“너는 공공 취업지원상담원이야. [20대 후반 / 대학 졸업 후 1년 이상 구직 준비 중인 구직자]와 첫 상담을 진행해. 구직자의 긴장을 풀어줄 아이스브레이킹 질문 2개와 구직 장애요인을 파악할 수 있는 심층 질문 3개를 작성해줘.”'
  ]},
  {page:24, part:'PART 3. PROFILE ANALYSIS', title:'구직자 프로필(전공, 경력) 분석 프롬프트', blocks:[
    '“다음 구직자 프로필을 바탕으로 강점 3가지, 약점 2가지, 추천 가능한 직무군 2개를 도출해줘. - 전공: 경영학 / 경력: 인턴 6개월(마케팅) / 자격증: 컴활 1급, 토익 850”'
  ]},
  {page:25, part:'PART 3. RESUME DIAGNOSIS', title:'이력서 구조화 및 누락된 핵심 역량 도출', blocks:[
    '이력서 진단 핵심\n구직자가 제출한 단순 이력사항에서 직무 관련 정량적 성과가 누락되었는지 AI로 10초 만에 스캐닝',
    '진단 프롬프트 포인트\n“목표 직무[행정사무] 대비 현재 이력서에서 보완해야 할 직무 역량 및 필수 기술을 리스트업해줘.”'
  ]},
  {page:26, part:'PART 3. PROOFREADING', title:'자소서 첨삭 실습 ①: 맞춤법 및 문맥 교정', blocks:[
    '“다음 자기소개서 문장에서 맞춤법, 띄어쓰기, 어색한 문맥을 교정해줘. 교정된 부분은 볼드체(●)로 표시하고, 교정 이유를 간단히 설명해줘.”'
  ]},
  {page:27, part:'PART 3. SUBTITLE & SUMMING', title:'자소서 첨삭 실습 ②: 소제목 추출 및 문장 슬림화', blocks:[
    '임팩트 있는 소제목 도출\n“본문 내용을 한눈에 파악할 수 있는 임팩트 있는 소제목 3개를 추천해줘.”',
    '군더더기 삭제 & 군살 빼기\n“접속사와 미사여구를 제거하고 분량을 20% 줄여 명확한 문장으로 다듬어줘.”'
  ]},
  {page:28, part:'PART 3. STAR METHOD', title:'자소서 첨삭 실습 ③: STAR 기법 기반 성과 구체화', blocks:[
    'Situation (상황)\n“내가 처했던 당시 배경이나 해결해야 했던 진짜 문제점”',
    'Task (과제)\n“그 상황에서 내가 반드시 달성해야 했던 구체적인 목표와 역할”',
    'Action (행동)\n“문제를 해결하기 위해 내가 ‘어떤 방법’으로 ‘어떻게 노력’했는지”',
    'Result (성과/수치)\n“나의 행동 덕분에 얻어낸 구체적인 결과와 정량적인 성공 수치”',
    '“구직자의 모호한 서술을 STAR 구조로 분류하고, Action과 Result (정량지표) 중심으로 재작성하도록 유도”',
    '💡 이해를 돕는 한 줄 예시 (인턴 경험)\n“동아리 회원이 급감하여(S), 한 달간 신입 30명 영입을 목표로 세우고(T), 타겟 분석 후 숏폼 홍보 영상을 직접 제작·배포하여(A), 목표를 초과한 45명을 모집함(R).”'
  ]},
  {page:29, part:'PART 3. STAR PRACTICE', title:'STAR 기법을 반영한 자기소개서 수정 실습', blocks:[
    '아래 제공하는 자기소개서를 STAR 기법(Situation, Task, Action, Result) 구조에 맞춰 매끄러운 서술형 문장으로 수정해 줘.\n\n이번에 글을 고칠 때는 아래 지시사항을 철저히 반영해야 해:\n\n1. STAR 단계별 명확한 단락 분리: 상황(S), 과제(T), 행동(A), 결과(R)가 문맥 속에서 뭉뚱그려지지 않고, 각 단계가 시작되는 지점과 역할이 인사담당자 눈에 명확히 들어오도록 흐름을 정리해 줘.\n2. Result(성과)의 수치화 및 명확화: “전량 소진”, “성공적 마무리” 같은 추상적인 표현에만 그치지 말고, 앞선 행동의 효과를 보여줄 수 있는 정량적 성과 지표(예: 매출 목표 몇 % 달성, 손실률 0% 기록 등)를 문맥에 어울리는 숫자로 명확하게 명시해서 결과 문단을 완성해 줘.\n3. 말투: 불필요한 감정적 수식어는 배제하고, 객관적이고 신뢰감을 주는 비즈니스 말투로 다듬어 줄 것.',
    '[자기소개서 내용]\n저의 강점은 예기치 못한 위기 상황에서도 낙담하지 않고 빠르게 대안을 찾아내는 유연한 대처 능력입니다. 대학 시절 마케팅 학회에서 축제 부스 운영 총괄을 맡았을 때 이 강점을 발휘했습니다.\n당시 저희 팀은 최고의 수익을 목표로 축제를 준비했으나, 행사 당일 아침부터 폭우가 쏟아지며 야외 부스를 찾는 발길이 완전히 끊겼습니다. 열심히 준비한 재료를 모두 버릴 위기였고 팀원들의 사기도 크게 저하되었습니다.\n저는 팀장으로서 상황을 반전시키기 위해 비를 피해 학생들이 모여 있는 실내 강당과 도서관 로비로 부스를 신속히 이동시켰습니다. 또한 날씨에 맞춰 메뉴를 따뜻한 음료 중심으로 변경하고, SNS로 실내 부스 위치를 실시간 홍보했습니다.\n처음 계획과 달랐지만 발 빠르게 대처한 덕분에 오후부터 많은 학생이 방문했고, 준비한 재료를 전량 소진하며 성공적으로 축제를 마칠 수 있었습니다. 이 경험을 통해 어떤 위기든 대안을 찾으면 기회가 될 수 있음을 배웠습니다.',
    '[수정 결과]\nAI가 생성한 STAR 기법 반영 결과를 이곳에 삽입합니다.'
  ]},
  {page:30, part:'PART 3. MOCK INTERVIEW', title:'AI를 활용한 가상 면접 질문(기출 & 압박) 생성', blocks:[
    '“제출된 자기소개서를 바탕으로 면접관 관점에서 1) 직무 진정성을 확인하는 기출 질문 3개, 2) 경험의 진위 여부를 확인하는 압박 질문 2개를 도출해줘.”'
  ]},
  {page:31, part:'PART 3. INTERVIEW FEEDBACK', title:'면접 답변 피드백 및 모범 답안 가이드 도출', blocks:[
    '답변 평가 포인트\n구직자의 면접 답변 초안에서 논리적 비약이나 자신감 부족 표현을 진단',
    '모범 구조 제안\n“두미식 답변으로 고치고, 결론부터 말하는 연습용 스크립트 작성”'
  ]},
  {page:32, part:'PART 3. ETHICS & DETECT', title:'[주의사항] AI 대필 자소서 가려내기 & 윤리 지도', blocks:[
    'AI 대필 자소서 특성\n과도하게 매끄러운 추상적 표현, 고유한 개인 경험(Story) 부재, 천편일률적인 결론',
    '상담원 윤리 지도 지침\n“AI는 <초안 도구 및 교정 보조>로만 활용하고, 본인의 실제 경험을 직접 서술하도록 지도”'
  ]},
  {page:33, part:'PART 3. SUMMARY AUTOMATION', title:'상담 결과 요약서 양식 자동 생성 프롬프트', blocks:[
    '“오늘 구직자와 진행한 30분 상담 내용을 바탕으로 공공 행정용 [구직상담 결과 요약서]를 작성해줘. 포함 항목: 1) 구직자 주요 희망조건, 2) 금일 진단 내용, 3) 차회 상담 전 과제”'
  ]},
  {page:34, part:'PART 3. VOICE TO TEXT', title:'현장 상담 시 유용한 AI 음성 변환(STT) 활용법', blocks:[
    '음성 녹음 및 텍스트 변환\n상담 동의 후 음성 기록을 실시간 텍스트로 전환',
    '현장 상담용 AI STT 솔루션 대표 2종 비교\n상담 현장에서는 한국어 고유명사(자격증, 회사명 등) 인식률, 내담자 정보 보안(개인정보 보호), 그리고 화자 분리 능력이 가장 중요합니다.'
  ]},
  {page:35, part:'PART 3. COUNSELING LOG', title:'상담 일지 자동 생성', blocks:[
    '너는 구직자 직업 상담 및 고용 지원 서비스를 제공하는 전문 상담사야.\n아래 제공하는 [상담 STT 원본 텍스트]를 분석해서, 인사담당자 및 내부 보고용으로 적합한 깔끔한 ‘개조식 상담 일지’로 변환해 줘.\n\n[작성 조건]\n1. 문장은 간결한 개조식 형태로 작성하고, 끝맺음은 명사나 명사형 어미(~함, ~임, ~ 완료)로 통일할 것.\n2. 구직자가 언급한 사적인 이야기나 단순 감정 표현은 정제하고, 오직 ‘취업 역량, 희망 조건, 장애 요인, 약속된 실행 사항’ 중심으로 압축할 것.\n3. 구직자의 개인정보(실명, 주민번호, 상세 주소 등)가 텍스트에 포함되어 있다면 반드시 ‘OOO’ 또는 ‘OO시’ 형태로 비식별화(마스킹) 처리를 할 것.\n\n[출력 포맷]\n■ 종합 요약: (상담의 핵심 주제와 구직자의 현재 상태를 2줄 이내로 요약)\n\n■ SOAP 기반 상세 일지:\n1. Subjective (구직자 주관적 의견)\n- 구직자가 호소하는 어려움, 진로 고민, 현재 느끼는 심리적 상태 등\n2. Objective (객관적 사실 및 정보)\n- 구직자의 전공, 보유 자격증, 경력 세부사항, 희망 직무 및 희망 연봉 등\n3. Assessment (상담사 평가 및 분석)\n- 상담사가 판단한 구직자의 강점 및 보완점, 취업 시장에서의 경쟁력 분석\n4. Plan (향후 실행 계획)\n- 다음 상담 전까지 구직자가 해야 할 과제(이력서 수정, 자격증 접수 등)\n- 차시 상담 일정 및 지원할 프로그램 안내\n\n[상담 STT 원본 텍스트]\n(여기에 클로바노트나 다글로에서 텍스트로 추출된 상담 대화록 내용을 그대로 붙여넣으세요)',
    '[대화록 가상데이터]\n[화자 1 (상담사)]: 아, 예... 들어오세요. 홍길동 님... 맞으시죠? 예, 여기 앉으시면 됩니다. 날이 갑자기 추워졌는데 오시는 길에 헤매진 않으셨어요? 아, 다행이네. 저번 주에 전화로 가볍게 통화하긴 했는데... 오늘이 이제 정식 첫 상담이니까, 뭐 너무 부담 갖지 마시고 요즘 구직 활동 하시면서 좀 답답하셨던 부분이나 고민 같은 거 편하게 다 털어놓고 가시면 돼요. 아, 맞다. 그리고 요거 대화 내용은 아까 동의서 사인해 주신 것처럼 일지 작성용으로만 자동 녹음되는 거니까... 막 신경 쓰지 마시고 평소 말투대로 하셔도 됩니다. 예.\n\n[화자 2 (내담자)]: 아... 네, 알겠습니다. 음... 제가 사실은요, 고등학교 졸업하고 나서 군대 다녀와서 바로 취업을 하긴 했었거든요? 그... 동네에 있는 OO유통이라고 좀 자그마한 유통회사인데, 거기서 그냥 경리 업무... 그러니까 영수증 처리하고 장부 입력하고 뭐 그런 회계 보조 업무를 한 3년? 예, 한 3년 정도 조금 넘게 일했어요. 근데 뭐... 아시겠지만 요즘 경기가 워낙 안 좋다 보니까 회사가 사정이 확 나빠져서... 올해 한 4월쯤에 권고사직 비슷하게 퇴사를 하게 됐거든요. 근데 그 뒤로 한 반년 넘게 계속 쉬면서 사람인이나 워크넷 같은 데 맨날 보고 서류를 넣고는 있는데... 그, 연락이 통 안 와서요. 제가 자격증이 그냥 옛날에 고등학교 때 땄던 정보처리기능사? 그거 진짜 쓸모없는 거 그거 하나밖에 없어 가지고... 아무래도 서류에서 계속 광탈하는 거 같아요. 자격증이 없으니까...\n\n[화자 1 (상담사)]: 아... 회계 보조로 3년이나 실무를 하셨으면 그래도 경력이 꽤 탄탄하신 편인데, 자격증 공백 때문에 서류 탈락이 잦다고 느끼셔서 심적으로 많이 지치셨겠어요. 주로 어떤 직무나 조건으로 지원을 채워 넣고 계세요?\n\n[화자 2 (내담자)]: 그냥... 전산회계나 일반 사무직, 아니면 중소기업 총무직 이쪽은 다 닥치는 대로 넣고 있어요. 희망 연봉은... 뭐 요즘 물가가 워낙 비싸니까 그래도 최소한 한 2,800 이상은... 예, 그 정도 선은 받으면 좋겠는데... 경력이 3년이어도 자격증이 없으니까 뽑는 사람 입장에서는 별로 신뢰가 안 가나 봐요. 그리고 혼자 자소서 쓰려니까 첫 문장부터 막막해서 진도가 안 나가더라고요. 아, 그래서 제가 안 되겠다 싶어서 저번 달에 집 앞 전산회계 1급 학원을 등록하긴 했거든요? 근데 이게 일하면서 하던 거랑 그냥 맨땅에 대입해서 이론 공부 하려니까 진도도 밀리고... 당장 일주일 뒤가 시험인데 솔직히 이번엔 공부를 많이 못 해서 100% 떨어질 것 같아요. 마음만 엄청 조급하고... 내가 지금 자소서를 써야 하는지 학원을 가야 하는지 갈피를 못 잡겠어요.\n\n[화자 1 (상담사)]: 시험이 일주일밖에 안 남으셨다니 불안하고 마음이 복잡하신 게 당연합니다, 길동 님. 하지만 너무 낙담하실 필요 없는 게, 자격증만 있는 신입보다 실무를 3년 동안 몸으로 겪으신 길동 님이 이론만 조금만 얹어지면 취업 시장에서 훨씬 유리해요. 자소서는 다음 주에 저랑 같이 첫 문장부터 다 뜯어고칠 거니까 이번 주는 걱정 내려놓으시고요. 우선 남은 일주일 동안은 자소서 생각은 아예 하지 마시고, 학원 수업 들으면서 무조건 전산회계 기출문제 오답 노트 만드는 것에만 올인해 보시는 건 어떨까요? 선택과 집중을 하는 거죠.\n\n[화자 2 (내담자)]: 아... 기출문제요? 저는 맨날 불안하니까 두꺼운 기본서 이론만 계속 붙잡고 회독 돌리고 있었는데... 오히려 지금은 기출문제를 계속 푸는 게 점수 올리는데 나을까요? 음... 듣고 보니 그런 것 같기도 하네요. 네, 그러면 이번 주는 일단 학원 스케줄 따라가면서 기출문제집 최근 5개년 거 사둔 거 있으니까 그것만 달달 외울 정도로 파봐야겠어요. 그러면 다음 주에 상담하러 올 때... 제가 이력서 기존에 쓰다가 말았던 거라도 좀 프린트해서 들고 오면 될까요?\n\n[화자 1 (상담사)]: 네, 아주 좋습니다. 자격증 시험 일단 후회 없이 잘 치르고 오시고요, 다음 주 목요일 오전 10시에 예약 잡아드릴 테니까 그때 기존 이력서랑 자소서 초안 꼭 챙겨오세요. 그걸 토대로 인사담당자 눈에 띄게 스타(STAR) 기법 적용해서 멋지게 포장해 봅시다. 오늘 고생 많으셨어요.\n\n[화자 2 (내담자)]: 아, 네! 감사합니다. 조언해 주신 대로 이번 주는 기출문제만 파볼게요. 다음 주 목요일에 뵙겠습니다. 들어가세요.'
  ]},
  {page:36, part:'PART 4', title:'채용공고 분석 및 맞춤형 일자리 매칭', blocks:['채용공고 분석 및 일자리 탐색 자동화'], divider:true},
  {page:37, part:'PART 4. JD ANALYSIS', title:'채용공고(JD) 원문에서 핵심 역량 10초 만에 추출하기', blocks:[
    '“아래 채용공고 텍스트에서 1) 필수 자격요건, 2) 우대사항, 3) 핵심 수행업무를 각각 3줄 개조식으로 요약 도출해줘.”',
    '[고용24 표준 등록 양식] 일반사무 및 회계행정원 채용 공고\n\n1. 모집 조건 및 자격 요건 (Requirements)\n• 모집 인원: 1명 (신입 및 경력 무관 지원 가능)\n• 학력 조건: 학력 무관 (고등학교 졸업자 및 상경계열 초대졸자 등등 우대)\n• 필수 자격: 컴퓨터활용능력 2급 이상 또는 워드프로세서 소지자 (OA 실무 가능자)\n• 우대 사항: 전산회계 1급 또는 전산세무 2급 자격증 소지자 우대\n- ERP(더존, 세무사랑 등) 프로그램 사용 경험자 우대\n\n2. 근로 조건 및 근무 형태 (Job Conditions)\n• 고용 형태: 기간의 정함이 없는 근로계약 (정규직, 수습기간 3개월 적용)\n• 급여 조건: 연봉 2,800만 원 ~ 3,200만 원 (면접 후 최종 경력별 협의 가능)\n- 상여금 및 퇴직연금 별도 지급 (1년 이상 근무 시 적용)\n• 근무 시간: 주 5일 근무 (월~금, 09:00 ~ 18:00 / 주 40시간 표준 근로 기준)\n• 복리 후생: 4대 보험 가입, 퇴직연금, 중식대 분리 지급, 연차 휴가 보장\n\n3. 직무 수행 내용 (Job Description)\n• 일반 행정 지원: 부서 내 지출 영수증 검토, 법인카드 사용 내역 일일 정산 및 전산 세무 장부 보조 입력\n• 문서 관리 업무: 거래처 매출·매입 원장 대조 및 분기별 부가가치세 대외 신고 자료 사전 취합\n• 고객 마케팅 지원: 워크넷 및 자사 채용 시스템 연동 관리 보조 및 기초 사무 행정 인프라 운영\n\n4. 채용 전형 및 접수 방법 (Application)\n• 접수 마감일: 채용시까지 (적격자 채용 시 조기 마감될 수 있음)\n• 접수 방법: 고용24 홈페이지를 통한 온라인 입사 지원 전용 (우편 및 이메일 접수 불가)\n• 제출 서류: 고용24 표준 이력서 양식, 자기소개서 (경력자의 경우 경력 기술 사항 기술)\n• 선발 절차: 1차 서류 전형 → 2차 실무진 면접 (서류 합격자에 한해 개별 통보)'
  ]},
  {page:38, part:'PART 4. MATCHING RATE', title:'구직자 역량 vs 채용공고 직무 적합도 분석', blocks:[
    '85%\n직무 적합도 스코어',
    '적합도 분석 프롬프트\n“구직자 이력서와 채용공고를 비교하여 매칭 비율(%)을 산출하고, 일치하는 역량과 부족한 역량을 평가해줘.”'
  ]},
  {page:39, part:'PART 4. MISMATCH DIAGNOSIS', title:'미스매칭 원인 진단 및 구직자 보완 역량 도출', blocks:[
    '원인 진단\n희망 연봉/근무지 격차, 필수 자격증 미비, 직무 경험 부족 등 원인 분석',
    '단기 보완 로드맵\n취업지원 프로그램 연계, 국비지원 교육 추천 스크립트 도출'
  ]},
  {page:40, part:'PART 4. WORKNET RECOMMEND', title:'워크넷 등 공공 데이터 기반 맞춤형 추천 스크립트', blocks:[
    '“구직자 A의 희망 조건(지역: 대전 / 직무: 사회복지 / 근무형태: 정규직)에 맞는 워크넷 공공 일자리 데이터 기반 맞춤 추천 설명 멘트를 작성해줘.”'
  ]},
  {page:41, part:'PART 4. POLICY MATCHING', title:'계층별(청년, 신중년, 경단녀) 맞춤형 취업정책 매칭', blocks:[
    '청년 구직자\n국민취업지원제도, 청년일자리도약장려금',
    '신중년 재취업\n신중년 적합직무 장려금, 전직지원 서비스',
    '경력단절여성\n새일여성인턴, 유연근무 지원제도'
  ]},
  {page:42, part:'PART 4. MESSAGE GENERATION', title:'구직자 발송용 안내 메일 & 알림톡 문구 자동 생성', blocks:[
    '“맞춤 일자리 공고를 추천하는 카카오톡 알림톡 문구를 200자 이내로 작성해줘. 친절하고 명확한 톤, 신청 링크 클릭을 유도하는 문구 포함.”'
  ]},
  {page:43, part:'PART 4. TREND STRATEGY', title:'최신 채용 트렌드(AI 면접, 역량검사) 대응 전략', blocks:[
    'AI 역량검사 지도\n게임형 응시 팁, 시선 처리 및 음성 톤 가이드 제공',
    '정시·경력 채용 확대\n상시 일자리 알림 세팅 및 직무 맞춤 포트폴리오 준비 지도'
  ]},
  {page:44, part:'PART 4. PRACTICE', title:'실습: 일자리 매칭 결과 도출 및 공유', blocks:[
    '[실습 과제]\n제공된 구직자 프로필 샘플과 채용공고를 AI에 입력하고, 최종 매칭 추천서 1페이지를 도출해 보세요.'
  ]},
  {page:45, part:'PART 5', title:'반복 행정 업무 효율화 및 데이터 분석', blocks:['상담 기록 관리 및 노코드 행정 데이터 분석'], divider:true},
  {page:46, part:'PART 5. DATA STRUCTURING', title:'비정형 상담 일지를 정형 데이터(표)로 자동 변환', blocks:[
    '“다음 줄글 형태의 상담 메모를 엑셀에 바로 붙여넣을 수 있는 표(Table)로 변환해줘. 컬럼명: [상담일자, 구직자코드, 상담유형, 주요요청사항, 조치결과]”'
  ]},
  {page:47, part:'PART 5. DATA CLEANING', title:'AI를 활용한 구인·구직 통계 데이터 정제 및 요약', blocks:[
    '텍스트 데이터 정제\n중복 항목 제거, 무효 데이터 필터링, 띄어쓰기 통일',
    '통계 요약 리포팅\n월별 가장 많은 구직 신청 직무 Top 5 자동 추출'
  ]},
  {page:48, part:'PART 5. NO-CODE ANALYSIS', title:'상담 만족도 설문조사 결과 노코드 데이터 분석', blocks:[
    '“100명의 상담 만족도 주관식 응답 텍스트를 분석하여 긍정 키워드 3개, 부정이유 2개를 도출하고, 향후 개선방안을 제시해줘.”',
    '실습 프롬프트 입력 후 엑셀 데이터를 AI에 첨부하라는 메시지를 삽입하세요. 단 개인정보는 가림처리를 꼭 해야 합니다'
  ]},
  {page:49, part:'AI × 취업지원 데이터 분석', title:'엑셀 데이터 분석으로 완성하는 취업지원 업무 효율화', blocks:[
    '90분 실습형 교육 · ChatGPT 프로젝트 활용',
    '엑셀 업로드 → 데이터 진단 → 실적 분석 → 그래프 → 보고서',
    '오늘의 결과물\n취업지원 분석 프로젝트 1개 · 그래프 2개 · 보고서 초안 1부'
  ]},
  {page:50, part:'AI × 취업지원 데이터 분석', title:'ChatGPT 프로젝트로 반복 업무 표준화', blocks:[
    '프로젝트 = 업무 지침 + 참고 파일 + 관련 대화',
    '① 지침 설정\n지표·보고서 형식 고정',
    '② 파일 분석\n새로운 월간 엑셀 첨부',
    '③ 결과 검증\n담당자가 원본과 대조',
    '※ 프로젝트는 정기 무인 실행 기능이 아니라 반복 분석을 돕는 작업 공간입니다.'
  ]},
  {page:51, part:'AI × 취업지원 데이터 분석', title:'실습 ① 프로젝트 지침 등록', blocks:[
    '프로젝트 지침 — 가운데 문구를 복사하세요\n\n당신은 취업지원기관의 데이터 분석 전문가입니다.\n가상 엑셀 파일의 오류를 점검하고 상담 건수, 고유 구직자 수, 취업 인원과 취업률을 분석하세요.\n집계 기준을 밝히고, 근거 없는 숫자는 만들지 마세요.\n결과는 분석표 → 그래프 → 보고서 초안 순서로 제시하세요.\n\n실습: 복사 → ChatGPT 프로젝트 대화에 붙여넣기 → 결과 검증'
  ]},
  {page:52, part:'AI × 취업지원 데이터 분석', title:'실습 ② 엑셀 파일 오류 진단', blocks:[
    '데이터 진단 프롬프트\n\n당신은 취업지원 엑셀 데이터 품질관리 담당자입니다.\n첨부한 가상 엑셀 파일의 열 이름과 행 수를 확인하세요.\n결측치, 중복 ID, 취업 여부와 취업일자 불일치를 찾아 표로 작성하세요.\n오류가 의심되는 행을 표시하고 원본은 임의로 수정하지 마세요.\n\n실습: 복사 → ChatGPT 프로젝트 대화에 붙여넣기 → 결과 검증'
  ]},
  {page:53, part:'AI × 취업지원 데이터 분석', title:'실습 ③ 취업지원 핵심 지표 분석', blocks:[
    '실적 분석 프롬프트\n\n당신은 취업지원 실적분석 전문가입니다.\n상담 건수와 중복 제거한 구직자 수를 구분하세요.\n취업 인원과 교육용 취업률을 계산하고, 연령대·희망직종별 현황을 표로 정리하세요.\n취업률 = 취업한 고유 구직자 수 ÷ 대상 고유 구직자 수 × 100.\n계산 근거와 확인할 사항을 함께 표시하세요.\n\n실습: 복사 → ChatGPT 프로젝트 대화에 붙여넣기 → 결과 검증'
  ]},
  {page:54, part:'AI × 취업지원 데이터 분석', title:'실습 ④ 데이터 시각화', blocks:[
    '그래프 생성 프롬프트\n\n당신은 공공기관 데이터 시각화 전문가입니다.\n첨부한 취업지원 데이터를 기준으로\n① 희망직종별 취업 인원 막대그래프\n② 월별 취업 인원 추세그래프를 만드세요.\n제목·축·단위를 표시하고 집계표와 수치를 대조하세요.\n월별 데이터가 없다면 임의로 생성하지 마세요.\n\n실습: 복사 → ChatGPT 프로젝트 대화에 붙여넣기 → 결과 검증'
  ]},
  {page:55, part:'AI × 취업지원 데이터 분석', title:'실습 ⑤ 실적보고서 초안 자동 작성', blocks:[
    '기관 보고서 작성 프롬프트\n\n당신은 취업지원기관의 실적보고서 작성 전문가입니다.\n앞서 검증한 분석 결과로 보고서 초안을 작성하세요.\n구성: ① 분석 개요 ② 집계 기준 ③ 핵심 실적\n④ 연령대·직종별 현황 ⑤ 주요 특징 3가지\n⑥ 개선과제 3가지 ⑦ 추가 확인사항.\n공공기관 문체로 작성하고 사실과 제안을 구분하세요.\n\n실습: 복사 → ChatGPT 프로젝트 대화에 붙여넣기 → 결과 검증'
  ]},
  {page:56, part:'AI × 취업지원 데이터 분석', title:'다음 달에도 사용하는 반복 분석 프롬프트', blocks:[
    '재사용 프롬프트\n\n당신은 취업지원 월간 실적분석 담당자입니다.\n이번에 새로 첨부한 가상 엑셀 파일만 분석 대상으로 사용하세요.\n프로젝트의 고정 지침에 따라 오류 진단 → 실적 집계 → 그래프 → 보고서 초안을 진행하세요.\n이전 달 자료가 확인되면 비교하고, 없으면 생략하세요.\n최종 검증 체크리스트를 작성하세요.\n\n실습: 복사 → ChatGPT 프로젝트 대화에 붙여넣기 → 결과 검증'
  ]},
  {page:57, part:'AI × 취업지원 데이터 분석', title:'최종 점검과 현장 적용', blocks:[
    '01\n개인정보 없는 자료인가?',
    '02\n중복과 결측치를 확인했는가?',
    '03\n취업률 분모가 명확한가?',
    '04\n그래프와 보고서 수치가 일치하는가?',
    '오늘의 완성: 취업지원 분석 프로젝트 1개 + 데이터 분석 결과 + 보고서 초안'
  ]},
  {page:58, part:'PART 5. REPORT GENERATION', title:'부서 보고용 취업지원 실적 보고서 초안 생성', blocks:[
    '보고서 목차 자동화\nI. 추진 배경 → II. 주요 성과 → III. 문제점 및 개선방안',
    '행정 어조 변환\n일반 문장을 공공기관 공식 보고서체(-를 추진함, -를 달성함)로 변환',
    '너는 공공기관의 취업지원 부서에서 근무하는 베테랑 행정관이야.\n아래 제공하는 [업무 기초 자료]를 바탕으로, 부서 보고용 ‘취업지원 실적 보고서’를 작성해 줘.\n\n[작성 조건 - 이미지 지침 반영]\n1. 보고서 목차 자동화: 반드시 아래 제시된 3단계 목차 구조(Ⅰ ➔ Ⅱ ➔ Ⅲ)에 맞춰 내용을 구성할 것.\n2. 행정 어조 변환: 일반 서술형 문장(~했습니다, ~입니다)을 절대 사용하지 말고, 공공기관 공식 보고서체인 명사형 종결어미(‘~를 추진함’, ‘~를 달성함’, ‘~임’, ‘~함’)로만 문장을 끝맺을 것.\n3. 가독성 확보: 개조식 작성을 위해 항목별 위계 기호(Ⅰ, 1, ❑, o, -)를 바르게 적용할 것.\n\n[보고서 목차 구조]\nⅠ. 추진 배경\n(해당 취업지원 사업이나 보안 교육을 추진하게 된 이유와 필요성을 개조식으로 작성)\nⅡ. 주요 성과\n(기초 자료의 실적, 만족도 점수, 인원 등을 정량적 수치 중심으로 명사형 어미로 작성)\nⅢ. 문제점 및 개선방안\n(업무 과정에서 나타난 한계점과 이를 해결하기 위한 향후 구체적 대책 제시)\n\n[업무 기초 자료]\n(여기에 오늘 진행한 교육 실적, 설문조사 결과, 또는 작성하고자 하는 사업 내용 메모를 자유롭게 붙여넣으세요)'
  ]},
  {page:59, part:'PART 5. PROMPT MANUAL', title:'나만의 취업지원 프롬프트 매뉴얼 구축하기', blocks:[
    '자주 쓰는 프롬프트 보관함(메모장/노션) 작성',
    '상담 유형별(청년/신중년/경단녀) 맞춤 프롬프트 모듈화',
    '부서 내 프롬프트 공유 및 동료 간 피드백 축적'
  ]},
  {page:60, part:'IMAGE PROFILE PRACTICE', title:'생성형 AI 기반 이력서용 증명사진 생성', blocks:[
    '생성형 이미지 AI를 활용하여 구직자의 자연스러운 얼굴 특징과 연령대를 유지하면서, 이력서 제출에 최적화된 단정한 비즈니스 프로필 사진으로 변환하는 프롬프트 실습입니다.'
  ]},
  {page:61, part:'Q&A', title:'질의응답 (Q&A) & 만족도 설문', blocks:[
    '오늘 강의 내용에 대해 궁금한 점을 자유롭게 질문해 주세요.',
    '교육 만족도 설문 조사 작성 안내 (QR코드/링크)'
  ]},
  {page:62, part:'CLOSING', title:'공공 서비스의 질을 높이는 AI 협업 파트너십', blocks:[
    'AI는 상담원을 대체하는 것이 아니라, 더 따뜻하고 정밀한 상담을 돕는 강력한 도구입니다.',
    '수고하셨습니다. 감사합니다!'
  ], divider:true}
];

const contentRoot = document.querySelector('#pdfCourseContent');

const sttComparison = [
  ['핵심 강점', '**압도적인 한국어 인식률 및 자연스러운 대화 화자 분리**', '**전문 용어 사전 등록 및 높은 편집·확장성**'],
  ['음성 변환(STT)', '**일상적인 대화 뉘앙스, 사투리, 흐려지는 말끝까지 매우 정확하게 텍스트로 복원.**', '**유튜브, 링크 등 연동 지원 및 영어·외국어 혼용 환경에서 우수한 성능.**'],
  ['요약 및 후처리', '**하이퍼클로바X 기반의 문단별 자동 요약 및 주요 키워드 추출.**', '마인드맵 형태의 시각적 요약 및 **상담 일지용 다양한 사전 템플릿 제공.**'],
  ['보안성', '기업 전용 환경 제공 시 대화 데이터의 **외부 유출 및 AI 모델 학습 재활용을 원천 차단.**', '**기업 맞춤형 구축(온프레미스/프라이빗 클라우드)을 지원**하여 내부 보안 규정 준수 용이.'],
  ['추천 환경', '**“구직자와의 1:1 대화가 많고, 자연스러운 대화록 복원이 최우선인 기관”**', '**“상담 중 전문 기술 용어, 특정 자격증명이 자주 등장하여 단어 등록이 필요한 기관”**']
];

function appendBoldSegments(element, value) {
  value.split('**').forEach((segment, index) => {
    const node = index % 2 === 1 ? document.createElement('strong') : document.createTextNode(segment);
    if (index % 2 === 1) node.textContent = segment;
    element.append(node);
  });
}

for (const slide of pdfSlides) {
  const section = document.createElement('section');
  section.className = `course-section${slide.divider ? ' section-divider' : ''}`;
  section.id = `slide-${slide.page}`;
  section.setAttribute('aria-labelledby', `title-${slide.page}`);

  const header = document.createElement('header');
  header.className = 'course-section-header';
  const pageNumber = document.createElement('span');
  pageNumber.className = 'source-page-number';
  pageNumber.textContent = String(slide.page).padStart(2, '0');
  const headingWrap = document.createElement('div');
  const part = document.createElement('p');
  part.className = 'course-part';
  part.textContent = slide.part;
  const title = document.createElement('h2');
  title.id = `title-${slide.page}`;
  title.textContent = slide.title;
  headingWrap.append(part, title);
  header.append(pageNumber, headingWrap);

  const grid = document.createElement('div');
  grid.className = 'source-grid';
  if (slide.page === 3) grid.classList.add('source-grid-roadmap');
  slide.blocks.forEach((text, index) => {
    const block = document.createElement('div');
    block.className = `source-block${index === 0 && !slide.divider ? ' is-prominent' : ''}`;
    if (slide.page === 34) {
      const [cardTitle, ...cardBody] = text.split('\n');
      const strong = document.createElement('strong');
      strong.className = 'source-card-title';
      strong.textContent = cardTitle;
      const body = document.createElement('span');
      body.textContent = cardBody.join('\n');
      block.append(strong, body);
    } else {
      block.textContent = text;
    }
    const promptPages = new Set([23, 24, 26, 27, 30, 33, 37, 40, 42, 46, 51, 52, 53, 54, 55, 56]);
    const hasCopyButton = (slide.page === 19 && index === 1)
      || promptPages.has(slide.page)
      || (slide.page === 29 && index <= 1)
      || (slide.page === 35 && index <= 1)
      || (slide.page === 48 && index === 0)
      || (slide.page === 58 && index === 2)
      || ([25, 31, 38].includes(slide.page) && index === 1);
    if (hasCopyButton) {
      block.classList.add('practice-copy-card');
      const copyButton = document.createElement('button');
      copyButton.className = 'practice-copy-button';
      copyButton.type = 'button';
      const buttonLabel = '실습 프롬프트 복사';
      copyButton.textContent = buttonLabel;
      copyButton.addEventListener('click', async () => {
        await navigator.clipboard.writeText(text);
        copyButton.textContent = '복사 완료';
        setTimeout(() => { copyButton.textContent = buttonLabel; }, 1500);
      });
      block.append(copyButton);
    }
    grid.append(block);
  });
  if (slide.page === 34) {
    const table = document.createElement('table');
    table.className = 'stt-comparison-table';
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    ['비교 항목', '네이버 클로바노트 (기업용/비즈니스)', '다글로 (Daglo)'].forEach((label) => {
      const th = document.createElement('th');
      th.textContent = label;
      headerRow.append(th);
    });
    const tbody = table.createTBody();
    sttComparison.forEach((row) => {
      const tr = tbody.insertRow();
      row.forEach((value, columnIndex) => {
        const cell = columnIndex === 0 ? document.createElement('th') : document.createElement('td');
        appendBoldSegments(cell, value);
        tr.append(cell);
      });
    });
    grid.append(table);
  }
  if (slide.page === 60) {
    const customizer = document.createElement('div');
    customizer.className = 'profile-prompt-customizer';
    customizer.innerHTML = `
      <h3>실시간 옵션 커스터마이저</h3>
      <div class="profile-option-grid">
        <label>의상 선택
          <select id="profileOutfit">
            <option value="다크네이비 정장">다크네이비 정장 (표준 신뢰감)</option>
            <option value="차콜그레이 정장">차콜그레이 정장 (차분한 전문성)</option>
            <option value="블랙 비즈니스 정장">블랙 비즈니스 정장 (단정하고 깔끔함)</option>
            <option value="화이트 셔츠와 네이비 자켓">화이트 셔츠와 네이비 자켓</option>
          </select>
        </label>
        <label>배경색 선택
          <select id="profileBackground">
            <option value="흰색">흰색 (공공기관·기업 표준)</option>
            <option value="밝은 그레이">밝은 그레이 (부드러운 스튜디오톤)</option>
            <option value="옅은 베이지">옅은 베이지 (따뜻하고 친근한 톤)</option>
            <option value="은은한 스카이블루">은은한 스카이블루 (신뢰감 형성)</option>
          </select>
        </label>
      </div>
      <div class="profile-prompt-heading">
        <strong>생성형 이미지 AI 입력 프롬프트</strong>
        <button class="practice-copy-button profile-prompt-copy" type="button">수정된 프롬프트 복사</button>
      </div>
      <pre class="profile-prompt-output" aria-live="polite"></pre>
    `;
    const outfitSelect = customizer.querySelector('#profileOutfit');
    const backgroundSelect = customizer.querySelector('#profileBackground');
    const promptOutput = customizer.querySelector('.profile-prompt-output');
    const copyButton = customizer.querySelector('.profile-prompt-copy');
    const updateProfilePrompt = () => {
      promptOutput.textContent = `당신은 지원자의 전문성과 신뢰감을 표현하는 프로필 이미지 디렉터입니다.\n\n첨부한 사람의 얼굴 특징과 연령대를 유지해주세요.\n\n이력서에 사용할 단정한 세로형 상반신 사진으로 바꿔주세요.\n\n- 의상: [${outfitSelect.value}]\n- 배경색: [${backgroundSelect.value}]\n- 표정: 자연스럽고 신뢰감 있는 미소\n- 구도: 정면을 바라보는 가슴 위 상반신\n\n밝고 부드러운 스튜디오 조명을 사용하고,\n얼굴을 과도하게 보정하거나 다른 사람처럼 바꾸지 마세요.`;
    };
    outfitSelect.addEventListener('change', updateProfilePrompt);
    backgroundSelect.addEventListener('change', updateProfilePrompt);
    copyButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(promptOutput.textContent);
      copyButton.textContent = '복사 완료';
      setTimeout(() => { copyButton.textContent = '수정된 프롬프트 복사'; }, 1500);
    });
    updateProfilePrompt();
    grid.append(customizer);
  }
  section.append(header, grid);
  contentRoot.append(section);
}

const pageTargets = [
  document.querySelector('#courseTop'),
  ...document.querySelectorAll('.course-section')
].filter(Boolean);

const pageNavigation = document.createElement('nav');
pageNavigation.className = 'page-navigation';
pageNavigation.setAttribute('aria-label', '강의 페이지 이동');
pageNavigation.innerHTML = `
  <button class="page-navigation-button page-navigation-previous" type="button" aria-label="이전 페이지"><span>이전</span>←</button>
  <output class="page-navigation-count" aria-live="polite">1 / ${pageTargets.length}</output>
  <button class="page-navigation-button page-navigation-next" type="button" aria-label="다음 페이지"><span>다음</span>→</button>
`;
document.body.append(pageNavigation);

const previousPageButton = pageNavigation.querySelector('.page-navigation-previous');
const nextPageButton = pageNavigation.querySelector('.page-navigation-next');
const pageCount = pageNavigation.querySelector('.page-navigation-count');
let currentPageIndex = 0;

function setCurrentPage(index) {
  currentPageIndex = Math.min(Math.max(index, 0), pageTargets.length - 1);
  previousPageButton.disabled = currentPageIndex === 0;
  nextPageButton.disabled = currentPageIndex === pageTargets.length - 1;
  pageCount.textContent = `${currentPageIndex + 1} / ${pageTargets.length}`;
}

function moveToPage(index) {
  const nextIndex = Math.min(Math.max(index, 0), pageTargets.length - 1);
  const target = pageTargets[nextIndex];
  target.scrollIntoView({block: 'start'});
  history.replaceState(null, '', `#${target.id}`);
  setCurrentPage(nextIndex);
}

previousPageButton.addEventListener('click', () => moveToPage(currentPageIndex - 1));
nextPageButton.addEventListener('click', () => moveToPage(currentPageIndex + 1));

const initialTargetIndex = pageTargets.findIndex((target) => `#${target.id}` === location.hash);
setCurrentPage(initialTargetIndex >= 0 ? initialTargetIndex : 0);

const pageObserver = new IntersectionObserver((entries) => {
  const visibleEntry = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (!visibleEntry) return;
  const visibleIndex = pageTargets.indexOf(visibleEntry.target);
  if (visibleIndex >= 0) setCurrentPage(visibleIndex);
}, {rootMargin: '-18% 0px -52% 0px', threshold: [0, 0.25, 0.5]});

pageTargets.forEach((target) => pageObserver.observe(target));

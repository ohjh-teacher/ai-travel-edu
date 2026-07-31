# AI_travel_edu Clean Architecture

## 목적

기존 강의 콘텐츠와 Firebase 데이터를 보호하면서 포털, 정규과정, 특별과정, 후기 제출 기능을 독립된 경계로 관리한다. 새 강의안은 기존 과정 파일을 수정하지 않고 별도 컨텍스트로 추가한다.

## 의존성 방향

`domain <- application <- presentation/infrastructure`

- `domain`: 프로젝트 매니페스트와 경계 규칙
- `application`: 빌드, 원문 잠금, 검증 사용 사례
- `presentation`: 과정별 원본 화면과 공통 프로젝터 스타일
- `infrastructure`: 파일 입출력과 Firebase 설정 어댑터
- 공개 경로의 HTML/CSS/JS: 빌드로 생성되는 결과물

## 소스 오브 트루스

- 과정 탐색: `content/catalog.json`
- 출력 매핑: `config/project.manifest.json`
- 화면 소스: `src/presentation/contexts/**`
- 공통 화면 규칙: `src/presentation/shared/**`
- 원문 기준선: `locks/content-lock.json`
- 공개 결과물: 기존 URL 위치의 HTML/CSS/JS

공개 결과물은 직접 수정하지 않는다. 화면 또는 문구 변경은 해당 컨텍스트의 소스에서만 수행하고 빌드한다.

## 변경 범위

- 문구 수정: 해당 컨텍스트의 HTML 소스와 콘텐츠 잠금만 갱신
- 레이아웃 수정: 해당 컨텍스트 CSS만 수정
- 프로젝터 글꼴 수정: 공통 `projector.css` 수정 후 프로젝터 과정 전체 검증
- Firebase 설정 수정: 공통 어댑터와 규칙을 별도 검증
- 새 강의 추가: 새 컨텍스트와 매니페스트 항목 추가

## 프로젝터 기준

- 16:9 화면
- 제목 50~68px
- 부제목 34~42px
- 본문 28~34px
- 보조 설명 22~26px
- 작은 글씨로 억지로 맞추지 않고 레이아웃을 나누어 해결

## 명령

- `npm run build`: 소스에서 공개 결과물 생성
- `npm run lock:content`: 승인된 현재 원문을 기준선으로 저장
- `npm run validate`: 결과물, 원문 잠금, 경계, 프로젝터 토큰 검증
- `npm run check`: 빌드 후 전체 검증
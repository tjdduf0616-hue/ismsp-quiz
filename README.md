# ISMS-P 심사원 문제풀이 앱

ISMS-P 인증심사원 시험 대비용 모바일 웹 퀴즈 앱입니다. 고정 문제은행 + 모의고사 + 회원별 기록(별표·오답노트·이어풀기·오답 가중 복습)을 제공합니다. 별도 API 키나 비용 없이 무료로 동작합니다.

## 구성 파일
| 파일 | 설명 |
|---|---|
| `index.html` | 앱 본체(UI + 로직). 단일 파일 |
| `questions.js` | 고정 문제은행. `QUESTION_BANK` 배열 |
| `scripts/validate.js` | 문제은행 무결성 검증 스크립트 |

## 로컬에서 실행 (VS Code)
브라우저에서 `index.html`을 그냥 열면 같은 폴더의 `questions.js`를 못 읽을 수 있어, **로컬 서버**로 실행하는 것을 권장합니다.

방법 A — VS Code 확장 "Live Server"
1. VS Code에서 이 폴더 열기
2. 확장 탭에서 **Live Server**(ritwickdey.LiveServer) 설치 (`.vscode/extensions.json`에 추천됨)
3. `index.html` 우클릭 → **Open with Live Server**

방법 B — 터미널
```bash
npm run serve        # http://localhost:5500 (http-server)
# 또는
python -m http.server 5500
```

## 문제 추가 / 검증
`questions.js`의 `QUESTION_BANK` 배열에 객체를 추가합니다.
```js
{ id:"고유id", cat:"카테고리", q:"문항?",
  opts:["①","②","③","④"], a:1,   // 정답 인덱스(0=①)
  exp:"해설", src:"출처" }
```
- `cat` 값: `고난도 / 암기 / AI / 가명 / 제도 / 관리 / 보호 / 개인정보 / 법령 / 안전성 / 클라우드`
- 카테고리를 새로 추가하려면 `index.html`의 `CATS`, `CAT_LABEL`도 함께 수정

추가 후 반드시 검증:
```bash
npm run validate     # 중복 id, 정답 인덱스 범위, 필드 누락 검사
```

## 배포 (GitHub Pages)
`main` 브랜치에 push하면 자동 반영됩니다.
```bash
git add -A
git commit -m "문제 추가"
git push
```
- 공개 주소: `https://<아이디>.github.io/ismsp-quiz/`
- 반영이 안 보이면 브라우저 캐시 때문이니 주소 뒤에 `?v=숫자`를 붙여 새로고침

## 주의
- API 키 등 비밀값을 코드에 하드코딩하지 마세요(공개 저장소).
- 문제·해설은 시험 직전 최신 법령·고시로 한 번 더 확인하세요.

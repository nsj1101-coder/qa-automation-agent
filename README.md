# QA Automation - Claude Code Commands

Claude Code에서 슬래시 커맨드(`/`)로 QA 테스트를 자동 실행하는 시스템입니다.
URL을 주면 Claude가 Playwright 브라우저로 직접 테스트합니다.

## 주요 기능

- URL만 입력하면 자동으로 페이지 분석 후 테스트
- 구글 스프레드시트에서 테스트 케이스 읽기 + 결과 자동 기록
- 실패 시 자동 스크린샷 캡처
- 로그인 세션 재사용 (같은 도메인 내 반복 로그인 방지)
- HTML/Markdown 리포트 자동 생성
- 테스트 실행 이력 누적 관리

## 설치

```bash
git clone nsj1101-coder/qa-automation-agent](https://github.com/nsj1101-coder/qa-automation-agent.git
cd qa-automation-agent
chmod +x install.sh
./install.sh
```

설치 후 **Claude Code를 재시작**하면 `/qa-` 로 시작하는 커맨드가 나타납니다.

## 명령어

### `/qa-test` — 테스트 실행

```
# URL만 → 페이지 자동 분석 후 3~7개 테스트 생성/실행
/qa-test https://workb.net

# URL + 지시사항 → 특정 시나리오 테스트
/qa-test https://workb.net 로그인 페이지에서 로그인 클릭, 구글 로그인 확인

# 마크다운 테스트 파일 실행
/qa-test test-cases/auth/login-valid.md
```

### `/qa-sheet` — 구글 스프레드시트에서 테스트

```
# 시트 전체 실행
/qa-sheet https://docs.google.com/spreadsheets/d/xxx/edit

# 특정 행만 실행
/qa-sheet https://docs.google.com/spreadsheets/d/xxx/edit 1-3

# 특정 탭 (gid 지정)
/qa-sheet https://docs.google.com/spreadsheets/d/xxx/edit?gid=123456
```

> 시트는 반드시 **"누구나 볼 수 있음"** 으로 공유 설정해야 합니다.

### `/qa-md` — 테스트 케이스 생성

아무 형태의 텍스트를 주면 마크다운 테스트 케이스로 변환합니다.

```
# 자연어
/qa-md https://workb.net 로그인 클릭, 구글 로그인 성공 확인

# 스프레드시트 붙여넣기
/qa-md TC-001  로그인 성공  https://app.example.com/login  test@test.com / pass123  대시보드 이동 확인
```

### `/qa-suite` — 여러 테스트 일괄 실행

```
/qa-suite test-cases/suite-smoke.md    # suite 파일
/qa-suite test-cases/auth/             # 폴더 내 전체
```

### `/qa-validate` — 형식 검증 (실행 안함)

```
/qa-validate test-cases/auth/login-valid.md
```

## 테스트 결과

테스트 실행 후 자동으로 `test-results/` 폴더에 저장됩니다:

```
test-results/
├── history.md                         ← 전체 실행 이력
├── 2026-03-03-sheet-report.md         ← Markdown 리포트
├── 2026-03-03-sheet-report.html       ← HTML 리포트 (브라우저에서 열기)
└── screenshots/
    ├── WB-C-019-step1-1709420000.png  ← 실패 시 자동 캡처
    └── WB-C-072-step2-1709420100.png
```

### HTML 리포트 예시

브라우저에서 열면 깔끔한 대시보드 형태로 결과를 확인할 수 있습니다:
- 요약 카드 (Total / Passed / Failed / Pass Rate)
- 테스트별 결과 테이블
- 실패 항목 상세 (기대결과, 실제결과, 스크린샷)

## 구글 시트 결과 자동 기록 (선택)

테스트 결과를 구글 시트에 자동으로 기록하려면:

### 1. Apps Script 배포

1. 테스트할 구글 스프레드시트에서 **[확장 프로그램] → [Apps Script]**
2. `google-apps-script.js` 내용을 복사 → 붙여넣기
3. **[배포] → [새 배포] → [웹 앱]**
   - 실행 주체: "나"
   - 액세스 권한: "모든 사용자"
4. 배포 후 나오는 URL 복사

### 2. qa-config.md에 URL 추가

```markdown
| SHEET_WEBHOOK_URL | https://script.google.com/macros/s/xxx/exec |
```

이후 `/qa-sheet` 실행 시 자동으로 시트에 PASS/FAIL 결과가 기록됩니다.

## 테스트 케이스 형식

### 웹 UI 테스트

```markdown
# Test: 로그인 성공

| Property | Value |
|----------|-------|
| Type | web |
| Priority | P0 |
| Tags | auth, smoke |

## Steps

### Step 1: 로그인 페이지 이동
- **Action**: Navigate to `{{BASE_URL}}/login`
- **Expected**: 로그인 폼이 보임

### Step 2: 로그인
- **Action**: Fill email with `{{TEST_USER_EMAIL}}`, password with `{{TEST_USER_PASSWORD}}`
- **Action**: Click "로그인" button
- **Expected**: /dashboard로 이동됨
```

### API 테스트

```markdown
# Test: Health Check

| Property | Value |
|----------|-------|
| Type | api |
| Priority | P0 |

## Steps

### Step 1: Health endpoint
- **Method**: GET
- **URL**: `{{API_BASE_URL}}/health`
- **Expected Status**: 200
- **Expected Body**: `"status"` 값이 `"ok"`
```

## 변수 설정 (선택)

마크다운 테스트 파일에서 `{{변수명}}`을 쓰려면, 프로젝트 루트에 `qa-config.md`를 만드세요:

```markdown
# QA Configuration

## Variables

| Variable | Value |
|----------|-------|
| BASE_URL | https://workb.net |
| TEST_USER_EMAIL | test@example.com |
| TEST_USER_PASSWORD | $ENV:QA_TEST_PASSWORD |
| SHEET_WEBHOOK_URL | https://script.google.com/macros/s/xxx/exec |
```

- `$ENV:변수명` → 시스템 환경변수에서 읽음 (비밀번호, 토큰 등)
- `{{TIMESTAMP}}`, `{{DATE}}`, `{{RANDOM}}` → 빌트인 (설정 불필요)

## 프로젝트 구조

```
qa-automation-agent/
├── README.md                ← 이 문서
├── install.sh               ← 원클릭 설치 스크립트
├── google-apps-script.js    ← 시트 자동기록용 Apps Script
├── commands/                ← 슬래시 커맨드 원본
│   ├── qa-test.md
│   ├── qa-sheet.md
│   ├── qa-md.md
│   ├── qa-suite.md
│   └── qa-validate.md
├── qa-config.md             ← 변수 설정 예제
└── test-cases/              ← 테스트 케이스 예제
    ├── auth/
    │   ├── login-valid.md
    │   └── login-invalid.md
    ├── api/
    │   └── health-check.md
    └── suite-smoke.md
```

## 팀원 온보딩

1. 이 레포를 `git clone`
2. `./install.sh` 실행
3. Claude Code 재시작
4. `/qa-test https://your-site.com` 입력 → 바로 테스트 시작

## FAQ

**Q: 슬래시 커맨드가 안 보여요**
A: Claude Code를 완전히 종료 후 재시작하세요.

**Q: 구글 시트를 못 읽어요**
A: 시트 공유 설정이 "누구나 볼 수 있음"인지 확인하세요.

**Q: 로그인이 필요한 페이지 테스트는?**
A: 시트에 계정/비밀번호 컬럼을 추가하거나, qa-config.md에 변수로 설정하세요.

**Q: HTML 리포트는 어디서 보나요?**
A: `test-results/` 폴더의 `.html` 파일을 브라우저에서 열면 됩니다.

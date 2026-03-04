# Test: 잘못된 비밀번호로 로그인 실패

| Property | Value |
|----------|-------|
| Type | web |
| Priority | P0 |
| Tags | auth, negative |

## Preconditions
- 앱이 {{BASE_URL}}에서 실행 중

## Steps

### Step 1: 로그인 페이지 이동
- **Action**: Navigate to `{{BASE_URL}}/login`
- **Expected**: 로그인 폼이 보임

### Step 2: 이메일 입력
- **Action**: Fill the email field with `{{TEST_USER_EMAIL}}`
- **Expected**: 이메일 필드에 값이 입력됨

### Step 3: 잘못된 비밀번호 입력
- **Action**: Fill the password field with `wrong-password-12345`
- **Expected**: 비밀번호 필드가 채워짐

### Step 4: 로그인 시도
- **Action**: Click the "로그인" or "Sign In" button
- **Expected**: 에러 메시지가 표시됨 (예: "잘못된 비밀번호", "Invalid credentials")
- **Expected**: 여전히 /login 페이지에 있음
- **Expected**: 대시보드나 홈 콘텐츠가 보이지 않음

## Cleanup
- 없음

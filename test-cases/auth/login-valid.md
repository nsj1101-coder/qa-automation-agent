# Test: 유효한 계정으로 로그인

| Property | Value |
|----------|-------|
| Type | web |
| Priority | P0 |
| Tags | auth, smoke |

## Preconditions
- 앱이 {{BASE_URL}}에서 실행 중
- 테스트 사용자 계정 존재: {{TEST_USER_EMAIL}} / {{TEST_USER_PASSWORD}}

## Steps

### Step 1: 로그인 페이지 이동
- **Action**: Navigate to `{{BASE_URL}}/login`
- **Expected**: 이메일과 비밀번호 입력 필드가 있는 로그인 폼이 보임

### Step 2: 이메일 입력
- **Action**: Fill the email input field with `{{TEST_USER_EMAIL}}`
- **Expected**: 이메일 필드에 값이 입력됨

### Step 3: 비밀번호 입력
- **Action**: Fill the password input field with `{{TEST_USER_PASSWORD}}`
- **Expected**: 비밀번호 필드가 채워짐

### Step 4: 로그인 버튼 클릭
- **Action**: Click the "로그인" or "Sign In" button
- **Expected**: /login 페이지에서 벗어남
- **Expected**: 대시보드 또는 홈 페이지가 표시됨

### Step 5: 로그인 상태 확인
- **Action**: Verify the page content
- **Expected**: 사용자 이름 또는 환영 메시지가 보임
- **Expected**: "로그아웃" 또는 "Logout" 링크/버튼이 존재

## Cleanup
- 없음

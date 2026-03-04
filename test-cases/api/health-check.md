# Test: API Health Check

| Property | Value |
|----------|-------|
| Type | api |
| Priority | P0 |
| Tags | health, smoke |

## Steps

### Step 1: Health endpoint 호출
- **Method**: GET
- **URL**: `{{API_BASE_URL}}/health`
- **Expected Status**: 200
- **Expected Body**: `"status"` 필드가 `"ok"` 또는 `"healthy"` 값을 가짐

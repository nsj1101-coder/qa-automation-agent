You are a QA test suite executor. Run multiple test case files and produce an aggregated report.

## Instructions

1. **Determine input type** for path: `$ARGUMENTS`
   - If it is a `.md` file → read it as a suite definition. Look for the "Test Cases" section listing file paths (one per bullet).
   - If it is a directory → find all `.md` files in it (excluding `qa-config.md`, files starting with `suite-` or `README`). These are the test cases.

2. **Read configuration** from `qa-config.md` in the current working directory.
   - Extract variables. For `$ENV:` values, read from environment via Bash.
   - Built-in variables: `{{TIMESTAMP}}`, `{{DATE}}`, `{{RANDOM}}`.

3. **Setup**:
   - Create directories: `mkdir -p test-results/screenshots`

4. **Session management (Login Reuse)**:
   - Track the current domain and login state
   - On FIRST test requiring login: perform full login flow
   - On SUBSEQUENT tests on the SAME domain: `browser_snapshot` to check if still logged in
     - If logged in → skip login, navigate directly to test URL
     - If session expired → re-login
   - Only navigate to `about:blank` when switching DOMAINS

5. **For each test case file**:
   - Read and parse the test file
   - Resolve `{{VARIABLE}}` placeholders from config
   - Determine type (web/api) from metadata
   - Execute all steps:
     - **Web**: Playwright MCP tools (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_fill_form`, `browser_take_screenshot`)
     - **API**: Bash curl
   - Record step-level results (PASS/FAIL/ERROR)
   - **On failure**: save screenshot to `test-results/screenshots/{test-name}-step{N}.png`
   - Show brief progress: "Running test N of M: [name]..."

6. **Save results**:

### 6a. Markdown report
Save to `test-results/{YYYY-MM-DD}-suite-report.md` with full results table and per-failure details.

### 6b. HTML report
Save to `test-results/{YYYY-MM-DD}-suite-report.html` using this template:

```html
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>QA Suite Report - {DATE}</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; padding: 2rem; color: #333; }
  .container { max-width: 960px; margin: 0 auto; }
  .header { background: linear-gradient(135deg, #1a1a2e, #16213e); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 1.5rem; }
  .header h1 { font-size: 1.5rem; margin-bottom: 0.5rem; }
  .header .meta { opacity: 0.8; font-size: 0.9rem; }
  .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; }
  .stat { background: white; border-radius: 10px; padding: 1.2rem; text-align: center; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
  .stat .number { font-size: 2rem; font-weight: 700; }
  .stat .label { font-size: 0.85rem; color: #666; margin-top: 0.3rem; }
  .stat.pass .number { color: #22c55e; }
  .stat.fail .number { color: #ef4444; }
  .stat.total .number { color: #3b82f6; }
  .stat.rate .number { color: #f59e0b; }
  .results { background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.06); margin-bottom: 1.5rem; }
  .results table { width: 100%; border-collapse: collapse; }
  .results th { background: #f8f9fa; padding: 0.8rem 1rem; text-align: left; font-size: 0.85rem; color: #555; border-bottom: 2px solid #e9ecef; }
  .results td { padding: 0.8rem 1rem; border-bottom: 1px solid #f0f0f0; font-size: 0.9rem; }
  .badge { display: inline-block; padding: 0.2rem 0.7rem; border-radius: 20px; font-size: 0.8rem; font-weight: 600; }
  .badge.pass { background: #dcfce7; color: #166534; }
  .badge.fail { background: #fee2e2; color: #991b1b; }
  .badge.error { background: #fef3c7; color: #92400e; }
  .detail-card { background: white; border-radius: 10px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.06); border-left: 4px solid #ef4444; }
  .detail-card h3 { margin-bottom: 0.5rem; }
  .detail-card p { margin: 0.3rem 0; font-size: 0.9rem; }
  .screenshot img { max-width: 100%; border-radius: 8px; border: 1px solid #e5e7eb; margin-top: 0.5rem; }
  .footer { text-align: center; margin-top: 2rem; color: #999; font-size: 0.8rem; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>QA Suite Report</h1>
    <div class="meta">Suite: {SUITE_NAME} | Date: {DATE}</div>
  </div>
  <div class="summary">
    <div class="stat total"><div class="number">{TOTAL}</div><div class="label">Tests</div></div>
    <div class="stat pass"><div class="number">{PASSED}</div><div class="label">Passed</div></div>
    <div class="stat fail"><div class="number">{FAILED}</div><div class="label">Failed</div></div>
    <div class="stat rate"><div class="number">{RATE}%</div><div class="label">Pass Rate</div></div>
  </div>
  <div class="results">
    <table>
      <thead><tr><th>#</th><th>Test</th><th>Type</th><th>Status</th><th>Steps</th></tr></thead>
      <tbody>{TABLE_ROWS}</tbody>
    </table>
  </div>
  <h2 style="margin-bottom:1rem;">Failures</h2>
  {DETAIL_CARDS}
  <div class="footer">Generated by QA Automation - Claude Code</div>
</div>
</body>
</html>
```

### 6c. Update history index
Append to `test-results/history.md` (create with header if doesn't exist):
```
| {DATE} | Suite: {NAME} | {TOTAL} | {PASSED} | {FAILED} | {RATE}% | [MD](file.md) [HTML](file.html) |
```

7. **Print aggregated report** to console:

```
================================================================
  QA SUITE REPORT
================================================================
  Suite:    [suite name or directory]
  Tests:    [total]
  Passed:   [count]
  Failed:   [count]
  Errors:   [count]
================================================================
  RESULTS
----------------------------------------------------------------
  #  Test Name                         Type   Status   Steps
----------------------------------------------------------------
  1  [test name]                       web    PASS     5/5
  2  [test name]                       api    FAIL     2/3
----------------------------------------------------------------
  Pass rate: X% (N/M)
================================================================
  Reports saved:
    - Markdown: test-results/{DATE}-suite-report.md
    - HTML:     test-results/{DATE}-suite-report.html
    - History:  test-results/history.md
================================================================

  FAILURES:
  --------
  Test #2: [test name]
    Step 2: [step description]
    Expected: ...
    Actual: ...
    Screenshot: test-results/screenshots/xxx.png
================================================================
```

## Rules

- Execute tests in listed order.
- If a test file is not found, record as ERROR and continue to next.
- Keep per-test output concise during execution; save details for the final report.
- Always `browser_snapshot` before interacting with web elements.
- For API tests, show HTTP status and response excerpt in failure details.
- Always save screenshots on failure.
- Reuse login sessions within the same domain.
- Always generate both Markdown and HTML reports.
- Always update the history index.

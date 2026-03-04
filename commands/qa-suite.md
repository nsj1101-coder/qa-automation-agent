You are a QA test suite executor. Run multiple test case files and produce an aggregated report.

## Instructions

1. **Determine input type** for path: `$ARGUMENTS`
   - If it is a `.md` file → read it as a suite definition. Look for the "Test Cases" section listing file paths (one per bullet).
   - If it is a directory → find all `.md` files in it (excluding `qa-config.md`, files starting with `suite-` or `README`). These are the test cases.

2. **Read configuration** from `qa-config.md` in the current working directory.
   - Extract variables. For `$ENV:` values, read from environment via Bash.
   - Built-in variables: `{{TIMESTAMP}}`, `{{DATE}}`, `{{RANDOM}}`.

3. **For each test case file**:
   - Read and parse the test file
   - Resolve `{{VARIABLE}}` placeholders from config
   - Determine type (web/api) from metadata
   - Execute all steps:
     - **Web**: Playwright MCP tools (`browser_navigate`, `browser_snapshot`, `browser_click`, `browser_type`, `browser_fill_form`, `browser_take_screenshot`)
     - **API**: Bash curl
   - Record step-level results (PASS/FAIL/ERROR)
   - Between web tests: navigate to `about:blank` to reset browser state
   - Show brief progress: "Running test N of M: [name]..."

4. **Print aggregated report** after all tests:

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

  FAILURES:
  --------
  Test #2: [test name]
    Step 2: [step description]
    Expected: ...
    Actual: ...
================================================================
```

## Rules

- Execute tests in listed order.
- If a test file is not found, record as ERROR and continue to next.
- Keep per-test output concise during execution; save details for the final report.
- Always `browser_snapshot` before interacting with web elements.
- For API tests, show HTTP status and response excerpt in failure details.

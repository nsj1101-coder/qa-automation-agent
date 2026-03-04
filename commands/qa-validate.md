You are a QA test case validator. Read a Markdown test case file and check its format WITHOUT executing any tests.

## Instructions

1. **Read the file** at: `$ARGUMENTS`

2. **Validate the following**:
   - Has a level-1 heading starting with `# Test:`
   - Has a metadata table with at least `Type` (web or api) and `Priority`
   - Has a `## Steps` section (or step headings like `### Step N:`)
   - Each step has:
     - For web: at least one `**Action**` line and one `**Expected**` line
     - For API: `**Method**`, `**URL**`, and `**Expected Status**`
   - All `{{VARIABLE}}` references have matching entries in `qa-config.md` (read it if exists)
   - For web tests: actions use recognizable verbs (Navigate, Click, Fill, Type, Select, Assert, Verify, Wait, Screenshot)

3. **Report results**:

```
============================================
  VALIDATION REPORT: [filename]
============================================
  Check                        Result
--------------------------------------------
  # Test: heading              PASS / FAIL
  Metadata table               PASS / FAIL
  Type field                   PASS / FAIL
  Priority field               PASS / FAIL
  Steps section                PASS / FAIL
  Step format (actions)        PASS / WARN
  Step format (expectations)   PASS / WARN
  Variable references          PASS / WARN
--------------------------------------------
  Result: VALID / INVALID
============================================
```

4. For any FAIL or WARN, provide a specific fix suggestion.
5. If valid, confirm the file is ready for `/user:qa-test` execution.

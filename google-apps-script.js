/**
 * Google Apps Script - QA 결과 자동 기록
 *
 * 설정 방법:
 * 1. Google Spreadsheet에서 [확장 프로그램] → [Apps Script] 클릭
 * 2. 아래 코드를 전체 복사 후 붙여넣기
 * 3. [배포] → [새 배포] → [웹 앱] 선택
 *    - 실행 주체: "나"
 *    - 액세스 권한: "모든 사용자"
 * 4. 배포 후 나오는 URL을 qa-config.md에 SHEET_WEBHOOK_URL로 설정
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheetId = data.spreadsheetId;
    var gid = data.gid || '0';
    var results = data.results; // [{row, status, details, date}]

    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheets = ss.getSheets();
    var sheet = null;

    // Find sheet by gid
    for (var i = 0; i < sheets.length; i++) {
      if (sheets[i].getSheetId().toString() === gid.toString()) {
        sheet = sheets[i];
        break;
      }
    }

    if (!sheet) {
      sheet = ss.getSheets()[0];
    }

    // Find or create result columns
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    var statusCol = findOrCreateColumn(sheet, headers, ['QA결과', 'QA Status', 'Auto Test Result']);
    var detailCol = findOrCreateColumn(sheet, headers, ['QA상세', 'QA Details', 'Auto Test Details']);
    var dateCol = findOrCreateColumn(sheet, headers, ['QA일시', 'QA Date', 'Test Date']);

    // Write results
    for (var j = 0; j < results.length; j++) {
      var r = results[j];
      var row = r.row;

      if (statusCol > 0) sheet.getRange(row, statusCol).setValue(r.status);
      if (detailCol > 0) sheet.getRange(row, detailCol).setValue(r.details || '');
      if (dateCol > 0) sheet.getRange(row, dateCol).setValue(r.date);

      // Color coding
      if (statusCol > 0) {
        var cell = sheet.getRange(row, statusCol);
        if (r.status === 'PASS') {
          cell.setBackground('#dcfce7').setFontColor('#166534');
        } else if (r.status === 'FAIL') {
          cell.setBackground('#fee2e2').setFontColor('#991b1b');
        } else {
          cell.setBackground('#f3f4f6').setFontColor('#6b7280');
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({
      success: true,
      updated: results.length
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function findOrCreateColumn(sheet, headers, possibleNames) {
  // Try to find existing column
  for (var i = 0; i < headers.length; i++) {
    for (var j = 0; j < possibleNames.length; j++) {
      if (headers[i] && headers[i].toString().trim() === possibleNames[j]) {
        return i + 1;
      }
    }
  }

  // Create new column with first name
  var newCol = headers.length + 1;
  sheet.getRange(1, newCol).setValue(possibleNames[0]).setFontWeight('bold');
  return newCol;
}

// Test function (run manually to verify)
function testDoPost() {
  var testData = {
    postData: {
      contents: JSON.stringify({
        spreadsheetId: 'YOUR_SPREADSHEET_ID',
        gid: '0',
        results: [
          { row: 2, status: 'PASS', details: '', date: '2026-03-03' },
          { row: 3, status: 'FAIL', details: 'API 500 에러', date: '2026-03-03' }
        ]
      })
    }
  };

  var result = doPost(testData);
  Logger.log(result.getContent());
}

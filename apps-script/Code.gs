/**
 * Nhận xác nhận tham dự & lời chúc từ thiệp cưới, ghi vào Google Sheet này.
 * Tab "Xác nhận": Thời gian | Tên | Tham dự
 * Tab "Lời chúc": Thời gian | Tên | Lời chúc
 */
const TABS = {
  rsvp: { name: 'Xác nhận', head: ['Thời gian', 'Tên', 'Tham dự'] },
  wish: { name: 'Lời chúc', head: ['Thời gian', 'Tên', 'Lời chúc'] },
};

function doPost(e) {
  const p = (e && e.parameter) || {};
  const type = p.type === 'wish' ? 'wish' : 'rsvp';
  const name = String(p.name || '').trim().slice(0, 200);
  if (!name) return json({ ok: false, error: 'missing name' });

  const row = type === 'wish'
    ? [new Date(), name, String(p.msg || '').trim().slice(0, 2000)]
    : [new Date(), name, p.attend === 'yes' ? 'Sẽ đến' : 'Không đến'];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tab = TABS[type];
    let sh = ss.getSheetByName(tab.name);
    if (!sh) {
      sh = ss.insertSheet(tab.name);
      sh.appendRow(tab.head);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, tab.head.length).setFontWeight('bold');
    }
    sh.appendRow(row.map(safe));
  } finally {
    lock.releaseLock();
  }
  return json({ ok: true });
}

function doGet() {
  return json({ ok: true, service: 'wedding-rsvp' });
}

// Chặn chèn công thức (=, +, -, @) vào ô
function safe(v) {
  return typeof v === 'string' && /^[=+\-@]/.test(v) ? "'" + v : v;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

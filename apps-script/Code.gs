/**
 * Nhận xác nhận tham dự & lời chúc từ thiệp cưới, ghi vào Google Sheet này.
 * Tab "Xác nhận": Thời gian | Tên | Tham dự | Bên
 * Tab "Lời chúc": Thời gian | Tên | Lời chúc | Bên
 * Bên = Nhà trai (link gốc) / Nhà gái (link có ?side=bride)
 */
const TABS = {
  rsvp: { name: 'Xác nhận', head: ['Thời gian', 'Tên', 'Tham dự', 'Bên'] },
  wish: { name: 'Lời chúc', head: ['Thời gian', 'Tên', 'Lời chúc', 'Bên'] },
};

function doPost(e) {
  const p = (e && e.parameter) || {};
  const type = p.type === 'wish' ? 'wish' : 'rsvp';
  const name = String(p.name || '').trim().slice(0, 200);
  if (!name) return json({ ok: false, error: 'missing name' });
  const side = p.side === 'bride' ? 'Nhà gái' : 'Nhà trai';

  const row = type === 'wish'
    ? [new Date(), name, String(p.msg || '').trim().slice(0, 2000), side]
    : [new Date(), name, p.attend === 'yes' ? 'Sẽ đến' : 'Không đến', side];

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const tab = TABS[type];
    let sh = ss.getSheetByName(tab.name);
    if (!sh) {
      sh = ss.insertSheet(tab.name);
      sh.setFrozenRows(1);
    }
    // Tạo/cập nhật dòng tiêu đề (tự thêm cột "Bên" cho tab đã có từ trước)
    const head = sh.getRange(1, 1, 1, tab.head.length);
    if (head.getValues()[0].join('|') !== tab.head.join('|')) {
      head.setValues([tab.head]).setFontWeight('bold');
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

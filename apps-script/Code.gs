/**
 * RSVP endpoint for the Erie & Christine wedding site.
 *
 * Paste this into the Apps Script editor of a Google Sheet
 * (Extensions > Apps Script), then deploy it as a web app:
 *   Deploy > New deployment > Web app
 *   Execute as: Me        Who has access: Anyone
 * Copy the web app URL into RSVP_URL at the top of script.js.
 *
 * Every RSVP is added as a row on a sheet called "RSVPs"
 * (created automatically on the first response).
 */

const SHEET_NAME = 'RSVPs';
const HEADERS = ['Received', 'Name', 'Attending', 'Guests', 'Message'];
const MAX_GUESTS = 10;

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // one write at a time, so rows never collide

    const p = (e && e.parameter) || {};

    // Hidden field real guests never fill in; bots do. Pretend it worked.
    if (p.website) return json({ ok: true });

    const name = clean(p.name, 120);
    if (!name) return json({ ok: false, error: 'Please tell us your name.' });
    if (p.attending !== 'yes' && p.attending !== 'no') {
      return json({ ok: false, error: 'Please let us know if you can come.' });
    }

    const attending = p.attending === 'yes';
    const guests = attending
      ? Math.min(Math.max(parseInt(p.guests, 10) || 1, 1), MAX_GUESTS)
      : 0;

    getSheet().appendRow([
      new Date(),
      name,
      attending ? 'Yes' : 'No',
      guests,
      clean(p.message, 500),
    ]);

    return json({ ok: true });
  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the web app URL in a browser shows this, to confirm it is live. */
function doGet() {
  return json({ ok: true, message: 'RSVP endpoint is running.' });
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/** Trim, cap the length, and stop text being run as a spreadsheet formula. */
function clean(value, maxLength) {
  const text = String(value || '').trim().slice(0, maxLength);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

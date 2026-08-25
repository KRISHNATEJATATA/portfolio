/**
 * Portfolio contact form → Google Sheet + email notification.
 * ---------------------------------------------------------------------------
 *
 * SETUP (one time, ~5 minutes):
 *
 * 1. Create a Google Sheet at sheets.new. Rename the first tab to "Messages"
 *    (or let the script create it — it makes the header row automatically).
 *
 * 2. In that Sheet, open Extensions > Apps Script, delete the placeholder
 *    code, and paste this entire file. Binding the script to the Sheet is
 *    what lets getActiveSpreadsheet() find it.
 *
 * 3. Confirm OWNER_EMAIL below. It is pre-set to tejakrishnatata@gmail.com —
 *    every submission appends a row to the Sheet AND emails this address,
 *    with reply-to set to the visitor so you can just hit Reply.
 *
 * 4. Deploy > New deployment > select type: Web app.
 *      - Description: anything (e.g. "portfolio contact form")
 *      - Execute as:  Me
 *      - Who has access: Anyone          <-- required, the form posts anonymously
 *    Click Deploy and approve the permission prompts.
 *
 * 5. Copy the Web app URL ending in /exec.
 *
 * 6. Point the site at it:
 *      - Local dev:  copy .env.example to .env, set
 *                    NEXT_PUBLIC_CONTACT_ENDPOINT=<url>, then restart `npm run dev`.
 *      - Production: add NEXT_PUBLIC_CONTACT_ENDPOINT as a GitHub secret;
 *                    the deploy workflow (.github/workflows/deploy.yml)
 *                    inlines it at build time and redeploys on push to main.
 *
 * Until the endpoint is configured, the site simply shows a mailto CTA
 * instead of the form — nothing breaks.
 *
 * QUOTA: MailApp on a free Gmail account allows ~100 recipient emails/day.
 * A portfolio will never get close. Sheet appends don't count against it.
 *
 * PROTOCOL NOTE: the form POSTs application/x-www-form-urlencoded on purpose
 * — it's a CORS-safelisted content type, so the browser sends a simple
 * request with no OPTIONS preflight, which Apps Script deployments handle
 * cleanly. doPost() also accepts a JSON body as a fallback.
 * ---------------------------------------------------------------------------
 */

/** Where notifications are sent. */
const OWNER_EMAIL = 'tejakrishnatata@gmail.com';

/** Tab name submissions are appended to. Created if missing. */
const SHEET_NAME = 'Messages';

/** Marker written into each row so you can tell where entries came from. */
const SOURCE_LABEL = 'portfolio';

/**
 * Web app entry point. Receives the form POST and returns JSON.
 * @param {GoogleAppsScript.Events.DoPost} e The POST event.
 * @returns {GoogleAppsScript.Content.TextOutput} JSON {ok:true} or {ok:false,error}.
 */
function doPost(e) {
  try {
    const data = parsePayload(e);

    const name = String(data.name || '').trim();
    const email = String(data.email || '').trim();
    const message = String(data.message || '').trim();

    if (!name || !email || !message) {
      return json({ ok: false, error: 'Missing required fields: name, email, message.' });
    }

    appendRow({
      timestamp: new Date(),
      name: name,
      email: email,
      message: message,
      source: SOURCE_LABEL,
    });

    sendNotification(name, email, message);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: err && err.message ? err.message : String(err) });
  }
}

/**
 * Accepts either urlencoded form data or a JSON string body.
 * @param {GoogleAppsScript.Events.DoPost} e The POST event.
 * @returns {Object<string, string>} Parsed key/value pairs.
 */
function parsePayload(e) {
  if (e.postData && e.postData.contents) {
    const contentType = String(e.postData.type || '').toLowerCase();
    if (contentType.indexOf('json') !== -1) {
      return JSON.parse(e.postData.contents);
    }
    return parseFormEncoded(e.postData.contents);
  }
  // Apps Script also exposes query/form params here for simple requests.
  return e.parameter || {};
}

/**
 * Minimal application/x-www-form-urlencoded parser.
 * @param {string} raw Raw body, e.g. "name=A&email=b%40c.dev".
 * @returns {Object<string, string>} Decoded key/value pairs.
 */
function parseFormEncoded(raw) {
  const out = {};
  raw.split('&').forEach(function (pair) {
    if (!pair) return;
    const eq = pair.indexOf('=');
    const key = eq === -1 ? pair : pair.slice(0, eq);
    const value = eq === -1 ? '' : pair.slice(eq + 1);
    out[decode(key)] = decode(value);
  });
  return out;
}

function decode(encoded) {
  return decodeURIComponent(String(encoded).replace(/\+/g, ' '));
}

/**
 * Appends one row to the "Messages" sheet, creating sheet + header if needed.
 * @param {{timestamp: Date, name: string, email: string, message: string, source: string}} row
 * @returns {void}
 */
function appendRow(row) {
  const sheet = getSheet();
  sheet.appendRow([
    row.timestamp,
    row.name,
    row.email,
    row.message,
    row.source,
  ]);
}

/**
 * Gets the bound spreadsheet's "Messages" tab, creating it (with headers) if empty.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet}
 */
function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Name', 'Email', 'Message', 'Source']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  return sheet;
}

/**
 * Emails the owner a formatted summary, reply-to the visitor.
 * @param {string} name Visitor name.
 * @param {string} email Visitor email.
 * @param {string} message Visitor message.
 * @returns {void}
 */
function sendNotification(name, email, message) {
  const subject = 'Portfolio contact: ' + name;
  const body =
    'New message from the portfolio site.\n\n' +
    'Name: ' + name + '\n' +
    'Email: ' + email + '\n\n' +
    'Message:\n' + message + '\n';

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: subject,
    body: body,
    replyTo: email,
  });
}

/**
 * JSON response helper.
 * @param {{ok: boolean, error?: string}} payload Response body.
 * @returns {GoogleAppsScript.Content.TextOutput}
 */
function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}

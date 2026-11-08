/** Simply Serials public read-only feed.
 * Keep the Google spreadsheet private. Only rows with Status = Published are exposed.
 * Deploy as Web app: Execute as you; access: Anyone.
 */
const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const SERIALS_TAB = 'Serials';
const EPISODES_TAB = 'Episodes';

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const serials = readRows_(ss, SERIALS_TAB).filter(r => published_(r.Status)).map(r => ({
      id: str_(r.SerialID), title: str_(r.SerialName), channel: str_(r.Channel),
      posterUrl: str_(r.PosterURL), description: str_(r.Description)
    })).filter(x => x.id && x.title);
    const serialMap = {};
    serials.forEach(s => serialMap[s.id] = s.title);
    const episodes = readRows_(ss, EPISODES_TAB).filter(r => published_(r.Status)).map((r, i) => {
      const serialId = str_(r.SerialID);
      return {
        id: str_(r.EpisodeID) || ('ep-' + (i + 1)), serialId,
        serialTitle: serialMap[serialId] || str_(r.SerialName),
        episodeNumber: str_(r.EpisodeNumber), title: str_(r.EpisodeTitle),
        date: dateText_(r.ReleaseDate), sortDate: sortDate_(r.ReleaseDate),
        videoType: str_(r.VideoType), embedCode: str_(r.EmbedCode),
        videoUrl: str_(r.VideoURL), officialUrl: str_(r.OfficialURL),
        thumbnailUrl: str_(r.ThumbnailURL)
      };
    }).filter(e => e.serialId && e.serialTitle);
    const payload = JSON.stringify({ ok: true, updatedAt: new Date().toISOString(), serials, episodes });
    const callback = String((e && e.parameter && e.parameter.callback) || '');
    if (callback && /^[A-Za-z_$][\w$]*$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + payload + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    const payload = JSON.stringify({ ok: false, error: String(err.message || err) });
    const callback = String((e && e.parameter && e.parameter.callback) || '');
    if (callback && /^[A-Za-z_$][\w$]*$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + payload + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
  }
}

function readRows_(ss, tabName) {
  const sh = ss.getSheetByName(tabName);
  if (!sh) throw new Error('Missing sheet tab: ' + tabName);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(h => String(h).trim());
  return values.slice(1).filter(row => row.some(v => v !== '' && v !== null))
    .map(row => headers.reduce((obj, h, i) => (obj[h] = row[i], obj), {}));
}
function published_(value) { return String(value || '').trim().toLowerCase() === 'published'; }
function str_(v) { return v == null ? '' : String(v).trim(); }
function dateText_(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, Session.getScriptTimeZone(), 'dd MMM yyyy');
  return str_(v);
}
function sortDate_(v) {
  if (v instanceof Date && !isNaN(v)) return Utilities.formatDate(v, 'UTC', "yyyy-MM-dd'T'HH:mm:ss'Z'");
  return str_(v);
}

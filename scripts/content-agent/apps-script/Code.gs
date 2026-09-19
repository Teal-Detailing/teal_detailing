/**
 * Teal Detailing - content agent data source (read-only).
 *
 * Deploy as its OWN standalone Apps Script project, in the Google account
 * that owns the Completed Jobs spreadsheet. It is deliberately separate from
 * the /job bot's script so nothing here can break job logging.
 *
 * Script properties (Project Settings -> Script properties):
 *   SPREADSHEET_ID   required - from the sheet URL: /spreadsheets/d/<THIS>/edit
 *   API_KEY          required - long random string; same value as the GitHub
 *                    secret CONTENT_SCRIPT_KEY
 *   JOBS_SHEET_NAME  optional - tab holding completed jobs. Defaults to the
 *                    first tab where any row contains a Drive folder link.
 *
 * Google requires full Sheets permission for SpreadsheetApp.openById, even
 * though this script only ever reads.
 *
 * It never returns customer names, phone numbers, prices, or street numbers -
 * the agent runs in a public GitHub repo's Actions, so it only ever receives
 * what a published post could safely use.
 */

// Folder links only. The old "open?id=" form is deliberately not matched: it
// can point at a single file, and the /job bot's photo column would then be
// mistaken for a job's photo folder.
var FOLDER_URL = /drive\.google\.com\/drive\/(?:u\/\d+\/)?folders\/([A-Za-z0-9_-]{10,})/;

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var expected = PropertiesService.getScriptProperties().getProperty('API_KEY');
    if (!expected || p.key !== expected) return json_({ error: 'unauthorized' });

    if (p.action === 'jobs') return json_({ jobs: listJobs_(Number(p.days) || 120) });
    if (p.action === 'photos') return json_(listPhotos_(p.folderId));
    if (p.action === 'photo') return json_(getPhoto_(p.folderId, p.fileId, Number(p.size) || 1800));
    return json_({ error: 'unknown action' });
  } catch (err) {
    return json_({ error: String((err && err.message) || err) });
  }
}

// Run once from the editor (pick "authorize" in the function menu -> Run).
// It exists to bring up Google's permission prompt, and doubles as a setup
// check: it opens the newest job's actual photo folder - usually on a Shared
// Drive - so a membership problem shows up here rather than in Telegram.
function authorize() {
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  Logger.log('Spreadsheet: ' + ss.getName());
  Logger.log('Jobs tab: ' + jobsSheet_().getName());

  var jobs = listJobs_(120);
  Logger.log('Jobs with a photo folder (last 120 days): ' + jobs.length);
  if (!jobs.length) return;

  var folder;
  try {
    folder = DriveApp.getFolderById(jobs[0].folderId);
  } catch (err) {
    Logger.log('CANNOT OPEN the newest job folder. Add ' + Session.getEffectiveUser().getEmail() +
      ' as a member of the Shared Drive, then run this again. (' + err.message + ')');
    return;
  }
  var pair = namedPair_(jobs[0].folderId);
  Logger.log('Newest job folder: "' + folder.getName() + '" - ' + pair.total + ' photo(s), ' +
    'named before: ' + (pair.before ? pair.before.name : 'NONE') + ', named after: ' + (pair.after ? pair.after.name : 'NONE'));
  var sample = pair.before || pair.after;
  if (sample) Logger.log('Photo preview: ' + (thumbnail_(sample.id, 200) ? 'OK' : 'FAILED'));
  Logger.log('City sent to the agent: ' + (jobs[0].area || '(none recognised)'));
}

// Troubleshooting: shows where Drive links appear in the sheet and in what
// form. Prints tab and column names only - never cell contents.
function findPhotoLinks() {
  var ss = SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID'));
  Logger.log('Spreadsheet: ' + ss.getName());
  ss.getSheets().forEach(function (sheet) {
    var range = sheet.getDataRange();
    var values = range.getDisplayValues();
    var formulas = range.getFormulas();
    var rich = range.getRichTextValues();
    var chips = chipLinks_(sheet);
    var header = values[0] || [];
    var found = {};
    for (var r = 1; r < values.length; r++) {
      for (var c = 0; c < values[r].length; c++) {
        var rt = rich[r][c];
        var link = rt ? (rt.getLinkUrl() || rt.getRuns().map(function (x) { return x.getLinkUrl(); }).filter(String)[0]) : '';
        var kinds = [];
        [['chip or link', (chips[r + ',' + c] || []).join(' ')], ['pasted URL', values[r][c]],
         ['formula', formulas[r][c]], ['link text', link]].forEach(function (p) {
          var v = String(p[1] || '');
          if (/drive\.google\.com|docs\.google\.com/.test(v)) {
            kinds.push(p[0] + (/\/folders\//.test(v) ? ' to a folder' : /\/file\/d\//.test(v) ? ' to a single FILE' : ''));
          }
        });
        if (kinds.length) {
          var key = '"' + (header[c] || 'column ' + (c + 1)) + '" as ' + kinds.join(' + ');
          found[key] = (found[key] || 0) + 1;
        }
      }
    }
    Logger.log('Tab "' + sheet.getName() + '" - ' + (values.length - 1) + ' rows - columns: ' + header.join(' | '));
    var keys = Object.keys(found);
    keys.forEach(function (k) { Logger.log('    Drive links in ' + k + ': ' + found[k] + ' row(s)'); });
    if (!keys.length) Logger.log('    no Drive links the script can read');
  });
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------- jobs

function jobsSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ss = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID'));
  var named = props.getProperty('JOBS_SHEET_NAME');
  if (named) {
    var sheet = ss.getSheetByName(named);
    if (!sheet) throw new Error('No tab named "' + named + '"');
    return sheet;
  }
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (readRows_(sheets[i]).some(function (r) { return r.folderId; })) return sheets[i];
  }
  throw new Error('No tab contains a Drive folder link yet');
}

// A folder link can arrive four ways: as a smart chip (Sheets' default when
// a Drive link is pasted - a grey pill showing the folder name), as plain
// pasted text, as a link behind other text, or as a =HYPERLINK() formula.
// Checking all four means it's found however it was added.
function readRows_(sheet) {
  var range = sheet.getDataRange();
  var values = range.getDisplayValues();
  var rich = range.getRichTextValues();
  var formulas = range.getFormulas();
  var chips = chipLinks_(sheet);
  var header = values[0] || [];
  var rows = [];

  for (var r = 1; r < values.length; r++) {
    var folderId = null;
    for (var c = 0; c < values[r].length && !folderId; c++) {
      var candidates = [values[r][c], formulas[r][c]].concat(chips[r + ',' + c] || []);
      var rt = rich[r][c];
      if (rt) {
        candidates.push(rt.getLinkUrl());
        rt.getRuns().forEach(function (run) { candidates.push(run.getLinkUrl()); });
      }
      for (var k = 0; k < candidates.length && !folderId; k++) {
        var m = candidates[k] && String(candidates[k]).match(FOLDER_URL);
        if (m) folderId = m[1];
      }
    }
    rows.push({ index: r + 1, header: header, cells: values[r], folderId: folderId });
  }
  return rows;
}

// SpreadsheetApp can't see the link inside a smart chip - it only returns
// the chip's display text (the folder name). The Sheets API returns it as
// CellData.chipRuns[].chip.richLinkProperties.uri. Keys are "row,col",
// 0-based from A1, matching getDataRange().
function chipLinks_(sheet) {
  var range = "'" + sheet.getName().replace(/'/g, "''") + "'";
  var url = 'https://sheets.googleapis.com/v4/spreadsheets/' + sheet.getParent().getId() +
    '?ranges=' + encodeURIComponent(range) +
    '&fields=' + encodeURIComponent('sheets.data(startRow,startColumn,rowData.values(hyperlink,chipRuns))');
  var res = UrlFetchApp.fetch(url, {
    headers: { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() },
    muteHttpExceptions: true
  });
  if (res.getResponseCode() !== 200) {
    throw new Error('Sheets API returned ' + res.getResponseCode() + ': ' + res.getContentText().slice(0, 300));
  }

  var links = {};
  var grids = ((JSON.parse(res.getContentText()).sheets || [])[0] || {}).data || [];
  grids.forEach(function (grid) {
    var r0 = grid.startRow || 0;
    var c0 = grid.startColumn || 0;
    (grid.rowData || []).forEach(function (row, ri) {
      (row.values || []).forEach(function (cell, ci) {
        var found = [];
        if (cell.hyperlink) found.push(cell.hyperlink);
        (cell.chipRuns || []).forEach(function (run) {
          var props = run.chip && run.chip.richLinkProperties;
          if (props && props.uri) found.push(props.uri);
        });
        if (found.length) links[(r0 + ri) + ',' + (c0 + ci)] = found;
      });
    });
  });
  return links;
}

function column_(header, include, exclude) {
  for (var i = 0; i < header.length; i++) {
    var h = String(header[i]);
    if (include.test(h) && !(exclude && exclude.test(h))) return i;
  }
  return -1;
}

function cell_(row, idx) {
  return idx >= 0 ? String(row.cells[idx] || '').trim() : '';
}

// Only a recognised city ever leaves the sheet - never the street. The
// City/Area column holds full addresses, often without commas
// ("123 sw 1st st Miami fl 33100"), so the city is matched from a known
// list, anchored to the end of the address so a street like "N Miami Ave"
// isn't mistaken for the city. No match means no location at all.
var CITIES = [
  'North Miami Beach', 'Miami Beach', 'North Miami', 'Miami Gardens', 'Miami Lakes', 'Miami Springs',
  'Miami Shores', 'South Miami', 'Miami', 'Doral', 'Hialeah Gardens', 'Hialeah', 'Kendall', 'Westchester',
  'Sweetwater', 'Coral Gables', 'Pinecrest', 'Palmetto Bay', 'Cutler Bay', 'Homestead', 'Florida City',
  'Key Biscayne', 'Aventura', 'Sunny Isles Beach', 'Bal Harbour', 'Surfside', 'Opa-locka', 'Medley',
  'Fort Lauderdale', 'Hollywood', 'Pembroke Pines', 'Miramar', 'Davie', 'Plantation', 'Sunrise', 'Weston',
  'Cooper City', 'Southwest Ranches', 'Coral Springs', 'Tamarac', 'Lauderhill', 'Lauderdale Lakes',
  'Lauderdale-by-the-Sea', 'Oakland Park', 'Wilton Manors', 'Pompano Beach', 'Deerfield Beach',
  'Hallandale Beach', 'Dania Beach', 'Margate', 'Coconut Creek', 'Parkland', 'Lighthouse Point',
  'North Lauderdale', 'West Park', 'Boca Raton', 'Delray Beach', 'Boynton Beach', 'Lake Worth Beach',
  'Lake Worth', 'Lantana', 'West Palm Beach', 'Palm Beach Gardens', 'North Palm Beach', 'Royal Palm Beach',
  'Palm Beach', 'Jupiter', 'Tequesta', 'Wellington', 'Greenacres', 'Riviera Beach', 'Loxahatchee'
];

var CITY_AT_END = new RegExp(
  '(?:^|[\\s,])(' + CITIES.map(function (c) { return c.replace(/-/g, '[- ]'); }).join('|') + ')' +
  '\\s*,?\\s*(?:fl|fla|florida)?\\.?\\s*,?\\s*(?:\\d{5}(?:-\\d{4})?)?\\s*,?\\s*(?:usa?)?\\s*$',
  'i'
);

function cityOf_(address) {
  var normalised = String(address)
    .replace(/\bft\.?\s+/ig, 'fort ')
    .replace(/\bn\.?\s+(miami|palm)/ig, 'north $1')
    .replace(/\bw\.?\s+palm/ig, 'west palm')
    .replace(/\s+/g, ' ')
    .trim();
  var m = normalised.match(CITY_AT_END);
  if (!m) return '';
  var hit = m[1].toLowerCase().replace(/[- ]/g, '');
  for (var i = 0; i < CITIES.length; i++) {
    if (CITIES[i].toLowerCase().replace(/[- ]/g, '') === hit) return CITIES[i] + ', FL';
  }
  return '';
}

function listJobs_(days) {
  var rows = readRows_(jobsSheet_()).filter(function (r) { return r.folderId; });
  if (!rows.length) return [];
  var h = rows[0].header;
  var col = {
    id: column_(h, /job\s*id|^id$/i),
    date: (function () {
      var exact = column_(h, /^(job\s*)?date$/i);
      return exact >= 0 ? exact : column_(h, /date/i, /reminder/i);
    })(),
    vehicle: column_(h, /vehicle/i, /price/i),
    pkg: column_(h, /package/i, /price|total/i),
    addOns: column_(h, /add.?ons?/i, /price/i),
    notes: column_(h, /notes?/i),
    address: column_(h, /address|location|city|area/i)
  };

  var cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return rows
    .map(function (r) {
      var dateText = cell_(r, col.date);
      var parsed = Date.parse(dateText);
      return {
        jobId: cell_(r, col.id) || 'row-' + r.index,
        date: dateText,
        sortKey: isNaN(parsed) ? r.index : parsed,
        recent: isNaN(parsed) || parsed >= cutoff,
        vehicleType: cell_(r, col.vehicle),
        packageName: cell_(r, col.pkg),
        addOns: cell_(r, col.addOns),
        notes: cell_(r, col.notes),
        area: cityOf_(cell_(r, col.address)),
        folderId: r.folderId
      };
    })
    .filter(function (j) { return j.recent; })
    .sort(function (a, b) { return b.sortKey - a.sortKey; })
    .map(function (j) { delete j.sortKey; delete j.recent; return j; });
}

// Only folders actually linked from the jobs sheet can be read - the key alone
// shouldn't be enough to pull arbitrary files out of this Drive.
function assertKnownFolder_(folderId) {
  var known = readRows_(jobsSheet_()).some(function (r) { return r.folderId === folderId; });
  if (!known) throw new Error('Folder is not linked from any job');
}

// ---------------------------------------------------------------- photos

function collectImages_(folder, label, out, depth) {
  var files = folder.getFiles();
  while (files.hasNext() && out.length < 300) {
    var f = files.next();
    if (/^image\//.test(f.getMimeType())) {
      out.push({ id: f.getId(), name: f.getName(), folder: label, created: f.getDateCreated().toISOString() });
    }
  }
  // One level of subfolders covers the common "Before" / "After" layout.
  if (depth < 1) {
    var subs = folder.getFolders();
    while (subs.hasNext()) {
      var sub = subs.next();
      collectImages_(sub, sub.getName(), out, depth + 1);
    }
  }
}

// The owner marks the pair to publish by renaming two photos in the job's
// folder so the names contain the word "before" and "after" ("before.jpg",
// "Before 2.HEIC", "IMG_4410 after.jpg"). Only those two are ever read, so
// a folder can hold any number of other shots - and a folder with no named
// pair simply isn't used for a post.
function photoRole_(name) {
  var base = String(name).replace(/\.[^.]+$/, '').toLowerCase();
  var isBefore = /(^|[^a-z])before([^a-z]|$)/.test(base);
  var isAfter = /(^|[^a-z])after([^a-z]|$)/.test(base);
  if (isBefore === isAfter) return null;
  return isBefore ? 'before' : 'after';
}

function namedPair_(folderId) {
  var all = [];
  collectImages_(DriveApp.getFolderById(folderId), '', all, 0);
  // With several "before" photos, the plainest name wins: "before.jpg" over "before 2.jpg".
  var pick = function (role) {
    return all
      .filter(function (p) { return photoRole_(p.name) === role; })
      .sort(function (a, b) { return a.name.length - b.name.length || (a.name < b.name ? -1 : 1); })[0] || null;
  };
  return { total: all.length, before: pick('before'), after: pick('after') };
}

function listPhotos_(folderId) {
  assertKnownFolder_(folderId);
  var pair = namedPair_(folderId);
  var photos = [];
  [['before', pair.before], ['after', pair.after]].forEach(function (entry) {
    var p = entry[1];
    if (!p) return;
    var blob = thumbnail_(p.id, 800);
    photos.push({
      id: p.id, name: p.name, folder: p.folder, created: p.created, role: entry[0],
      thumb: blob ? Utilities.base64Encode(blob.getBytes()) : null
    });
  });
  return { total: pair.total, photos: photos };
}

function getPhoto_(folderId, fileId, size) {
  assertKnownFolder_(folderId);
  var file = DriveApp.getFileById(fileId);
  if (!isInside_(file, folderId)) throw new Error('File is not in that job folder');

  // Drive's rendered thumbnail is always a JPEG/PNG, which sidesteps iPhone
  // HEIC files the agent can't decode. The original is the fallback for the
  // formats that don't need converting.
  var blob = thumbnail_(fileId, size);
  if (!blob && /^image\/(jpeg|png|webp)$/.test(file.getMimeType())) blob = file.getBlob();
  if (!blob) throw new Error('Could not render photo ' + file.getName());
  return { base64: Utilities.base64Encode(blob.getBytes()) };
}

function isInside_(file, folderId) {
  var parents = file.getParents();
  while (parents.hasNext()) {
    var parent = parents.next();
    if (parent.getId() === folderId) return true;
    var grand = parent.getParents();
    while (grand.hasNext()) if (grand.next().getId() === folderId) return true;
  }
  return false;
}

function thumbnail_(fileId, size) {
  var auth = { Authorization: 'Bearer ' + ScriptApp.getOAuthToken() };
  var meta = UrlFetchApp.fetch(
    'https://www.googleapis.com/drive/v3/files/' + fileId + '?fields=thumbnailLink&supportsAllDrives=true',
    { headers: auth, muteHttpExceptions: true }
  );
  if (meta.getResponseCode() !== 200) return null;
  var link = JSON.parse(meta.getContentText()).thumbnailLink;
  if (!link) return null;

  var sized = /=s\d+$/.test(link) ? link.replace(/=s\d+$/, '=s' + size) : link + '=s' + size;
  // Some thumbnail hosts reject an Authorization header on an already-signed
  // URL, others need it - try with it first, then without.
  var attempts = [{ headers: auth, muteHttpExceptions: true }, { muteHttpExceptions: true }];
  for (var i = 0; i < attempts.length; i++) {
    var res = UrlFetchApp.fetch(sized, attempts[i]);
    if (res.getResponseCode() === 200) return res.getBlob();
  }
  return null;
}

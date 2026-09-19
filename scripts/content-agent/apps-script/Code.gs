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
 * It never returns customer names, phone numbers, prices, or street numbers -
 * the agent runs in a public GitHub repo's Actions, so it only ever receives
 * what a published post could safely use.
 */

var FOLDER_URL = /drive\.google\.com\/(?:drive\/(?:u\/\d+\/)?folders\/|open\?id=)([A-Za-z0-9_-]{10,})/;

function doGet(e) {
  try {
    var p = (e && e.parameter) || {};
    var expected = PropertiesService.getScriptProperties().getProperty('API_KEY');
    if (!expected || p.key !== expected) return json_({ error: 'unauthorized' });

    if (p.action === 'jobs') return json_({ jobs: listJobs_(Number(p.days) || 120) });
    if (p.action === 'photos') return json_({ photos: listPhotos_(p.folderId) });
    if (p.action === 'photo') return json_(getPhoto_(p.folderId, p.fileId, Number(p.size) || 1800));
    return json_({ error: 'unknown action' });
  } catch (err) {
    return json_({ error: String((err && err.message) || err) });
  }
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

// A folder link can arrive three ways: pasted as plain text, as a chip/rich
// text link whose visible text is something like "Photos", or as a
// =HYPERLINK() formula. Checking all three means it's found however it was
// added.
function readRows_(sheet) {
  var range = sheet.getDataRange();
  var values = range.getDisplayValues();
  var rich = range.getRichTextValues();
  var formulas = range.getFormulas();
  var header = values[0] || [];
  var rows = [];

  for (var r = 1; r < values.length; r++) {
    var folderId = null;
    for (var c = 0; c < values[r].length && !folderId; c++) {
      var candidates = [values[r][c], formulas[r][c]];
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

// "123 Main St, Apt 4, Miami, FL 33130" -> "Miami, FL 33130". The agent only
// needs the city; the street never leaves the spreadsheet.
function areaOnly_(address) {
  var parts = address.split(',').map(function (s) { return s.trim(); }).filter(String);
  if (parts.length >= 3) return parts.slice(-2).join(', ');
  if (parts.length === 2) return parts[1];
  return address.replace(/^\s*\d+[A-Za-z]?\s+/, '').replace(/\b(apt|unit|suite|#)\s*\S+/ig, '').trim();
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
    address: column_(h, /address|location/i)
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
        area: areaOnly_(cell_(r, col.address)),
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
  while (files.hasNext() && out.length < 30) {
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

function listPhotos_(folderId) {
  assertKnownFolder_(folderId);
  var out = [];
  collectImages_(DriveApp.getFolderById(folderId), '', out, 0);
  out.sort(function (a, b) { return a.created < b.created ? -1 : 1; });
  return out.slice(0, 24).map(function (p) {
    var blob = thumbnail_(p.id, 800);
    p.thumb = blob ? Utilities.base64Encode(blob.getBytes()) : null;
    return p;
  });
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

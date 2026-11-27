// ============================================================
// Photo Booth API — Apps Script NUEVO e INDEPENDIENTE
// No esta vinculado a ninguna hoja de calculo: guarda las fotos
// directamente en una carpeta de Google Drive. No toca el RSVP
// ni el Panel de Administracion.
//
// PASO 1 — Ve a https://script.google.com/home y crea un
// "Nuevo proyecto". Borra el contenido de Code.gs y pega TODO
// este archivo.
//
// PASO 2 — Revisa (opcional) la fecha de revelado y el limite
// de fotos mas abajo (REVEAL_AT y MAX_SHOTS) y ajustalos si
// quieres cambiarlos.
//
// PASO 3 — Implementar > Nueva implementacion > tipo
// "Aplicacion web", ejecutar como "Yo", acceso "Cualquier
// usuario". La primera vez Google pedira autorizar permisos de
// Drive: es normal, acepta con tu cuenta.
//
// PASO 4 — Copia la URL /exec resultante y pegala en camara.html
// reemplazando "PEGA_AQUI_LA_URL_DEL_WEB_APP_PHOTO_BOOTH_API".
//
// La carpeta de Drive "Fotos Boda Cindy y Victor" se crea sola
// la primera vez que alguien sube una foto o abre la galeria.
// ============================================================

var FOLDER_NAME = 'Fotos Boda Cindy y Victor';
var MAX_SHOTS = 15;
var REVEAL_AT = new Date('2027-01-17T12:00:00-06:00'); // mañana siguiente a la boda, mediodía

function getFolder_() {
  var props = PropertiesService.getScriptProperties();
  var id = props.getProperty('folderId');
  if (id) {
    try { return DriveApp.getFolderById(id); } catch (e) {}
  }
  var it = DriveApp.getFoldersByName(FOLDER_NAME);
  var folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER_NAME);
  props.setProperty('folderId', folder.getId());
  return folder;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function countShots_(folder, rollId) {
  var it = folder.getFiles();
  var marker = '__' + rollId + '__';
  var count = 0;
  while (it.hasNext()) {
    if (it.next().getName().indexOf(marker) !== -1) count++;
  }
  return count;
}

function doGet(e) {
  var action = e.parameter.action;
  var folder = getFolder_();

  if (action === 'count') {
    var rollId = (e.parameter.rollId || '').replace(/[^a-zA-Z0-9_-]/g, '');
    var count = countShots_(folder, rollId);
    return json_({ count: count, remaining: Math.max(0, MAX_SHOTS - count), max: MAX_SHOTS });
  }

  if (action === 'gallery') {
    var now = new Date();
    if (now < REVEAL_AT) {
      return json_({ revealed: false, revealAt: REVEAL_AT.toISOString() });
    }
    var it = folder.getFiles();
    var photos = [];
    while (it.hasNext()) {
      var f = it.next();
      var parts = f.getName().split('__');
      var rollName = parts[0] || 'Invitado';
      photos.push({
        name: rollName,
        url: 'https://drive.google.com/uc?export=view&id=' + f.getId(),
        ts: f.getDateCreated().getTime()
      });
    }
    photos.sort(function (a, b) { return a.ts - b.ts; });
    return json_({ revealed: true, photos: photos });
  }

  return json_({ error: 'accion desconocida' });
}

function doPost(e) {
  var action = e.parameter.action;
  if (action !== 'upload') return json_({ ok: false, error: 'accion desconocida' });

  var folder = getFolder_();
  var rollId = (e.parameter.rollId || '').replace(/[^a-zA-Z0-9_-]/g, '');
  var rollName = (e.parameter.rollName || 'Invitado').replace(/[^a-zA-Z0-9 _-]/g, '').trim() || 'Invitado';
  if (!rollId) return json_({ ok: false, error: 'falta rollId' });

  var count = countShots_(folder, rollId);
  if (count >= MAX_SHOTS) {
    return json_({ ok: false, error: 'limite_alcanzado', count: count, max: MAX_SHOTS });
  }

  var base64 = e.parameter.data || '';
  var commaIdx = base64.indexOf(',');
  if (commaIdx !== -1) base64 = base64.substring(commaIdx + 1); // por si llega como data URL completa

  var bytes;
  try {
    bytes = Utilities.base64Decode(base64);
  } catch (err) {
    return json_({ ok: false, error: 'imagen_invalida' });
  }

  var blob = Utilities.newBlob(bytes, 'image/jpeg', rollName + '__' + rollId + '__' + Date.now() + '.jpg');
  var file = folder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);

  var newCount = count + 1;
  return json_({ ok: true, count: newCount, remaining: Math.max(0, MAX_SHOTS - newCount) });
}

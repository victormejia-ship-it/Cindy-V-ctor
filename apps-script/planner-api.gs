// ============================================================
// Planner Data API — Apps Script NUEVO e INDEPENDIENTE
// Vinculado a una hoja de cálculo NUEVA (no toca "Confirmaciones RSVP"
// ni el flujo del RSVP público). Sirve datos de proveedores, itinerario,
// tareas y asignaciones de mesa/alergias para admin.html.
//
// PASO 1 — Crea una hoja de cálculo nueva en Google Sheets llamada,
// por ejemplo, "Wedding Planner Data", con estas 5 pestañas y encabezados
// EXACTOS en la fila 1 (respeta mayúsculas/minúsculas y orden):
//
//   Pestaña "Vendors":    id | proveedor | categoria | costo | deposito | fecha_limite | pagado
//   Pestaña "Itinerary":  id | hora | actividad | responsable | notas
//   Pestaña "Tasks":      id | mes | tarea | hecho
//   Pestaña "Overrides":  codigo | invitado | mesa | alergias | nota
//   Pestaña "Config":     clave | valor
//
// PASO 2 — En esa hoja: Extensiones > Apps Script. Borra el contenido
// de Code.gs y pega TODO este archivo.
//
// PASO 3 — Implementar > Nueva implementación > tipo "Aplicación web",
// ejecutar como "Yo", acceso "Cualquier usuario". Copia la URL /exec
// resultante y pégala en admin.html reemplazando el texto
// "PEGA_AQUI_LA_URL_DEL_NUEVO_WEB_APP_PLANNER_DATA_API".
// ============================================================

var TABLES = {
  vendors:   ['id','proveedor','categoria','costo','deposito','fecha_limite','pagado'],
  itinerary: ['id','hora','actividad','responsable','notas'],
  tasks:     ['id','mes','tarea','hecho'],
  overrides: ['codigo','invitado','mesa','alergias','nota'],
  config:    ['clave','valor']
};

function getSheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name);
  if (!sheet) throw new Error('No existe la pestaña "' + name + '"');
  return sheet;
}

function readAll_(name) {
  var cols = TABLES[name];
  var sheet = getSheet_(name);
  var values = sheet.getDataRange().getValues();
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    if (!values[i].join('')) continue; // salta filas vacías
    var obj = {};
    for (var c = 0; c < cols.length; c++) {
      obj[cols[c]] = values[i][c] !== undefined ? values[i][c] : '';
    }
    rows.push(obj);
  }
  return rows;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var table = e.parameter.table;
  var out = {};
  if (table && TABLES[table]) {
    out[table] = readAll_(table);
  } else {
    for (var name in TABLES) out[name] = readAll_(name);
  }
  return json_(out);
}

function doPost(e) {
  var action = e.parameter.action;
  var table = e.parameter.table;
  var cols = TABLES[table];
  if (!cols) return json_({ ok: false, error: 'tabla desconocida: ' + table });

  var sheet = getSheet_(table);
  var data = {};
  try { data = JSON.parse(e.parameter.data || '{}'); } catch (err) { data = {}; }

  var keyCol = cols.indexOf('id') !== -1 ? 'id' : cols[0];
  var keyIdx = cols.indexOf(keyCol);

  if (action === 'add') {
    if (keyCol === 'id' && !data.id) data.id = Utilities.getUuid();
    var row = cols.map(function (c) { return data[c] !== undefined ? data[c] : ''; });
    sheet.appendRow(row);
    return json_({ ok: true, id: data[keyCol] });
  }

  if (action === 'update') {
    var values = sheet.getDataRange().getValues();
    for (var i = 1; i < values.length; i++) {
      if (String(values[i][keyIdx]) === String(data[keyCol])) {
        var rowNum = i + 1;
        for (var c = 0; c < cols.length; c++) {
          if (data[cols[c]] !== undefined) sheet.getRange(rowNum, c + 1).setValue(data[cols[c]]);
        }
        return json_({ ok: true });
      }
    }
    return json_({ ok: false, error: 'no encontrado' });
  }

  if (action === 'delete') {
    var values2 = sheet.getDataRange().getValues();
    for (var j = 1; j < values2.length; j++) {
      if (String(values2[j][keyIdx]) === String(data[keyCol])) {
        sheet.deleteRow(j + 1);
        return json_({ ok: true });
      }
    }
    return json_({ ok: false, error: 'no encontrado' });
  }

  return json_({ ok: false, error: 'accion desconocida: ' + action });
}

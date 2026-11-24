// ============================================================
// AGREGAR AL FINAL del Apps Script existente "RSVP Boda"
// (el que ya tiene doPost). NO borres ni modifiques nada de lo
// que ya existe ahí — esta función es 100% aditiva.
//
// Expone un doGet que devuelve todas las confirmaciones en JSON,
// para que el panel de administración (admin.html) pueda leerlas.
// No cambia en nada el comportamiento del formulario público.
// ============================================================

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var values = sheet.getDataRange().getValues();
  if (values.length < 1) {
    return ContentService.createTextOutput('[]').setMimeType(ContentService.MimeType.JSON);
  }
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var c = 0; c < headers.length; c++) {
      var key = String(headers[c] || ('col' + c)).toLowerCase().trim();
      var val = values[i][c];
      row[key] = (val instanceof Date) ? val.toISOString() : val;
    }
    rows.push(row);
  }
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
// Después de pegar esto:
// 1. Guardar (Ctrl+S / ícono de guardar).
// 2. Implementar > Gestionar implementaciones > (lápiz de editar
//    la implementación activa) > Versión: Nueva versión > Implementar.
//    Esto actualiza la MISMA URL /exec, no genera una nueva.
// 3. Probar abriendo la URL /exec en el navegador: debe mostrar
//    un JSON con la lista de confirmaciones (o "[]" si no hay
//    ninguna todavía).
// ============================================================

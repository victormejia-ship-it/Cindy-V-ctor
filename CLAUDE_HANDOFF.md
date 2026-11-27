# Cindy & Víctor — Handoff para Claude

## Objetivo
Continuar el desarrollo y publicación de la invitación digital de boda de **Cindy Yaneth Hernández Martínez** y **Víctor Mejía Chávez**.

## Repositorio
- GitHub: `victormejia-ship-it/Cindy-V-ctor`
- Rama principal: `main`

## Hosting actual
- Firebase project: `CV26`
- Project ID: `cv26-f99e2`
- Firebase Hosting clásico, plan Spark.
- **URL principal para compartir con invitados:** `https://cindyvictor2027.web.app`
  - Es un "sitio adicional" (multisite) dentro del mismo proyecto `cv26-f99e2`, creado para tener un link más bonito/personalizado que el nombre del proyecto.
  - Vinculado mediante un hosting *target* llamado `invitacion` (ver `.firebaserc` local del usuario, no versionado en este repo).
- URL original del proyecto (sigue activa, no se usa para compartir): `https://cv26-f99e2.web.app`
- **El despliegue ahora es automático (desde el 27/nov/2026).** `firebase.json` y `.firebaserc` viven versionados en este repo (antes solo existían en el Escritorio del usuario). Un GitHub Action (`.github/workflows/firebase-deploy.yml`) se dispara en cada push a `main` y publica directo a `hosting:invitacion` usando `FirebaseExtended/action-hosting-deploy`. El usuario ya **no necesita PowerShell ni descargar archivos manualmente** — en cuanto Claude fusiona un cambio a `main`, el Action lo despliega solo en unos 1-2 minutos. Se puede ver el progreso/resultado de cada despliegue en la pestaña "Actions" del repositorio en GitHub.
  - Requiere el secret de repo `FIREBASE_SERVICE_ACCOUNT_CV26` (una cuenta de servicio de Firebase) — ver sección "Configuración pendiente" si aún no existe.
  - El incidente histórico de contenido viejo servido (14/sep/2026) era por descargas manuales fallidas a `Desktop\public\`; con el deploy automático ese modo de falla ya no aplica — el Action siempre construye desde el commit exacto que se fusionó a `main`.

### Configuración pendiente (una sola vez, por el dueño del proyecto)
Para que el GitHub Action pueda publicar, falta crear el secret `FIREBASE_SERVICE_ACCOUNT_CV26` en GitHub (Settings → Secrets and variables → Actions → New repository secret), con el contenido de una clave de cuenta de servicio generada en Firebase Console (Configuración del proyecto → Cuentas de servicio → Generar nueva clave privada). Todo por navegador, sin terminal. Mientras no exista ese secret, el Action fallará (se puede ver el error en la pestaña "Actions") y no hay fallback automático a PowerShell — si urge publicar algo antes de configurarlo, se puede volver al flujo manual anterior (`firebase deploy --only hosting:invitacion` desde el Escritorio).

## Arquitectura actual
- Frontend: HTML/CSS/JS estático.
- Hosting: Firebase Hosting.
- Código fuente: GitHub.
- Firestore está creado pero todavía no está integrado al RSVP real.
- La personalización por invitado sigue siendo demo en JS mediante query `?codigo=`.

## Archivos clave
- `index.html` — invitación principal.
- `CV2026.jpeg` — fotografía real de la pareja (usada como fondo del hero).
- `intro-cv.mp4` — video de intro que se reproduce automáticamente antes de la tarjeta "Abrir invitación". Transcodificado a H.264/AAC (960x540, ~3.7MB) porque el archivo original que subió el usuario venía en HEVC/H.265 (típico de iPhone), que Chrome en Android/Windows y Firefox no reproducen. Tiene botón "Omitir" y si el video falla (error o navegador sin soporte) se salta automáticamente a la tarjeta de apertura.
- `CV_opcion_1_clasica_elegante_vector.svg` / `CV_opcion_1_vector_claro_fondo_oscuro.svg` — archivos fuente del logotipo C|V vectorizado (versión oscura para fondos claros y versión clara para fondos oscuros), ya integrados como símbolos `#cvmark` y `#cvmark-light` dentro de `index.html`. Conservar por si se necesita volver a extraer o regenerar.
- `cindy-victor-boda.png` — **NO es una foto**: es una captura de pantalla de una maqueta de diseño de referencia (con nav, íconos, secciones). Se usó como guía para reconstruir `index.html` (ver "Diseño actual") pero no debe usarse como imagen en el sitio.
- `boda-cindy-victor-v3.ics` — calendario.
- `gracias_v3.html` — página de agradecimiento.

## Datos de la boda
- Novia: Cindy Yaneth Hernández Martínez
- Novio: Víctor Mejía Chávez
- Fecha: 16 de enero de 2027
- Recepción: 20:30 hrs
- Ciudad: Monterrey, Nuevo León
- Lugar: **Las Pampas Eventos | Salón Martín Fierro**
- Dirección: Avenida C. 2 de Abril - Jesús Dionisio González 2302, Roma, 64700 Monterrey, N.L.
- Google Maps: `https://maps.app.goo.gl/unB1Y5qZvCrwQpe69`
- Adultos solamente.
- Código de vestimenta: Formal.
- Nota: El color blanco está reservado para la novia.

## Diseño
- Estilo: elegante, minimalista, editorial, premium.
- Paleta: crema, verde olivo, verde oscuro, dorado sutil.
- Tipografías: Bodoni Moda + Manrope.
- Mantener buena adaptación móvil.
- En iPhone se corrigió la foto para que no se recorte.
- Los iconos deben ser SVG lineales, nunca emojis nativos.

## Sección de nombres
Usar:
- `Cindy` grande (sin "Yaneth" — se retiró de toda la invitación por decisión del usuario)
- `HERNÁNDEZ MARTÍNEZ` pequeño
- `&` dorado
- `Víctor` grande
- `MEJÍA CHÁVEZ` pequeño

## Lugar / ubicación
El usuario pidió evitar repetir el nombre del salón varias veces.
La intención final es mostrarlo una sola vez de forma principal y conservar la dirección únicamente donde aporte valor en la zona de ubicación.

## RSVP
Encabezado:
- `RSVP`
- `Confirma tu asistencia`

No incluir debajo la frase repetida “Nos encantará saber que compartirás esta noche con nosotros.”

En el recuadro verde sí conservar un texto equivalente a:
`Nos encantará contar con tu presencia. Por favor indícanos cuántas personas de esta invitación podrán acompañarnos.`

## Invitados / personalización
Actualmente existen demos en JS:
- FAM001 → Familia Hernández → 4
- FAM002 → Carlos y Andrea → 2
- IND001 → María → 1

Objetivo posterior:
- mover invitaciones a Firestore
- usar tokens aleatorios no adivinables
- limitar confirmados al número incluido en la invitación
- registrar RSVP en Firestore

## Firestore
Proyecto: `cv26-f99e2`
Reglas actuales conocidas en etapa inicial fueron deny-all mientras se prepara la estructura.
Colecciones previstas:
- `invitaciones`
- `confirmaciones`

## Diseño actual (reconstruido en commit `ab8c271`)
El sitio se reconstruyó para igualar una maqueta de referencia que el usuario tenía guardada (por error) como `cindy-victor-boda.png`. Estructura actual de `index.html`, de arriba a abajo:
1. Tarjeta de apertura (`#opening`) — click en "Abrir invitación" para entrar. Sin logo ni raspado (versión simple original).
2. `<nav class="topnav">` — fijo arriba: monograma CV, links (Inicio / Nuestra historia / Detalles / Confirma), ícono de corazón "Juntos siempre".
3. `<header class="hero2" id="inicio">` — foto real (`CV2026.jpeg`) de fondo con panel oscuro degradado a la izquierda (nombres, monograma, fecha, ubicación) y frase en script "La vida es mejor contigo" abajo a la derecha.
4. `.feat-row.light` (`#detalles-info`) — 3 columnas con íconos: Recepción, Ubicación (botón Google Maps), Agregar al calendario (botón .ics). **No incluye ceremonia religiosa** — el usuario confirmó que ese dato en la maqueta era genérico/no real.
5. `.feat-row.dark` — 4 columnas: Código de vestimenta, Regalo, Solo adultos, Confirma tu asistencia (botón a `#rsvp`).
6. `.thanks` — banner "Gracias por ser parte / De este nuevo capítulo" con ramitas de olivo decorativas en las esquinas (mismo arte SVG que el monograma, símbolo `#leafspray`).
7. `#fecha` — "Guarda la fecha", 4 círculos raspables (día/mes/año/ciudad).
8. Cuenta regresiva.
9. Quote ("Nuestro para siempre comienza aquí").
10. `#rsvp` — formulario completo (aún no conectado a Firestore).
11. Footer con monograma y nombres.

El monograma "C|V" (símbolo `#cvmark`, reutilizado vía `<use>`) se reconstruyó en SVG a partir de una foto de referencia del usuario: C y V separadas por una línea vertical, rama de olivo confinada arriba sin cruzar las letras, tipografía Bodoni Moda no itálica. Se usa en nav, hero, footer y (como `#leafspray`, solo la ramita) en el banner de agradecimiento.

Publicado en GitHub (`main`), **pendiente de reflejarse en Firebase Hosting** (ver Pendientes).

## Panel de Administración (admin.html)
Panel privado de wedding planner, **completamente aislado** de la invitación pública: archivo propio `admin.html`, CSS/JS propios (tipografía Inter, paleta blanco/gris, sin relación visual con `index.html`), y `index.html` no se modificó para nada de esto.

- **Acceso:** pantalla de PIN antes de mostrar cualquier dato (hash SHA-256 comparado en el navegador, desbloqueo guardado en `sessionStorage` por pestaña). PIN actual por defecto: `270116`. Esto es un filtro para que un invitado no entre por error, no es seguridad fuerte — cualquiera que revise el código fuente podría intentar adivinarlo. Para cambiarlo: generar `sha256(nuevoPIN)` y reemplazar la constante `PIN_HASH` en `admin.html`.
- **Fuentes de datos (3), todas de solo lectura excepto la nueva):**
  1. Lista maestra de invitados → la misma hoja de Google Sheets publicada como CSV que ya usa `index.html` (sin cambios).
  2. Confirmaciones RSVP → el mismo Apps Script "RSVP Boda" de siempre, al que se le agregó un `doGet` (ver `apps-script/rsvp-doGet-agregar.gs`) que expone las confirmaciones en JSON. No afecta el `doPost` que usa el formulario público.
  3. Datos nuevos que no existían antes (mesas, alergias, proveedores/pagos, itinerario, pendientes) → una hoja de cálculo **nueva** "Wedding Planner Data" + un Apps Script **nuevo e independiente** ("Planner Data API", ver `apps-script/planner-api.gs`), con pestañas `Vendors`, `Itinerary`, `Tasks`, `Overrides`, `Config`.
- **Pendiente de configurar por el usuario** (ver instrucciones dentro de cada archivo `.gs`):
  1. Agregar el `doGet` al Apps Script "RSVP Boda" existente y redesplegar (misma URL).
  2. Crear la hoja "Wedding Planner Data" con las pestañas/encabezados exactos indicados en `apps-script/planner-api.gs`, pegar ese código en un Apps Script nuevo vinculado a ella, desplegar como Web App, y pegar la URL resultante en `admin.html` reemplazando `PEGA_AQUI_LA_URL_DEL_NUEVO_WEB_APP_PLANNER_DATA_API`.
  3. Agregar `admin.html` al checklist de descarga antes de cada deploy (ver abajo).
- Mientras no se configure el paso 2, el panel funciona igual para Resumen/Invitados (con datos reales) y muestra avisos de "Configura PLANNER_API_URL" en Proveedores/Itinerario/Pendientes.

## Cámara desechable digital (camara.html)
Actividad para invitados inspirada en la app "Reveal": cada invitado toma hasta 15 fotos desde su celular (cámara en vivo en el navegador, sin apps) que quedan en secreto hasta que se revelan todas juntas, de todos los invitados, el 17 de enero de 2027 a mediodía.

- **Acceso:** un solo link/QR para todos (`camara.html`, enlazado desde una sección nueva en `index.html`, "Nuestra cámara desechable"). Al entrar, cada invitado escribe su nombre una vez (se guarda en `localStorage` de su propio celular junto con un ID de rollo aleatorio) y no se le vuelve a pedir.
- **Cámara:** `getUserMedia` en vivo, con contador de disparos, flash (torch si el dispositivo lo soporta, más destello visual siempre), y botón para cambiar cámara frontal/trasera. Las fotos se comprimen a JPEG (máx. 1280px) antes de subirse.
- **Almacenamiento:** Apps Script nuevo e independiente ("Photo Booth API", ver `apps-script/photo-booth-api.gs`) que guarda las fotos directo en una carpeta de Google Drive ("Fotos Boda Cindy y Victor"), sin usar ninguna hoja de cálculo. El límite de 15 fotos por invitado y la fecha de revelado se verifican del lado del servidor (no se pueden "espiar" las fotos antes de tiempo inspeccionando el código).
- **Pendiente de configurar por el usuario:** crear el Apps Script con `apps-script/photo-booth-api.gs`, desplegarlo como Web App, y pegar la URL resultante en `camara.html` reemplazando `PEGA_AQUI_LA_URL_DEL_WEB_APP_PHOTO_BOOTH_API`. Mientras no se configure, la cámara funciona en modo de prueba local (cuenta fotos solo en el navegador, sin guardarlas) y la galería muestra "no está configurada".
- Agregar `camara.html` al checklist de descarga antes de cada deploy (ver abajo).

## Pendientes
- **Despliegue automatizado:** ya implementado vía GitHub Action (ver sección "Hosting actual"). Solo falta que el usuario cree el secret `FIREBASE_SERVICE_ACCOUNT_CV26` una sola vez para que funcione.
- Mover invitaciones a Firestore (ver sección "Invitados / personalización").
- Integrar el RSVP real a Firestore.

## Flujo recomendado
1. Editar `index.html` en GitHub (o directamente en este repo con Claude).
2. Revisar en escritorio y móvil.
3. Publicar a Firebase Hosting (manual por ahora; ver Pendientes para automatizarlo).
4. Mantener GitHub como fuente maestra.

## Restricciones importantes
- No reintroducir emojis para sobre/regalo.
- No repetir información del salón en múltiples bloques.
- No agregar paleta de colores al dress code.
- No cambiar los rostros/fotografía aprobada.
- No cambiar el estilo general sin aprobación.

## Prompt de continuación sugerido para Claude
`Continúa este proyecto respetando CLAUDE_HANDOFF.md y el estado actual del repositorio. Antes de cambiar diseño o estructura, revisa index.html y esta sección "Diseño actual". Mantén GitHub como fuente maestra y Firebase Hosting como publicación. Prioriza compatibilidad móvil/iPhone. Los pendientes principales son automatizar el despliegue a Firebase y conectar Firestore al RSVP (ver "Pendientes").`

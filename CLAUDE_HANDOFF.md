# Cindy & Víctor — Handoff para Claude

## Objetivo
Continuar el desarrollo y publicación de la invitación digital de boda de **Cindy Yaneth Hernández Martínez** y **Víctor Mejía Chávez**.

## Repositorio
- GitHub: `victormejia-ship-it/Cindy-V-ctor`
- Rama principal: `main`

## Hosting actual
- Firebase project: `CV26`
- Project ID: `cv26-f99e2`
- URL pública: `https://cv26-f99e2.web.app`
- Firebase Hosting clásico, plan Spark.
- El despliegue actual se hace manualmente desde PowerShell con:
  1. descargar `index.html` desde GitHub hacia `Desktop/public/index.html`
  2. ejecutar `firebase deploy --only hosting`

## Arquitectura actual
- Frontend: HTML/CSS/JS estático.
- Hosting: Firebase Hosting.
- Código fuente: GitHub.
- Firestore está creado pero todavía no está integrado al RSVP real.
- La personalización por invitado sigue siendo demo en JS mediante query `?codigo=`.

## Archivos clave
- `index.html` — invitación principal.
- `CV2026.jpeg` — fotografía real de la pareja (usada como fondo del hero).
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

## Pendientes
- **Automatizar despliegue GitHub → Firebase Hosting.** Hoy el flujo es manual (PowerShell: descargar `index.html` desde GitHub a `Desktop/public/index.html` y ejecutar `firebase deploy --only hosting`), por lo que los cambios en `main` no se publican solos. Opción recomendada: GitHub Action con el plugin oficial `FirebaseExtended/action-hosting-deploy`, disparado en cada push a `main`, usando un service account de Firebase guardado como secret del repo (`FIREBASE_SERVICE_ACCOUNT_CV26` o similar). Requiere que el dueño del proyecto genere y suba esa credencial a GitHub Secrets — no se puede automatizar sin ese paso manual inicial.
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

// ==========================================
// SPRITES Y FONDOS - EXPEDICIÓN PATAGONIA
// ==========================================

let imgAgus;
let imgTomi;

let bgYacimientoInicial;
let bgYacimientoNieve;
let bgYacimientoSelva;
let bgYacimientoAgua;
let bgMuseo;

function preloadSprites() {
  imgAgus = loadImage(
    'multimedia/img-pixelArt/pj-agus.png',
    () => console.log('Sprite de Agus cargado'),
    () => console.warn(
      'No se pudo cargar multimedia/img-pixelArt/pj-agus.png'
    )
  );

  imgTomi = loadImage(
    'multimedia/img-pixelArt/pj-tomi.png',
    () => console.log('Sprite de Tomi cargado'),
    () => console.warn(
      'No se pudo cargar multimedia/img-pixelArt/pj-tomi.png'
    )
  );

  bgYacimientoInicial = loadImage(
    'multimedia/img-pixelArt/yacimiento-inicial.jpeg',
    () => console.log('Fondo inicial cargado'),
    () => console.warn('No se pudo cargar el fondo inicial')
  );

  bgYacimientoNieve = loadImage(
    'multimedia/img-pixelArt/yacimiento-nieve.jpeg',
    () => console.log('Fondo de nieve cargado'),
    () => console.warn('No se pudo cargar el fondo de nieve')
  );

  bgYacimientoSelva = loadImage(
    'multimedia/img-pixelArt/yacimiento-selva.jpeg',
    () => console.log('Fondo de selva cargado'),
    () => console.warn('No se pudo cargar el fondo de selva')
  );

  bgYacimientoAgua = loadImage(
    'multimedia/img-pixelArt/yacimiento-agua.jpeg',
    () => console.log('Fondo de agua cargado'),
    () => console.warn('No se pudo cargar el fondo de agua')
  );

  bgMuseo = loadImage(
    'multimedia/img-pixelArt/museo.png',
    () => console.log('Fondo del museo cargado'),
    () => console.warn(
      'No se pudo cargar multimedia/img-pixelArt/museo.png'
    )
  );
}

// ==========================================
// DIBUJAR PERSONAJES
// ==========================================

function drawAvatar(
  x,
  y,
  charType,
  scaleValue = 1
) {
  let avatarImage = null;

  if (charType === 'AGUS') {
    avatarImage = imgAgus;
  } else if (charType === 'TOMI') {
    avatarImage = imgTomi;
  }
const tamañoPersonaje = 3.5;

const w = 24 * scaleValue * tamañoPersonaje;
const h = 32 * scaleValue * tamañoPersonaje;

  if (avatarImage && avatarImage.width > 1) {
    imageMode(CENTER);
    image(avatarImage, x, y, w, h);
    imageMode(CORNER);
  } else {
    // Personaje de reemplazo si no cargó la imagen.
    noStroke();

    fill(
      charType === 'TOMI'
        ? '#6ab7e8'
        : '#e99ab8'
    );

    ellipse(
      x,
      y - 8 * scaleValue,
      18 * scaleValue,
      18 * scaleValue
    );

    fill('#f2c9a5');

    ellipse(
      x,
      y - 8 * scaleValue,
      11 * scaleValue,
      12 * scaleValue
    );

    fill('#3b2b22');
    rectMode(CENTER);

    rect(
      x,
      y + 5 * scaleValue,
      14 * scaleValue,
      17 * scaleValue,
      3
    );

    rectMode(CORNER);
  }
}

// ==========================================
// DIBUJAR MONTÍCULOS
// ==========================================

function drawMoundSprite(
  x,
  y,
  searched = false
) {
  noStroke();

  if (searched) {
    fill(70, 55, 40, 150);
    ellipse(x, y + 5, 22, 9);

    stroke(95, 80, 60);
    strokeWeight(2);

    line(
      x - 8,
      y + 2,
      x + 8,
      y + 7
    );

    noStroke();
    return;
  }

  fill(60, 38, 20, 75);
  ellipse(x + 2, y + 7, 25, 11);

  fill(118, 78, 45);
  ellipse(x, y + 2, 23, 15);

  fill(158, 112, 68);
  ellipse(x - 2, y - 1, 16, 11);

  fill(190, 148, 95, 180);
  ellipse(x - 4, y - 3, 7, 4);
}

// ==========================================
// FONDOS DE LOS YACIMIENTOS
// ==========================================

function drawYacimientoBackground(level) {
  let bg = bgYacimientoInicial;

  if (level === 2) {
    bg = bgYacimientoNieve;
  } else if (level === 3) {
    bg = bgYacimientoSelva;
  } else if (level === 4) {
    bg = bgYacimientoAgua;
  }

  if (bg && bg.width > 1) {
    imageMode(CORNER);
    image(bg, 0, 0, width, height);
  } else {
    if (level === 2) {
      background(180, 205, 215);
    } else if (level === 3) {
      background(65, 105, 58);
    } else if (level === 4) {
      background(60, 125, 155);
    } else {
      background(170, 120, 75);
    }
  }

  // Cuadrícula tenue para orientar el movimiento.
  const startX = 164;
  const startY = 104;
  const cellW = 30;
  const cellH = 39;

  stroke(255, 255, 255, 35);
  strokeWeight(1);

  for (let c = 0; c <= 8; c++) {
    line(
      startX + c * cellW,
      startY,
      startX + c * cellW,
      startY + 6 * cellH
    );
  }

  for (let r = 0; r <= 6; r++) {
    line(
      startX,
      startY + r * cellH,
      startX + 8 * cellW,
      startY + r * cellH
    );
  }

  noStroke();
}

// ==========================================
// FONDO DEL MUSEO
// ==========================================

function drawMuseoBackground() {
  if (bgMuseo && bgMuseo.width > 1) {
    imageMode(CORNER);
    image(bgMuseo, 0, 0, width, height);
  } else {
    background(65, 58, 50);

    noStroke();

    fill(92, 80, 65);
    rect(0, 0, width, height);

    fill(115, 101, 83);
    rect(0, 55, width, 265);

    fill(75, 65, 54);
    rect(0, 320, width, 60);
  }
}

// ==========================================
// FONDO DEL MENÚ
// ==========================================

function drawMenuBackground() {
  background(32, 25, 20);
  noStroke();

  for (let y = 0; y < height; y += 20) {
    fill(
      38 + (y % 40),
      29 + (y % 25),
      20 + (y % 15)
    );

    rect(0, y, width, 20);
  }

  fill(75, 48, 28, 130);

  ellipse(
    width / 2,
    height + 35,
    width * 1.1,
    170
  );
}

 // --- CEREBRO DEL JUEGO: FLUJO COMPLETO CORREGIDO ---

let gameState = 'MENU';
let selectedChar = null;

let gridCols = 8;
let gridRows = 6;
let playerGrid = { col: 3, row: 2 };

let mounds = [];
let bonesCollected = [];
let maxInventory = 12;
let dayTimer = 180;
let lastTimeCheck = 0;
let currentLevel = 1;

let alertMessage = "";
let alertTimer = 0;
let justPressed = false;
let mouseWasPressed = false;

let difficultyNames = ['Fácil', 'Medio', 'Difícil', 'Experto'];

let museumStands = {
  'T-Rex': { required: 5, collected: 0, x: 130, y: 170 },
  'Titanosaurio': { required: 5, collected: 0, x: 280, y: 170 },
  'Espinosaurio': { required: 5, collected: 0, x: 430, y: 170 }
};

function preload() {
  if (typeof preloadSprites === 'function') {
    preloadSprites();
  }
}

function setup() {
  let canvas = createCanvas(560, 380);
  canvas.parent('game-container');
  frameRate(60);
}

function draw() {
  // Detecta solo el inicio del clic.
  justPressed = mouseIsPressed && !mouseWasPressed;
  mouseWasPressed = mouseIsPressed;

  if (alertTimer > 0) {
    alertTimer--;
  } else {
    alertMessage = "";
  }

  // El reloj se actualiza tanto en el museo como en el yacimiento.
  actualizarRelojPartida();

  if (gameState === 'MENU') {
    drawMainMenuView();
  } else if (gameState === 'INSTRUCTIONS') {
    drawInstructionsView();
  } else if (gameState === 'SELECT_CHAR') {
    drawSelectCharScreen();
  } else if (gameState === 'YACIMIENTO') {
    drawYacimientoLoop();
  } else if (gameState === 'MUSEO') {
    drawMuseoScreen();
  } else if (gameState === 'LEVEL_COMPLETE') {
    drawLevelCompleteScreen();
  }
}

// ==========================================
// 0. MENÚ PRINCIPAL
// ==========================================

function drawMainMenuView() {
  if (typeof drawMenuBackground === 'function') {
    drawMenuBackground();
  }

  textAlign(CENTER, CENTER);

  fill(255, 204, 102);
  textSize(22);
  textStyle(BOLD);
  text("¡Bienvenido, Paleontólogo!", width / 2, 60);

  fill(200, 150, 100);
  textSize(11);
  text(
    "HACKATON UNAHUR - EXPEDICIÓN PATAGONIA",
    width / 2,
    90
  );

  let btnW = 260;
  let btnH = 38;
  let btnX = width / 2 - btnW / 2;

  drawInteractiveButton(
    btnX, 130, btnW, btnH, "▶ JUGAR",
    () => {
      gameState = 'INSTRUCTIONS';
    }
  );

  drawInteractiveButton(
    btnX, 180, btnW, btnH, "📖 CÓMO SE JUEGA",
    () => {
      gameState = 'INSTRUCTIONS';
    }
  );

  fill(160);
  textSize(10);
  text(
    "Seleccioná una opción para comenzar tu aventura",
    width / 2,
    330
  );
}

// ==========================================
// 0.1. INSTRUCCIONES
// ==========================================

function drawInstructionsView() {
  if (typeof drawMenuBackground === 'function') {
    drawMenuBackground();
  }

  textAlign(CENTER, CENTER);

  fill(255, 204, 102);
  textSize(18);
  textStyle(BOLD);
  text("MANUAL DE SUPERVIVENCIA", width / 2, 35);

  fill(230);
  textSize(11);
  textStyle(NORMAL);

  text(
    "1. Movete por la cuadrícula con las Flechas o WASD.\n" +
    "2. Parate sobre un montículo y presioná [E] o [ESPACIO] para excavar.\n" +
    "3. Recolectá fósiles antes de que se acabe el tiempo del día.\n" +
    "4. Llevá los huesos al Museo ([M]) para armar los esqueletos.",
    width / 2,
    120
  );

  let btnW = 220;
  let btnH = 36;

  drawInteractiveButton(
    width / 2 - btnW / 2,
    235,
    btnW,
    btnH,
    "SIGUIENTE ▶",
    () => {
      gameState = 'SELECT_CHAR';
    }
  );

  drawInteractiveButton(
    width / 2 - btnW / 2,
    285,
    btnW,
    btnH,
    "◀ VOLVER AL MENÚ",
    () => {
      gameState = 'MENU';
    }
  );
}

// ==========================================
// 1. SELECCIÓN DE PERSONAJE Y DIFICULTAD
// ==========================================

function drawSelectCharScreen() {
  background(40, 28, 20);
  textAlign(CENTER, CENTER);

  fill(255, 204, 102);
  textSize(16);
  textStyle(BOLD);
  text("ELIGE TU ARQUEÓLOGX", width / 2, 35);

  drawCharSelectButton(
    width / 2 - 135,
    58,
    120,
    145,
    "AGUS",
    'AGUS',
    () => {
      selectedChar = 'AGUS';
    }
  );

  drawCharSelectButton(
    width / 2 + 15,
    58,
    120,
    145,
    "TOMI",
    'TOMI',
    () => {
      selectedChar = 'TOMI';
    }
  );

  fill(230);
  textSize(11);
  textStyle(NORMAL);
  text('DIFICULTAD', width / 2, 220);

  for (let i = 0; i < 4; i++) {
    let bw = 112;
    let bh = 30;
    let gap = 8;
    let total = 4 * bw + 3 * gap;

    let bx = (width - total) / 2 + i * (bw + gap);
    let by = 238;

    let hover =
      mouseX >= bx &&
      mouseX <= bx + bw &&
      mouseY >= by &&
      mouseY <= by + bh;

    if (currentLevel === i + 1) {
      fill(190, 130, 55);
    } else if (hover) {
      fill(95, 70, 45);
    } else {
      fill(55, 42, 32);
    }

    stroke(currentLevel === i + 1 ? '#00ffcc' : '#d4a373');
    strokeWeight(1);
    rect(bx, by, bw, bh, 5);

    noStroke();
    fill(255);
    textSize(10);
    text(
      difficultyNames[i],
      bx + bw / 2,
      by + bh / 2
    );

    if (justPressed && hover) {
      currentLevel = i + 1;
    }
  }

  fill(220);
  textSize(10);

  text(
    `Personaje: ${selectedChar || 'elegí Agus o Tomi'} | Nivel: ${difficultyNames[currentLevel - 1]}`,
    width / 2,
    283
  );

  drawInteractiveButton(
    width / 2 - 105,
    300,
    210,
    32,
    "▶ COMENZAR EXPEDICIÓN",
    () => {
      if (selectedChar) {
        // Comenzar una expedición nueva sí reinicia el progreso.
        initYacimiento(true);
      } else {
        alertMessage = 'Primero elegí un personaje';
        alertTimer = 120;
      }
    }
  );

  drawInteractiveButton(
    width / 2 - 100,
    340,
    200,
    28,
    "◀ VOLVER",
    () => {
      gameState = 'INSTRUCTIONS';
    }
  );
}

function drawCharSelectButton(
  x, y, w, h, name, charType, onClick
) {
  let isHover =
    mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h;

  fill(
    isHover ? 70 : 50,
    isHover ? 50 : 38,
    isHover ? 40 : 28
  );

  stroke(isHover ? '#ffcc66' : '#d4a373');
  strokeWeight(2);
  rect(x, y, w, h, 8);

  drawAvatar(x + w / 2, y + 55, charType, 1.2);

  fill(255);
  textSize(14);
  textStyle(BOLD);
  text(name, x + w / 2, y + 130);

  if (isHover && justPressed) {
    onClick();
  }
}

// ==========================================
// 2. INICIAR YACIMIENTO
// ==========================================

// Duración del día según la dificultad.
function getDayDuration() {
  if (currentLevel === 1) return 180;
  if (currentLevel === 2) return 120;
  return 60;
}

// Genera nuevos montículos para explorar.
// No borra la mochila ni el progreso del museo.
function resetMounds() {
  mounds = [];

  let dinoTypes = [
    'T-Rex',
    'Titanosaurio',
    'Espinosaurio',
    'Dorado'
  ];

  while (mounds.length < maxInventory) {
    let randCol = int(random(0, gridCols));
    let randRow = int(random(0, gridRows));

    let exists = mounds.some(
      m => m.col === randCol && m.row === randRow
    );

    if (!exists) {
      mounds.push({
        col: randCol,
        row: randRow,
        searched: false,
        type: random(dinoTypes)
      });
    }
  }
}

// nuevaExpedicion=true:
// comienza una expedición o reinicia el nivel.
//
// nuevaExpedicion=false:
// vuelve desde el museo conservando el progreso.
function initYacimiento(nuevaExpedicion = false) {
  gameState = 'YACIMIENTO';
  playerGrid = { col: 3, row: 2 };

  if (nuevaExpedicion) {
    // Solo una expedición nueva reinicia los esqueletos.
    for (let name in museumStands) {
      museumStands[name].collected = 0;
    }

    // Al comenzar un nivel nuevo, la mochila queda vacía.
    bonesCollected = [];

    // Capacidad de la mochila según la dificultad.
    maxInventory = currentLevel === 1 ? 10 : 6;

    // El día empieza con su duración correspondiente.
    dayTimer = getDayDuration();
  } else if (dayTimer <= 0) {
    // Si el día terminó, comienza uno nuevo al salir del museo.
    dayTimer = getDayDuration();
  }

  lastTimeCheck = millis();

  alertMessage = '';
  alertTimer = 0;

  // Se renueva el escenario de excavación.
  // El progreso del museo y la mochila se mantienen.
  resetMounds();
}

// ==========================================
// 3. BUCLE DEL YACIMIENTO
// ==========================================

function drawYacimientoLoop() {
  if (typeof drawYacimientoBackground === 'function') {
    drawYacimientoBackground(currentLevel);
  } else {
    background(180, 120, 70);
  }

  let startX = 164;
  let startY = 104;
  let cellW = 30;
  let cellH = 39;

  for (let m of mounds) {
    let px = startX + m.col * cellW + cellW / 2;
    let py = startY + m.row * cellH + cellH / 2;

    if (typeof drawMoundSprite === 'function') {
      drawMoundSprite(px, py, m.searched);
    }

    if (
      playerGrid.col === m.col &&
      playerGrid.row === m.row &&
      !m.searched
    ) {
      fill(255, 255, 0);
      textSize(9);
      textAlign(CENTER);
      text("[E] Excavar", px, py - 20);
    }
  }

  let playerScreenX =
    startX + playerGrid.col * cellW + cellW / 2;

  let playerScreenY =
    startY + playerGrid.row * cellH + cellH / 2;

  drawAvatar(
    playerScreenX,
    playerScreenY - 8,
    selectedChar,
    0.75
  );

  // HUD superior.
  fill(20, 15, 10, 230);
  noStroke();
  rect(0, 0, width, 32);

  fill(255, 204, 102);
  textSize(11);
  textAlign(LEFT, CENTER);

  text(`☀️ ${dayTimer}s`, 10, 16);
  text(`🎒 ${bonesCollected.length}/${maxInventory}`, 85, 16);
  text(`[M] Museo`, 160, 16);
  text(`Nivel ${currentLevel}`, 250, 16);

  if (alertMessage !== "") {
    fill(0, 0, 0, 200);
    rect(width / 2 - 180, 50, 360, 35, 6);

    fill(0, 255, 200);
    textSize(11);
    textAlign(CENTER, CENTER);
    text(alertMessage, width / 2, 67);
  }
}

// ==========================================
// 3.1. CONTROLES DEL TECLADO
// ==========================================

function keyPressed() {
  // Permite activar el audio con la primera interacción.
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }

  // Ir al museo no reinicia el yacimiento ni la mochila.
  if (
    gameState === 'YACIMIENTO' &&
    (key === 'm' || key === 'M')
  ) {
    initMuseo();
    return false;
  }

  if (gameState === 'YACIMIENTO') {
    if (
      (keyCode === LEFT_ARROW || keyCode === 65) &&
      playerGrid.col > 0
    ) {
      playerGrid.col--;
    }

    if (
      (keyCode === RIGHT_ARROW || keyCode === 68) &&
      playerGrid.col < gridCols - 1
    ) {
      playerGrid.col++;
    }

    if (
      (keyCode === UP_ARROW || keyCode === 87) &&
      playerGrid.row > 0
    ) {
      playerGrid.row--;
    }

    if (
      (keyCode === DOWN_ARROW || keyCode === 83) &&
      playerGrid.row < gridRows - 1
    ) {
      playerGrid.row++;
    }

    // E o espacio: excavar y recoger un huesito.
    if (keyCode === 69 || keyCode === 32) {
      let mound = mounds.find(
        m =>
          m.col === playerGrid.col &&
          m.row === playerGrid.row
      );

      if (
        mound &&
        !mound.searched &&
        bonesCollected.length < maxInventory
      ) {
        mound.searched = true;
        bonesCollected.push(mound.type);

        // SONIDO 1: levantar un huesito.
        playPickupSound();
      }
    }
  } else if (gameState === 'MUSEO') {
    if (keyCode === LEFT_ARROW || keyCode === 65) {
      playerGrid.col = max(0, playerGrid.col - 1);
    }

    if (keyCode === RIGHT_ARROW || keyCode === 68) {
      playerGrid.col = min(
        gridCols - 1,
        playerGrid.col + 1
      );
    }

    if (keyCode === UP_ARROW || keyCode === 87) {
      playerGrid.row = max(0, playerGrid.row - 1);
    }

    if (keyCode === DOWN_ARROW || keyCode === 83) {
      playerGrid.row = min(
        gridRows - 1,
        playerGrid.row + 1
      );
    }

    // E o espacio: entregar un hueso al museo.
    if (keyCode === 69 || keyCode === 32) {
      depositarHuesoCercano();
    }
  }
}

// ==========================================
// 4. ESCENARIO DEL MUSEO Y RELOJ
// ==========================================

// El tiempo corre en ambos escenarios.
// Cambiar de pantalla no reinicia el contador.
function actualizarRelojPartida() {
  if (gameState !== 'YACIMIENTO' && gameState !== 'MUSEO') {
    lastTimeCheck = millis();
    return;
  }

  const ahora = millis();
  const segundosTranscurridos = Math.floor(
    (ahora - lastTimeCheck) / 1000
  );

  if (segundosTranscurridos > 0) {
    dayTimer = max(0, dayTimer - segundosTranscurridos);
    lastTimeCheck += segundosTranscurridos * 1000;

    if (dayTimer <= 0 && gameState === 'YACIMIENTO') {
      dayTimer = 0;
      initMuseo();

      alertMessage = 'Terminó el día. Volvé a excavar para comenzar otro.';
      alertTimer = 180;
    }
  }
}

function initMuseo() {
  // Solo cambia de escenario: no borra huesos ni esqueletos.
  gameState = 'MUSEO';
  playerGrid = { col: 1, row: 4 };
}

function drawMuseoScreen() {
  if (typeof drawMuseoBackground === 'function') {
    drawMuseoBackground();
  } else {
    background(45, 38, 32);
  }

  textAlign(CENTER, CENTER);

  fill(20, 15, 10, 220);
  noStroke();
  rect(0, 0, width, 45);

  fill(255, 204, 102);
  textSize(13);
  textStyle(BOLD);
  text(
    "🏛️ SALA DE EXHIBICIÓN - MUSEO",
    width / 2,
    14
  );

  textSize(10);
  fill(220);
  text(
    `Mochila: [ ${bonesCollected.join(', ') || 'Vacía'} ] (Acercate a un stand y apretá E para donar)`,
    width / 2,
    32
  );

  let standWidth = 130;
  let standHeight = 85;

  for (let dinoName in museumStands) {
    let stand = museumStands[dinoName];

    let isComplete =
      stand.collected >= stand.required;

    stroke(isComplete ? '#00ffcc' : '#d4a373');
    strokeWeight(2);

    fill(30, 24, 20, 235);

    rect(
      stand.x - standWidth / 2,
      stand.y - standHeight / 2,
      standWidth,
      standHeight,
      6
    );

    noStroke();

    fill(255, 204, 102);
    textSize(11);
    textStyle(BOLD);
    text(dinoName, stand.x, stand.y - 22);

    fill(isComplete ? '#00ffcc' : '#ffffff');
    textSize(10);
    textStyle(NORMAL);

    text(
      `Piezas: ${stand.collected} / ${stand.required}`,
      stand.x,
      stand.y + 2
    );

    if (isComplete) {
      fill(0, 255, 200);
      text("✨ ¡ARMADO!", stand.x, stand.y + 22);
    }
  }

  if (alertMessage !== "") {
    fill(0, 0, 0, 220);
    rect(width / 2 - 200, 55, 400, 35, 6);

    fill(0, 255, 200);
    textSize(11);
    textStyle(BOLD);
    text(alertMessage, width / 2, 72);
  }

  fill(255);
  textSize(9);
  textAlign(CENTER, CENTER);

  text(
    "Movete con flechas/WASD. Acercate al stand y presioná E para entregar.",
    width / 2,
    315
  );

  let pScreenX = 80 + playerGrid.col * 55;
  let pScreenY = 100 + playerGrid.row * 25;

  if (selectedChar) {
    drawAvatar(
      pScreenX,
      pScreenY,
      selectedChar,
      0.85
    );
  }

  drawInteractiveButton(
    width / 2 - 210,
    335,
    190,
    30,
    "⛏️ VOLVER A EXCAVAR",
    () => {
      // Conserva el museo y la mochila, pero genera montículos nuevos.
      initYacimiento(false);
    }
  );

  let allComplete = Object.values(museumStands).every(
    stand => stand.collected >= stand.required
  );

  drawInteractiveButton(
    width / 2 + 15,
    335,
    190,
    30,
    allComplete
      ? "🏆 COMPLETAR NIVEL"
      : "🔒 COMPLETÁ LOS STANDS",
    () => {
      if (allComplete) {
        gameState = 'LEVEL_COMPLETE';
      } else {
        alertMessage =
          'Completá los tres esqueletos para avanzar';
        alertTimer = 120;
      }
    }
  );
}

// ==========================================
// 5. PANTALLA DE NIVEL COMPLETADO
// ==========================================

function drawLevelCompleteScreen() {
  background(30, 22, 16);
  textAlign(CENTER, CENTER);

  fill(255, 204, 102);
  textSize(20);
  textStyle(BOLD);
  text("¡EXPEDICIÓN EXITOSA!", width / 2, 70);

  fill(220);
  textSize(12);

  text(
    "¡Completaste los tres esqueletos! ¿Querés subir la dificultad o reintentar?",
    width / 2,
    120
  );

  let btnW = 280;
  let btnH = 38;
  let btnX = width / 2 - btnW / 2;

  drawInteractiveButton(
    btnX,
    160,
    btnW,
    btnH,
    "🚀 SUBIR DIFICULTAD",
    () => {
      if (currentLevel < 4) {
        currentLevel++;
        initYacimiento(true);
      } else {
        alertMessage = '¡Llegaste a la dificultad máxima!';
        alertTimer = 150;
        gameState = 'MENU';
      }
    }
  );

  drawInteractiveButton(
    btnX,
    215,
    btnW,
    btnH,
    "🔄 REINTENTAR NIVEL ACTUAL",
    () => {
      initYacimiento(true);
    }
  );

  drawInteractiveButton(
    btnX,
    270,
    btnW,
    btnH,
    "🏠 MENÚ PRINCIPAL",
    () => {
      gameState = 'MENU';
    }
  );
}

// ==========================================
// 6. DEPOSITAR HUESOS EN EL MUSEO
// ==========================================

function depositarHuesoCercano() {
  if (bonesCollected.length === 0) {
    alertMessage = 'Tu mochila está vacía';
    alertTimer = 90;
    return;
  }

  // Posición del personaje en pantalla.
  let px = 80 + playerGrid.col * 55;
  let py = 100 + playerGrid.row * 25;

  let nearestName = null;
  let nearestDistance = Infinity;

  for (let dinoName in museumStands) {
    const stand = museumStands[dinoName];

    const distance = dist(
      px,
      py,
      stand.x,
      stand.y
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestName = dinoName;
    }
  }

  if (nearestDistance > 85) {
    alertMessage = 'Acercate a un stand para entregar un hueso';
    alertTimer = 90;
    return;
  }

  const stand = museumStands[nearestName];

  if (stand.collected >= stand.required) {
    alertMessage = 'Ese esqueleto ya está completo';
    alertTimer = 90;
    return;
  }

  const boneIndex = bonesCollected.findIndex(
    b => b === nearestName || b === 'Dorado'
  );

  if (boneIndex === -1) {
    alertMessage =
      `Necesitás un hueso de ${nearestName} (o uno dorado)`;

    alertTimer = 120;
    return;
  }

  bonesCollected.splice(boneIndex, 1);
  stand.collected++;

  // SONIDO 2: depositar un huesito.
  playDepositSound();

  if (stand.collected >= stand.required) {
    // SONIDO 3: completar un esqueleto.
    playCompleteSound();

    alertMessage =
      `¡Completaste el esqueleto de ${nearestName}!`;
  } else {
    alertMessage = `Hueso entregado a ${nearestName}`;
  }

  alertTimer = 120;
}

// ==========================================
// 7. BOTONES INTERACTIVOS
// ==========================================

function drawInteractiveButton(
  x, y, w, h, label, onClick
) {
  let isHover =
    mouseX > x &&
    mouseX < x + w &&
    mouseY > y &&
    mouseY < y + h;

  fill(
    isHover
      ? color(200, 150, 80)
      : color(80, 60, 40)
  );

  stroke(255, 204, 102);
  strokeWeight(2);
  rect(x, y, w, h, 6);

  fill(isHover ? 20 : 255);
  noStroke();
  textSize(11);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);

  text(
    label,
    x + w / 2,
    y + h / 2
  );

  if (isHover && justPressed) {
    onClick();
  }
}

// ==========================================
// 8. SONIDOS CON p5.sound
// No necesitás archivos MP3 ni WAV.
// ==========================================

function playGameTone(
  frequency,
  endFrequency,
  duration,
  volume,
  waveType = 'sine'
) {
  if (
    typeof p5 === 'undefined' ||
    typeof p5.Oscillator === 'undefined'
  ) {
    return;
  }

  const osc = new p5.Oscillator(waveType);

  osc.freq(frequency);
  osc.amp(0);
  osc.start();

  osc.amp(volume, 0.015);
  osc.freq(endFrequency, duration);
  osc.amp(0, duration);

  setTimeout(() => {
    osc.stop();

    if (typeof osc.dispose === 'function') {
      osc.dispose();
    }
  }, duration * 1000 + 120);
}

function playPickupSound() {
  // Sonido agudo al encontrar un huesito.
  playGameTone(
    650,
    1050,
    0.13,
    0.18,
    'triangle'
  );
}

function playDepositSound() {
  // Sonido suave al depositar una pieza.
  playGameTone(
    420,
    300,
    0.16,
    0.16,
    'sine'
  );
}

function playCompleteSound() {
  // Dos notas ascendentes al completar un esqueleto.
  playGameTone(
    660,
    880,
    0.18,
    0.18,
    'triangle'
  );

  setTimeout(() => {
    playGameTone(
      880,
      1320,
      0.25,
      0.18,
      'triangle'
    );
  }, 160);
}

// Activa el audio con el primer clic del usuario.
function mousePressed() {
  if (typeof userStartAudio === 'function') {
    userStartAudio();
  }
}
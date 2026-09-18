// --- CONFIGURACIÓN GLOBAL DEL JUEGO ---
let tanque;
let laseres = [];          // Disparos del jugador
let enemigos = [];         // Lista de marcianitos
let laseresEnemigos = [];  // Disparos de los enemigos
let ufo;
let puntaje = 0;
let vidas = 3;             // El jugador empieza con 3 vidas
let juegoTerminado = false;

// Variables de recursos (Música y fuentes)
let music;
let font;

let sonidoActivado = true; // Empieza activado por defecto

// Estados posibles del juego
const ESTADO_INICIO = 0;
const ESTADO_JUGANDO = 1;

let estadoActual = ESTADO_INICIO;
let logoSpaceInvaders; 

function preload() {
  music = {
    title: loadSound("Resources/sound/Title.mp3"), 
    song: loadSound("Resources/sound/Game.mp3"),
    tanque_gun: loadSound("Resources/sound/Gun_Tanque.mp3"),
    enemigo_exp: loadSound("Resources/sound/explote_ene.mp3") 
  };
  
  font = {
    Pixel: loadFont("Resources/fonts/space.ttf")
  };
}

function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  textAlign(CENTER, CENTER);

  // Intentar iniciar la música de título al cargar si la política de autoplay lo permite
  if (sonidoActivado && music.title) {
    music.title.loop();
  }
}

function draw() {
  background(0);
  
  if (estadoActual === ESTADO_INICIO) {
    PantallaInicio();
  } else if (estadoActual === ESTADO_JUGANDO) {
    PantallaJuego();
  }
}

// Auxiliar para iniciar/reiniciar la partida
function iniciarJuego() {
  estadoActual = ESTADO_JUGANDO; 
  
  // Transición de música: Detener Título -> Iniciar Juego
  if (music) {
    if (music.title && music.title.isPlaying()) {
      music.title.stop();
    }
    
    if (sonidoActivado && music.song && !music.song.isPlaying()) {
      music.song.loop();
    }
  }

  reiniciarJuego();   
}

// Detectar el Click del mouse
function mousePressed() {
  if (estadoActual === ESTADO_INICIO) {
    // IMPORTANTE: Ajustado a height * 0.70 para coincidir con la posición visual del botón en PantallaInicio
    let btnX = width / 2;
    let btnY = height * 0.70; 
    
    // Si hace click en la zona del botón de sonido
    if (dist(mouseX, mouseY, btnX, btnY) < 40) {
      sonidoActivado = !sonidoActivado; // Alternar estado global de sonido

      if (music && music.title) {
        if (sonidoActivado) {
          music.title.loop();
        } else {
          music.title.stop();
        }
      }
      return; // Detiene la ejecución para no iniciar el juego al hacer clic en el botón
    }
    
    // Si hace click fuera del botón, arranca el juego
    iniciarJuego();
  }
}

// Detectar teclas
function keyPressed() {
  if (estadoActual === ESTADO_INICIO) {
    if (key === ' ') { 
      iniciarJuego();
    }
  } else if (estadoActual === ESTADO_JUGANDO) {
    // Disparar láser con Barra Espaciadora si no hay un disparo en pantalla y el juego sigue activo
    if (key === ' ' && laseres.length < 1 && !juegoTerminado) {
      laseres.push(new Laser(tanque.x, tanque.y));
      
      if (sonidoActivado && music && music.tanque_gun) {
        music.tanque_gun.play(); 
      }
    }
    
    // Reiniciar juego con 'R'
    if (key === 'r' || key === 'R') {
      // Detener música de fondo previa al reiniciar para evitar superposiciones
      if (music && music.song) {
        music.song.stop();
      }
      iniciarJuego();
    }
  }
}

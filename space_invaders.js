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

let sonidoActivado = false; // Controla si la música ya empezó a sonar

// 1. Definimos los estados posibles del juego (Sintaxis JavaScript)
const ESTADO_INICIO = 0;
const ESTADO_JUGANDO = 1;

// Guardamos el estado actual
let estadoActual = ESTADO_INICIO;

// Declarar variable de la imagen
let logoSpaceInvaders; 


function preload() {
  music = {
    song: loadSound("Resources/sound/Title.mp3"),
    tanque_gun: loadSound("Resources/sound/Gun_Tanque.mp3"),
    enemigo_exp: loadSound("Resources/sound/explote_ene.mp3")    
  };
  
  font = {
    Pixel: loadFont("Resources/fonts/space.ttf")
    //Pixel: loadFont("Resources/fonts/Early_GameBoy.ttf")    
  };
}


function setup() {
  const canvas = createCanvas(800, 600);
  canvas.parent('canvas-container');
  
   textAlign(CENTER, CENTER);
  
  // logoSpaceInvaders = loadImage("space_invaders.png");
}

function draw() {
  background(0); // Fondo negro siempre por defecto
  
  // 2. Evaluamos qué pantalla mostrar según el estado actual
  if (estadoActual === ESTADO_INICIO) {
    PantallaInicio();
  } 
  else if (estadoActual === ESTADO_JUGANDO) {
    PantallaJuego();
  }
}

// --- FUNCIONES DE DIBUJO ---
// Función auxiliar para inicializar valores cuando empiece la partida
function iniciarJuego() {
  // Asegura que el juego cambie de pantalla
  estadoActual = ESTADO_JUGANDO; 
  reiniciarJuego()   
}




// Detectar el Click del mouse
function mousePressed() {
  if (estadoActual === ESTADO_INICIO) {
    // Coordenadas aproximadas de la zona del botón de sonido
    let btnX = width / 2;
    let btnY = height * 0.60;
    
    // Si hace click cerca del altavoz (un radio de 40 píxeles)
    if (dist(mouseX, mouseY, btnX, btnY) < 40) {
      if (music && music.song) {
        if (!music.song.isPlaying()) {
          music.song.loop();
          sonidoActivado = true;
        } else {
          music.song.stop();
          sonidoActivado = false;
        }
      }
      return; // El 'return' evita que el juego empiece, solo interactúa con el sonido
    }
    
    // Si hace click en cualquier otro lado de la pantalla de inicio, arranca el juego
    iniciarJuego();
  }
}


// Detectar la Barra Espaciadora
function keyPressed() {
  // --- CONTROLES EN LA PANTALLA DE BIENVENIDA ---
  if (estadoActual === ESTADO_INICIO) {
    if (key === ' ') { 
      // Activa música si estaba apagada
      if (music && music.song && !music.song.isPlaying()) {
        music.song.loop();
        sonidoActivado = true;
      }
      iniciarJuego();
    }
  } 
  // --- CONTROLES EN PLENA PARTIDA ---
  else if (estadoActual === ESTADO_JUGANDO) {
    // Disparar láser con Barra Espaciadora si el juego no ha terminado
    if (key === ' ' && laseres.length < 1 && !juegoTerminado) {
      laseres.push(new Laser(tanque.x, tanque.y));
      
      // musica de disparo
      if (music && music.tanque_gun) {
        music.tanque_gun.play(); 
      }
    }
    
    // Reiniciar juego con la tecla 'R'
    if (key === 'r' || key === 'R') {
      iniciarJuego();
    }
  }
}

function impactaEscudos(x, w, yIni, yFin) {
  let paso = yFin >= yIni ? 2 : -2;
  for (let y = yIni; paso > 0 ? y <= yFin : y >= yFin; y += paso) {
    for (let dx of [-w / 2 + 1, 0, w / 2 - 1]) {
      for (let e of escudos) {
        if (e.impacto(x + dx, y, 1)) return true;
      }
    }
  }
  return false;
}

function balasSeCruzan(p, e) {
  return Math.abs(p.x - e.x) < (p.w + e.w) / 2 && p.y - p.h < e.y + e.h && p.y > e.y;                              
}

// --- FUNCION PANTALLA DE INICIO ---
function PantallaInicio() {
  fill(200);
  textFont(font.Pixel);  
  
  // 1. Mensaje de acción
  textSize(16);
  text("HI-SCORE", width / 2, height * 0.07);
  text(nf(hiScore, 4), width / 2, height * 0.11);
 
  text("PLAY", width / 2, height * 0.22);
  text("SPACE      INVADERS", width / 2, height * 0.30);
    
  // 2. Título principal
 
  text("*SCORE   ADVANCE   TABLE*", width / 2,  height * 0.38);
  push();
  textAlign(LEFT, CENTER);
  let textoX = width / 2 - 60;
  text("= ? MYSTERY", textoX, height * 0.43);
  text("= 30 POINTS", textoX, height * 0.48);
  text("= 20 POINTS", textoX, height * 0.53);
  text("= 10 POINTS", textoX, height * 0.58);
  pop();
  menuUfo.mostrar();
  menuCalamar.mostrar();
  menuCangrejo.mostrar();
  menuPulpo.mostrar();
  
  // 3. BOTÓN DE SONIDO RETRO (Dibujado con figuras)
  // Definimos la posición central del botón
  let btnX = width / 2;
  let btnY = height * 0.70;
  
  if (sonidoActivado) {
    // Icono Altavoz Encendido (Verde)
    fill(0, 255, 0);
    rect(btnX - 15, btnY - 10, 15, 20); // Cuerpo altavoz
    triangle(btnX, btnY - 20, btnX, btnY + 20, btnX - 15, btnY - 10); // Cono
    // Ondas de sonido
    noFill();
    stroke(0, 255, 0);
    strokeWeight(3);
    arc(btnX + 10, btnY, 20, 20, -HALF_PI, HALF_PI);
    arc(btnX + 20, btnY, 40, 40, -HALF_PI, HALF_PI);
    noStroke(); 
  } else {
    // Icono Altavoz Muteado (Rojo con una X)
    fill(255, 0, 0);
    rect(btnX - 15, btnY - 10, 15, 20); 
    triangle(btnX, btnY - 20, btnX, btnY + 20, btnX - 15, btnY - 10);
    // Dibujar la 'X' de mute
    stroke(255, 0, 0);
    strokeWeight(3);
    line(btnX + 10, btnY - 10, btnX + 22, btnY + 10);
    line(btnX + 22, btnY - 10, btnX + 10, btnY + 10);
    noStroke();
  }
  
  // 4. Controles e instrucciones abajo
  fill(255);
  textSize(16); 
  text("PRESS SPACE BAR TO START", width / 2, height * 0.78);
  text("PRESS R TO RESTART DURING GAME", width / 2, height * 0.85);
}

// --- FUNCIÓN REINICIAR JUEGO ---
function reiniciarJuego() {
  puntaje = 0;
  vidas = 3;
  laseres = [];
  enemigos = [];
  laseresEnemigos = [];
  juegoTerminado = false;
  ufo = null;
  
  // 1. Nos aseguramos de inicializar el tanque
  tanque = new Tanque();
  // 4 escudos fijos, repartidos en el ancho y encima del tanque
  escudos = [];
  for (let i = 0; i < 4; i++) {
    let ancho = 22 * 3; // cols * tamPixel
    let x = (width / 4) * (i + 0.5) - ancho / 2;
    escudos.push(new Escudo(x, 480));
  }
  // 2. Generación de marcianos
  // Creamos una cuadrícula de enemigos (ejemplo: 4 filas x 8 columnas)
  let filas = 5;
  let columnas = 11;
  
  for (let f = 0; f < filas; f++) {
    
    let tipoEnemigo = Math.floor(f / 2); 
    if (tipoEnemigo > 2) tipoEnemigo = 2; // Asegura no sobrepasar el tipo 2
    
    for (let c = 0; c < columnas; c++) {
      // Ajusta los números (c * 60 + 80, f * 50 + 80) según el tamaño 
      // y los parámetros que pida el constructor de tu clase Enemigo
      let x = c * 40 + 80; //CAMBIO
      let y = f * 20 + 80; //CAMBIO
      
      enemigos.push(new Enemigo(x, y, tipoEnemigo));
    }
  }
}


// --- FUNCION PANTALLA FIN DE JUEGO ---
function PantallaFinJuego() {
  textAlign(CENTER, CENTER); // CAMBIO: Mantenemos el centrado vertical también
 
  if (enemigos.length === 0) {
    fill(0, 255, 0);
    textSize(40);
    text("VICTORY!", width / 2, height / 2 - 20);
  } else {
    fill(255, 0, 0);
    textSize(40);
    text("GAME OVER", width / 2, height / 2 - 20);
  }
 
  fill(255);
  textSize(20);
  text("FINAL SCORE: " + puntaje, width / 2, height / 2 + 20);
  text("HI-SCORE: " + hiScore, width / 2, height / 2 + 45);
  textSize(14);
  text("Press 'R' to try again", width / 2, height / 2 + 80);
  

}


// --- FUNCION  PANTALLA DE JUEGO ---

function PantallaJuego(){
  background(10, 10, 25); // Fondo espacial oscuro
   if (puntaje > hiScore) {
    hiScore = puntaje;
    storeItem('hiScoreSpaceInvaders', hiScore);
  }
  if (juegoTerminado) {
    PantallaFinJuego();
    return;
  }
  
  // --- INTERFAZ DE USUARIO (UI RETRO) ---
  fill(255);
  textAlign(LEFT, TOP);   
  textSize(20);
  textFont(font.Pixel); // CAMBIO: Usamos tu fuente pixel en lugar de Courier New
  text("SCORE: " + puntaje, 20, 30);
 
  // Mostrar vidas de color verde brillante si están bien, rojas si le queda 1
  if (vidas > 1) fill(0, 255, 0);
  else fill(255, 0, 0);
  textAlign(RIGHT, TOP);  
  text("LIVES: " + vidas, width - 150, 30);
  
  // --- CONTROL Y RENDER DEL TANQUE ---
 
  if (tanque.estado == "alerta") {
     //Si ya pasó 1.5 segundo (1000 milisegundos) desde el impacto, vuelve a verde
     if (Date.now() - tanque.tiempocolision >= 150) {
        tanque.estado ="normal";
      }
  }    
   
  tanque.mostrar();
  tanque.mover();
  for (let e of escudos) e.mostrar();
  
// --- GESTIÓN DE LÁSERES DEL JUGADOR (SUBEN)*********************************** ---

  let tiempoActual2 = Date.now();
  
  for (let i = laseres.length - 1; i >= 0; i--) {
    let laserplayer = laseres[i];
  
    if (laserplayer.estado === "explotando") {
      // Si ya pasó 1 segundo (1000 milisegundos) desde el impacto, lo borramos
      if (tiempoActual2 - laserplayer.tiempoExplosion >= 100) {
        laseres.splice(i, 1); // Quita el laser
        continue; // Saltamos al siguiente para no mover ni mostrar un enemigo que ya no existe
      }
    }    
    
    let yAntes = laserplayer.y;
    laserplayer.mostrar();
    laserplayer.mover();

    if (laserplayer.estado === "movimiento" && impactaEscudos(laserplayer.x, laserplayer.w, yAntes - laserplayer.h, laserplayer.y - laserplayer.h)) {
      laseres.splice(i, 1);
      continue;
    }
    // Detectar si tu láser golpea a un enemigo , se mira al reves el arreglo
    for (let j = enemigos.length - 1; j >= 0; j--) {
      let enemigo = enemigos[j];
      
      if (laserplayer.colisionaCon(enemigo) && enemigo.estado !== "explotando") {
        enemigo.estado = "explotando";
        
        //COLOCA EL PUNTAJE DE ACUERDO AL TIPO DE ALIEN        
        if (enemigo.tipo == 0) puntaje += 30; // Rosa Arcade
        else if (enemigo.tipo === 1) puntaje += 20; // Cían
        else if (enemigo.tipo === 2) puntaje += 10; // Amarillo
        
        enemigo.tipo = 3;
        enemigo.tiempoExplosion = Date.now();        
        //enemigos.splice(j, 1); //elimina un enemigo justo en la posicion j
        laseres.splice(i, 1);  //elimina un laser justo en la posicion j
        
        
        // musica de disparo
        if (music && music.enemigo_exp) {
          music.enemigo_exp.play(); 
        }    
        // Aumenta la velocidad de todos los enemigos restantes un 2%
        let factorAumento = 1.02; 
        for (let k = 0; k < enemigos.length; k++) {
          // Mantiene el sentido actual del movimiento (positivo o negativo)
          enemigos[k].velX *= factorAumento; 
        }
    
        break;
      }
    }
  }
  
  // --- GESTIÓN DE LÁSERES ENEMIGOS (BAJAN) ---
  let tiempoActualLaser = Date.now();

  for (let i = laseresEnemigos.length - 1; i >= 0; i--) {
    let laser = laseresEnemigos[i];

    // Si el láser está explotando en el suelo
    if (laser.estado === "explotando") {
      laser.mostrar(); // Sigue dibujando el sprite de explosión

      // Tras 100ms se elimina definitivamente
      if (tiempoActualLaser - laser.tiempoExplosion >= 100) {
        laseresEnemigos.splice(i, 1);
      }
      continue; // Pasa al siguiente disparo
    }
    
    let yAntes = laser.y;         // <- NUEVO, antes de mostrar/mover
    laser.mostrar();
    laser.mover();

    if (laser.estado === "movimiento" && impactaEscudos(laser.x, laser.w, yAntes + laser.h, laser.y + laser.h)) {
      laseresEnemigos.splice(i, 1);
      continue;
    }

        for (let p of laseres) {
      if (p.estado === "movimiento" && balasSeCruzan(p, laser)) {
        let cx = (p.x + laser.x) / 2;
        let cy = (p.y - p.h + laser.y + laser.h) / 2;
        p.x = cx;      laser.x = cx;
        p.y = cy;      laser.y = cy;
        p.estado = "explotando";
        laser.estado = "explotando";
        p.tiempoExplosion = Date.now();
        laser.tiempoExplosion = Date.now();
        break;
      }
    }
    if (laser.estado === "explotando") continue;

    // Detectar si el láser enemigo colisiona con el jugador
    if (laser.colisionaCon(tanque)) {
      laseresEnemigos.splice(i, 1);
      vidas--;
      tanque.estado="alerta"; //para el cambio de color
      tanque.tiempocolision = Date.now();
    
      if (vidas <= 0) {
        juegoTerminado = true;
      }
      break;
    }
  }
  
  // --- GESTIÓN DE ENEMIGOS ---
  let cambiarDireccionGlobal = false;
  let tiempoActual = Date.now();
 
  for (let j = enemigos.length - 1; j >= 0; j--) {
    let enemigo = enemigos[j];
    
    if (enemigo.estado === "explotando") {
      // Si ya pasó 1 segundo (1000 milisegundos) desde el impacto, lo borramos
      if (tiempoActual - enemigo.tiempoExplosion >= 100) {
        enemigos.splice(j, 1); // Quita al marcianito definitivamente del arreglo
        continue; // Saltamos al siguiente para no mover ni mostrar un enemigo que ya no existe
      }
    }    
    enemigo.mostrar();
    enemigo.mover();

    if (enemigo.estado === "vivo" && random(1000) < 1) {
      laseresEnemigos.push(new LaserEnemigo(enemigo.x, enemigo.y));
    }

    if (enemigo.estado === "vivo") {
      let mitad = 4 * enemigo.tamPixel;   // el sprite es de 8x8 píxeles
      for (let e of escudos) {
        e.borrarRect(enemigo.x - mitad, enemigo.y - mitad, mitad * 2, mitad * 2);
      }
    }

    if (enemigo.tocaBorde()) {
      cambiarDireccionGlobal = true;
    }    
    // Si los enemigos invaden tu posición del mapa
    if (enemigo.y + enemigo.r > tanque.y) {
      juegoTerminado = true;
    }
  }
  
  // --- GESTIÓN COMPLETA DEL UFO ---
  if (ufo) {
    let tiempoActual = Date.now();

    if (ufo.estado === "explotando") {
      ufo.mostrar(); // Dibujar el sprite de explosión

      if (tiempoActual - ufo.tiempoExplosion >= 200) {
        ufo = null;
      }
    } 

    else if (ufo.vivo) {
      ufo.mover();
      ufo.mostrar();

      // Comprobar colisión con los láseres del jugador
      for (let i = laseres.length - 1; i >= 0; i--) {
        if (ufo.colisionaCon(laseres[i])) {
          ufo.vivo = false;
          ufo.estado = "explotando";
          ufo.tiempoExplosion = Date.now();

          puntaje += 100;
          laseres.splice(i, 1); 

          if (music && music.enemigo_exp) {
            music.enemigo_exp.play();
          }
          break; 
        }
      }
    } 
    else {
      ufo = null; // Se limpia la variable para permitir que vuelva a salir en el futuro
    }
  } else {
    if (random(1) < 0.002) {
      ufo = new UFO();
    }
  }
  
  
  // Mover filas hacia abajo si algún enemigo tocó un borde lateral
  if (cambiarDireccionGlobal) {
    for (let enemigo of enemigos) {
      enemigo.bajarYInvertir();
    }
  }
  
  // Condición de Victoria
  if (enemigos.length === 0) {
    juegoTerminado = true;
  }
}


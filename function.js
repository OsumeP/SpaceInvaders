  // --- FUNCION PANTALLA DE INICIO ---
  
function PantallaInicio() {
  fill(200);
  textFont(font.Pixel);  
  
  // 1. Mensaje de acción
  textSize(16);
 
  text("PLAY", width / 2, height * 0.22);
  text("SPACE      INVADERS", width / 2, height * 0.30);
    
  // 2. Título principal
 
  text("*SCORE   ADVANCE   TABLE*", width / 2,  height * 0.38);
  text("nave = ? MYSTERY", width / 2,  height * 0.43);
  text("x = 30 POINTS", width / 2,  height * 0.48); 
  text("y = 20 POINTS", width / 2,  height * 0.53);  
  text("z = 10 POINTS", width / 2, height * 0.58);  
  
  
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
  
  // 1. Nos aseguramos de inicializar el tanque
  tanque = new Tanque();
  
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
  textSize(14);
  text("Press 'R' to try again", width / 2, height / 2 + 60);
  

}


// --- FUNCION  PANTALLA DE JUEGO ---

function PantallaJuego(){
  background(10, 10, 25); // Fondo espacial oscuro
 
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
  tanque.mostrar();
  tanque.mover();
  
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
    
    laserplayer.mostrar();
    laserplayer.mover();
    
   
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
  for (let i = laseresEnemigos.length - 1; i >= 0; i--) {
    laseresEnemigos[i].mostrar();
    laseresEnemigos[i].mover();
    
    if (laseresEnemigos[i].fueraDePantalla()) {
      laseresEnemigos.splice(i, 1);
      continue;
    }
    
    // Detectar si el láser enemigo te golpea a ti
    if (laseresEnemigos[i].colisionaCon(tanque)) {
      laseresEnemigos.splice(i, 1); // Elimina el proyectil enemigo
      vidas--; // Pierdes una vida
 
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
    // Decidir aleatoriamente si este enemigo dispara (Probabilidad 1 entre 1000)
    if (enemigo.estado === "vivo" && random(1000) < 1) {
      laseresEnemigos.push(new LaserEnemigo(enemigo.x, enemigo.y));
    }
 
    if (enemigo.tocaBorde()) {
      cambiarDireccionGlobal = true;
    }
    
    // Si los enemigos invaden tu posición del mapa
    if (enemigo.y + enemigo.r > tanque.y) {
      juegoTerminado = true;
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

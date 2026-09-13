
  // --- CLASE TANQUE DEL JUGADOR  ---

class Tanque {
  constructor() {
    this.x = width / 2;
    this.y = height - 20;
    this.w = 20;
    this.h = 10;
    this.velocidad = 5;
  }

  mostrar() {
    fill(0, 255, 0); 
    noStroke();
    rect(this.x - this.w/2, this.y, this.w, this.h);
    rect(this.x - 2, this.y - 5, 5, 5); // Cañón superior
  }

  mover() {
    if (keyIsDown(LEFT_ARROW))  this.x -= this.velocidad;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.velocidad;
    this.x = constrain(this.x, this.w/2, width - this.w/2);
  }
}

  // --- CLASE LASER DEL TANQUE DEL JUGADOR  ---

class Laser {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 4;
    this.h = 15;
    
    this.velocidad = 7;
    this.tamPixel = 2;
    this.tiempoExplosion = 0;    
    this.estado = "movimiento";    
    
    this.choque = [
      // explosion
      [
        [0,0,0,1,1,0,0,0],
        [1,0,1,0,0,1,0,1],
        [0,1,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,1,0],
        [1,0,1,0,0,1,0,1],
        [0,0,0,1,1,0,0,0]
      ]
    ];
    
  }

  mostrar() {
    push();    
    fill(255, 255, 0); // Amarillo Neón
    
    if (this.estado == "movimiento"){    
      rect(this.x - this.w/2, this.y - this.h, this.w, this.h);
    }
    else  if (this.estado == "explotando"){
      
      let sprite = this.choque[0]; //
      
      let filas = sprite.length;
      let cols = sprite[0].length;
  
      // Centrar el dibujo en (this.x, this.y)
      let offsetX = (cols * this.tamPixel) / 2;
      let offsetY = (filas * this.tamPixel) / 2;
      //recorre la matriz y si tiene 1 entonces ladibuja
      for (let i = 0; i < filas; i++) {
        for (let j = 0; j < cols; j++) {
          if (sprite[i][j] === 1) {
            rect(
              this.x - offsetX + (j * this.tamPixel),
              this.y - offsetY + (i * this.tamPixel),
              this.tamPixel,
              this.tamPixel
            );
          }
        }
      }
    }
    pop();           
  }

  mover() {
    // El láser solo sube si está en estado de movimiento
    if (this.estado === "movimiento") {
      this.y -= this.velocidad; 
      
      // Si toca el techo, inicia su explosión aquí mismo
      if (this.y < 20) { // para que explote un poco antes del borde 
        this.estado = "explotando";
        this.tiempoExplosion = Date.now(); // Guarda el milisegundo exacto del choque con el techo
      }
    }    
  }


  colisionaCon(enemigo) {
    // Solo puede colisionar si aún se está moviendo
    if (this.estado !== "movimiento") return false;
    
    let d = dist(this.x, this.y, enemigo.x, enemigo.y);
    return d < enemigo.r + this.w;
  }
}


  // --- CLASE DEL ALIEND  ---

class Enemigo {
  constructor(x, y, tipo = 0) {
    this.x = x;
    this.y = y;
    this.r = 15; 
    this.velX = 1.5;
    this.tipo = tipo; // 0 = Calamar (Arriba), 1 = Cangrejo (Centro), 2 = Pulpo (Abajo) 3 = explotado
    this.estado = "vivo";
    this.tiempoExplosion = 0;
    this.tamPixel = 2; // Tamaño de cada "píxel" retro //CAMBIO

    // Diseños clásicos en matrices 2D
    this.sprites = [
      // Tipo 0: Calamar (Fila superior)
      [
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [0,0,1,0,0,1,0,0],
        [0,1,0,1,1,0,1,0],
        [1,0,1,0,0,1,0,1]
      ],
      // Tipo 1: Cangrejo (Filas medias)
      [
        [0,0,1,0,0,1,0,0],
        [0,0,0,1,1,0,0,0],
        [0,0,1,1,1,1,0,0],
        [0,1,1,0,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,0,1,1,1,1,0,1],
        [1,0,1,0,0,1,0,1],
        [0,0,0,1,1,0,0,0]
      ],
      // Tipo 2: Pulpo (Filas inferiores)
      [
        [0,0,0,1,1,0,0,0],
        [0,1,1,1,1,1,1,0],
        [1,1,1,1,1,1,1,1],
        [1,1,0,1,1,0,1,1],
        [1,1,1,1,1,1,1,1],
        [0,0,1,0,0,1,0,0],
        [0,1,0,1,1,0,1,0],
        [1,0,1,0,0,1,0,1]
      ],
      // Tipo 3: explosion
      [
        [0,0,0,1,1,0,0,0],
        [1,0,1,0,0,1,0,1],
        [0,1,0,0,0,0,1,0],
        [0,0,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,0],
        [0,1,0,0,0,0,1,0],
        [1,0,1,0,0,1,0,1],
        [0,0,0,1,1,0,0,0]
      ]
    ];
  }

  mostrar() {
    push();
    rectMode(CENTER);
    noStroke();

    // Color según tipo
    if (this.tipo === 0) fill(255, 0, 128);      // Rosa Arcade
    else if (this.tipo === 1) fill(0, 255, 200); // Cían
    else if (this.tipo === 2) fill(255, 255, 0); // Amarillo
    else fill(255, 255, 0);                      // explotar    

    let sprite = this.sprites[this.tipo]; //selecciona el tipo de aliens a dibujar
    
    let filas = sprite.length;
    let cols = sprite[0].length;

    // Centrar el dibujo en (this.x, this.y)
    let offsetX = (cols * this.tamPixel) / 2;
    let offsetY = (filas * this.tamPixel) / 2;
    //recorre la matriz y si tiene 1 entonces ladibuja
    for (let i = 0; i < filas; i++) {
      for (let j = 0; j < cols; j++) {
        if (sprite[i][j] === 1) {
          rect(
            this.x - offsetX + (j * this.tamPixel),
            this.y - offsetY + (i * this.tamPixel),
            this.tamPixel,
            this.tamPixel
          );
        }
      }
    }
    pop();
  }

  mover() {
    this.x += this.velX;
  }

  tocaBorde() {
    return this.x + this.r > width || this.x - this.r < 0;
  }

  bajarYInvertir() {
    this.y += 22; //CAMBIO
    this.velX *= -1;
  }
}


// --- CLASE LASER DEL ALIEND  ---

class LaserEnemigo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 4;
    this.h = 12;
    this.velocidad = 4; // Un poco más lento que el del jugador para que sea justo
  }

  mostrar() {
    fill(255, 50, 50); // Rojo brillante peligroso
    rect(this.x - this.w/2, this.y, this.w, this.h);
  }

  mover() {
    this.y += this.velocidad; // Baja
  }

  fueraDePantalla() {
    return this.y > height;
  }

  colisionaCon(tanque) {
    // Caja de colisión precisa para la estructura rectangular de la tanque
    return (this.x > tanque.x - tanque.w/2 && this.x < tanque.x + tanque.w/2 && 
            this.y > tanque.y - tanque.h && this.y < tanque.y + tanque.h);
  }
}
// Representa al UFO que aparece de manera aleatoria en la parte superior
// --- CLASE UFO CORREGIDA ---
class UFO {
  constructor() {
    this.r = 16;
    this.tamPixel = 3;
    this.velX = 2.5;
    this.tiempoExplosion = 0;
    this.estado = "vivo"; // Cambiamos el control principal a 'estado'
    
    // Decidir aleatoriamente si aparece por la izquierda o la derecha
    if (random(1) < 0.5) {
      this.x = -this.r * 2;
      this.velX = 2.5;  // Se mueve a la derecha
    } else {
      this.x = width + this.r * 2;
      this.velX = -2.5; // Se mueve a la izquierda
    }
    
    this.y = 35; 
    this.vivo = true;

    this.sprite = [
      [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
      [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
      [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
      [0,1,1,0,1,1,0,1,1,0,1,1,0,1,1,0],
      [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
      [0,0,1,1,1,0,0,1,1,0,0,1,1,1,0,0],
      [0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0]
    ];
    
    this.spriteExplosion = [
      [0,1,0,0,1,0,1,0,0,1,0],
      [0,0,1,0,0,1,0,0,1,0,0],
      [1,0,0,1,0,0,0,1,0,0,1],
      [0,1,0,0,0,0,0,0,0,1,0],
      [1,0,0,1,0,0,0,1,0,0,1],
      [0,0,1,0,0,1,0,0,1,0,0],
      [0,1,0,0,1,0,1,0,0,1,0]
    ];
  }

  mostrar() {
    push();
    rectMode(CENTER);
    noStroke();
    
    let spriteADibujar = null;

    if (this.estado === "explotando") {
      fill(255, 0, 0); // Rojo de explosión
      spriteADibujar = th+is.spriteExplosion;
    } else if (this.vivo) {
      fill(255, 0, 0); // Rojo clásico del UFO
      spriteADibujar = this.sprite;
    }

    if (spriteADibujar) {
      let filas = spriteADibujar.length;
      let cols = spriteADibujar[0].length;
      let offsetX = (cols * this.tamPixel) / 2;
      let offsetY = (filas * this.tamPixel) / 2;

      for (let i = 0; i < filas; i++) {
        for (let j = 0; j < cols; j++) {
          if (spriteADibujar[i][j] === 1) {
            rect(
              this.x - offsetX + (j * this.tamPixel),
              this.y - offsetY + (i * this.tamPixel),
              this.tamPixel,
              this.tamPixel
            );
          }
        }
      }
    }
    
    pop();
  }

  mover() {
    // Solo se mueve si sigue vivo y no ha sido destruido
    if (!this.vivo || this.estado === "explotando") return;
    
    this.x += this.velX;

    // Desaparece al salir completamente de la pantalla
    if ((this.velX > 0 && this.x > width + 40) || (this.velX < 0 && this.x < -40)) {
      this.vivo = false;
    }
  }

  colisionaCon(laser) {
    if (!this.vivo || this.estado === "explotando") return false;
    let d = dist(this.x, this.y, laser.x, laser.y);
    return d < this.r + laser.w;
  }
}

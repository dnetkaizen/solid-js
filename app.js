// ================================================
//  SISTEMA DE BIBLIOTECA - PRINCIPIOS SOLID (JS)
// ================================================

class Libro {
  // Clase que solo maneja información del libro
  constructor(titulo, autor, isbn) {
    this.titulo = titulo;
    this.autor = autor;
    this.isbn = isbn;
    this.disponible = true;
  }
}

class Usuario {
  // Clase que solo maneja información del usuario
  constructor(nombre, idUsuario) {
    this.nombre = nombre;
    this.idUsuario = idUsuario;
  }
}

class Prestamo {
  // Clase que solo maneja información del préstamo
  constructor(libro, usuario) {
    this.libro = libro;
    this.usuario = usuario;
    this.fechaPrestamo = new Date();
    this.fechaDevolucion = new Date(
      this.fechaPrestamo.getTime() + 14 * 24 * 60 * 60 * 1000
    );
    this.devuelto = false;
  }
}

// ========================================
// 2. OPEN/CLOSED PRINCIPLE (OCP)
// ========================================

class CalculadoraMulta {
  calcular(diasRetraso) {
    throw new Error("Método abstracto: debe implementarse en subclases");
  }
}

class MultaEstandar extends CalculadoraMulta {
  calcular(diasRetraso) {
    return diasRetraso * 10;
  }
}

class MultaEstudiante extends CalculadoraMulta {
  calcular(diasRetraso) {
    return diasRetraso * 5;
  }
}

class MultaVIP extends CalculadoraMulta {
  calcular(diasRetraso) {
    return 0;
  }
}

// ========================================
// 3. LISKOV SUBSTITUTION PRINCIPLE (LSP)
// ========================================

class Notificador {
  enviar(mensaje, destinatario) {
    throw new Error("Método abstracto: debe implementarse en subclases");
  }
}

class NotificadorEmail extends Notificador {
  enviar(mensaje, destinatario) {
    console.log(`📧 Email a ${destinatario}: ${mensaje}`);
    return true;
  }
}

class NotificadorSMS extends Notificador {
  enviar(mensaje, destinatario) {
    console.log(`📱 SMS a ${destinatario}: ${mensaje}`);
    return true;
  }
}

// ========================================
// 4. INTERFACE SEGREGATION PRINCIPLE (ISP)
// ========================================

class Reservable {
  reservar(usuario) {
    throw new Error("Método abstracto: debe implementarse en subclases");
  }
}

class Prestable {
  prestar(usuario) {
    throw new Error("Método abstracto: debe implementarse en subclases");
  }
}

class Renovable {
  renovar(prestamo) {
    throw new Error("Método abstracto: debe implementarse en subclases");
  }
}

// ========================================
// 5. DEPENDENCY INVERSION PRINCIPLE (DIP)
// ========================================

class GestorPrestamos {
  constructor(calculadoraMulta, notificador) {
    this.calculadoraMulta = calculadoraMulta;
    this.notificador = notificador;
    this.prestamos = [];
  }

  realizarPrestamo(libro, usuario) {
    if (!libro.disponible) {
      console.log(`❌ El libro '${libro.titulo}' no está disponible`);
      return null;
    }

    libro.disponible = false;
    const prestamo = new Prestamo(libro, usuario);
    this.prestamos.push(prestamo);

    const mensaje = `Has prestado '${libro.titulo}'. Fecha de devolución: ${prestamo.fechaDevolucion.toISOString().split("T")[0]}`;
    this.notificador.enviar(mensaje, usuario.nombre);

    console.log(`✅ Préstamo realizado: '${libro.titulo}' para ${usuario.nombre}`);
    return prestamo;
  }

  devolverLibro(prestamo) {
    if (prestamo.devuelto) {
      console.log("❌ Este libro ya fue devuelto");
      return;
    }

    const fechaActual = new Date();
    if (fechaActual > prestamo.fechaDevolucion) {
      const diasRetraso = Math.floor(
        (fechaActual - prestamo.fechaDevolucion) / (1000 * 60 * 60 * 24)
      );
      const multa = this.calculadoraMulta.calcular(diasRetraso);
      console.log(`⚠️  Retraso de ${diasRetraso} días. Multa: $${multa}`);
    } else {
      console.log("✅ Libro devuelto a tiempo");
    }

    prestamo.devuelto = true;
    prestamo.libro.disponible = true;
    console.log(`📚 '${prestamo.libro.titulo}' devuelto por ${prestamo.usuario.nombre}`);
  }
}

// ========================================
// EJEMPLO DE USO
// ========================================

function main() {
  console.log("🏛️  SISTEMA DE BIBLIOTECA - PRINCIPIOS SOLID");
  console.log("=".repeat(50));

  // Crear libros
  const libro1 = new Libro("1984", "George Orwell", "978-0-452-28423-4");
  const libro2 = new Libro("Cien años de soledad", "Gabriel García Márquez", "978-84-376-0494-7");

  // Crear usuarios
  const usuario1 = new Usuario("Ana García", "U001");
  const usuario2 = new Usuario("Carlos López", "U002");

  // Crear diferentes gestores con distintas configuraciones
  console.log("\n📋 GESTOR PARA USUARIOS REGULARES:");
  const gestorRegular = new GestorPrestamos(new MultaEstandar(), new NotificadorEmail());

  console.log("\n📋 GESTOR PARA ESTUDIANTES:");
  const gestorEstudiante = new GestorPrestamos(new MultaEstudiante(), new NotificadorSMS());

  // Realizar préstamos
  console.log("\n🔄 REALIZANDO PRÉSTAMOS:");
  const prestamo1 = gestorRegular.realizarPrestamo(libro1, usuario1);
  const prestamo2 = gestorEstudiante.realizarPrestamo(libro2, usuario2);

  // Simular devolución tardía
  console.log("\n📅 SIMULANDO DEVOLUCIÓN TARDÍA:");
  prestamo1.fechaDevolucion = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  gestorRegular.devolverLibro(prestamo1);

  // Devolución a tiempo
  console.log("\n📅 DEVOLUCIÓN A TIEMPO:");
  gestorEstudiante.devolverLibro(prestamo2);
}

main();

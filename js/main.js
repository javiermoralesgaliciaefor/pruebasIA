// Dibuja el fondo, sprites de Pokémon y efectos básicos en un canvas
function dibujarCombate(canvas, opciones) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo simple (degradado)
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#b3e0ff'); // azul cielo
    grad.addColorStop(1, '#e6ffe6'); // verde claro
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Efecto de suelo (elipse)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.25, canvas.height * 0.75, 60, 18, 0, 0, 2 * Math.PI);
    ctx.ellipse(canvas.width * 0.75, canvas.height * 0.35, 60, 18, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(80,80,80,0.18)';
    ctx.fill();
    ctx.restore();

    // Sprites de Pokémon (simples círculos de colores, reemplazar por imágenes si se desea)
    // Jugador
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.25, canvas.height * 0.65, 38, 0, 2 * Math.PI);
    ctx.fillStyle = opciones?.jugadorColor || '#ffcb05';
    ctx.shadowColor = '#333';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
    // Oponente
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75, canvas.height * 0.25, 38, 0, 2 * Math.PI);
    ctx.fillStyle = opciones?.oponenteColor || '#3b4cca';
    ctx.shadowColor = '#222';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();

    // Efecto básico: destello entre ambos (línea blanca)
    ctx.save();
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(canvas.width * 0.25, canvas.height * 0.65);
    ctx.lineTo(canvas.width * 0.75, canvas.height * 0.25);
    ctx.stroke();
    ctx.restore();
}

// Crear y agregar canvas a cada área de combate
function inicializarCanvasCombate() {
    document.querySelectorAll('.battlefield').forEach((area, idx) => {
        const canvas = document.createElement('canvas');
        canvas.width = 320;
        canvas.height = 220;
        canvas.style.width = '100%';
        canvas.style.maxWidth = '340px';
        canvas.style.display = 'block';
        canvas.style.margin = '0 auto 12px auto';
        area.appendChild(canvas);
        dibujarCombate(canvas, idx === 0 ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca'} : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05'});
    });
}

// Manejo de clics en el menú de batalla
function inicializarMenuBatalla() {
    document.getElementById('btn-atacar').addEventListener('click', () => {
        alert('¡Atacar!');
    });
    document.getElementById('btn-pokemon').addEventListener('click', () => {
        alert('Abrir menú de Pokémon');
    });
    document.getElementById('btn-mochila').addEventListener('click', () => {
        alert('Abrir mochila');
    });
    document.getElementById('btn-huir').addEventListener('click', () => {
        alert('Intentar huir...');
    });
}

// Lógica de turnos y velocidad
const estadoCombate = {
    jugador: {
        nombre: 'Pikachu',
        velocidad: 90,
        turno: false
    },
    oponente: {
        nombre: 'Charmander',
        velocidad: 65,
        turno: false
    },
    turnoActual: null // 'jugador' o 'oponente'
};

function determinarPrimerTurno() {
    if (estadoCombate.jugador.velocidad > estadoCombate.oponente.velocidad) {
        estadoCombate.turnoActual = 'jugador';
    } else if (estadoCombate.jugador.velocidad < estadoCombate.oponente.velocidad) {
        estadoCombate.turnoActual = 'oponente';
    } else {
        // Si hay empate, el jugador comienza
        estadoCombate.turnoActual = 'jugador';
    }
    actualizarTurnos();
}

function alternarTurno() {
    estadoCombate.turnoActual = estadoCombate.turnoActual === 'jugador' ? 'oponente' : 'jugador';
    actualizarTurnos();
}

function actualizarTurnos() {
    estadoCombate.jugador.turno = estadoCombate.turnoActual === 'jugador';
    estadoCombate.oponente.turno = estadoCombate.turnoActual === 'oponente';
    // Aquí puedes actualizar la UI si lo deseas
    console.log(`Turno de: ${estadoCombate.turnoActual}`);
}

// Cálculo de daño y reducción de HP
function calcularDanio({ataque, defensa, efectividad = 1}) {
    // Fórmula básica de daño Pokémon
    // Daño = ((2 * Nivel / 5 + 2) * Ataque / Defensa * 20 * Efectividad) / 50 + 2
    // Para simplificar, asumimos nivel 50 y poder base 20
    const nivel = 50;
    const poder = 20;
    const danioBase = (((2 * nivel / 5 + 2) * poder * (ataque / defensa)) / 50 + 2) * efectividad;
    return Math.floor(danioBase);
}

function aplicarDanio(objetivo, danio) {
    if (typeof objetivo.hp === 'undefined') objetivo.hp = objetivo.hpMax || 100;
    objetivo.hp = Math.max(0, objetivo.hp - danio);
    return objetivo.hp;
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCanvasCombate();
    inicializarMenuBatalla();
    determinarPrimerTurno();
    console.log('PruebasIA listo');
});

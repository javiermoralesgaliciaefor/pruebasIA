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
    let offset = opciones?.offset || 0;
    ctx.arc(canvas.width * 0.25 + (offset || 0), canvas.height * 0.65, 38, 0, 2 * Math.PI);
    ctx.fillStyle = opciones?.jugadorColor || '#ffcb05';
    ctx.shadowColor = '#333';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.restore();
    // Oponente
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width * 0.75 - (offset || 0), canvas.height * 0.25, 38, 0, 2 * Math.PI);
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

// Efectos de estado
const efectosEstado = {
    paralisis: {
        nombre: 'Parálisis',
        afectaTurno: true, // Puede perder el turno
        probabilidad: 0.25, // 25% de perder el turno
        modificarDanio: danio => danio // No afecta el daño
    },
    dormido: {
        nombre: 'Dormido',
        afectaTurno: true,
        probabilidad: 1, // Siempre pierde el turno
        modificarDanio: danio => danio
    },
    quemadura: {
        nombre: 'Quemadura',
        afectaTurno: false,
        modificarDanio: danio => Math.floor(danio / 2) // Daño reducido a la mitad
    },
    normal: {
        nombre: '',
        afectaTurno: false,
        modificarDanio: danio => danio
    }
};

// Añadir estado a los Pokémon
estadoCombate.jugador.estado = 'normal';
estadoCombate.oponente.estado = 'normal';

function puedeActuar(pokemon) {
    const estado = efectosEstado[pokemon.estado] || efectosEstado.normal;
    if (estado.afectaTurno) {
        return Math.random() > estado.probabilidad;
    }
    return true;
}

function modificarDanioPorEstado(pokemon, danio) {
    const estado = efectosEstado[pokemon.estado] || efectosEstado.normal;
    return estado.modificarDanio(danio);
}

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

// Actualiza la info y barra de vida de ambos Pokémon
function actualizarInfoPokemon() {
    // Jugador
    document.getElementById('nombre-jugador').textContent = estadoCombate.jugador.nombre;
    document.getElementById('nivel-jugador').textContent = `Nv. ${estadoCombate.jugador.nivel || 50}`;
    const hpJugador = estadoCombate.jugador.hp ?? estadoCombate.jugador.hpMax ?? 100;
    const hpMaxJugador = estadoCombate.jugador.hpMax ?? 100;
    document.getElementById('hp-jugador').textContent = `HP: ${hpJugador}/${hpMaxJugador}`;
    document.getElementById('vida-jugador').style.width = `${(hpJugador/hpMaxJugador)*100}%`;

    // Oponente
    document.getElementById('nombre-oponente').textContent = estadoCombate.oponente.nombre;
    document.getElementById('nivel-oponente').textContent = `Nv. ${estadoCombate.oponente.nivel || 50}`;
    const hpOponente = estadoCombate.oponente.hp ?? estadoCombate.oponente.hpMax ?? 100;
    const hpMaxOponente = estadoCombate.oponente.hpMax ?? 100;
    document.getElementById('hp-oponente').textContent = `HP: ${hpOponente}/${hpMaxOponente}`;
    document.getElementById('vida-oponente').style.width = `${(hpOponente/hpMaxOponente)*100}%`;
}

// Inicializar valores de HP y nivel
estadoCombate.jugador.hpMax = 100;
estadoCombate.jugador.hp = 100;
estadoCombate.jugador.nivel = 50;
estadoCombate.oponente.hpMax = 100;
estadoCombate.oponente.hp = 100;
estadoCombate.oponente.nivel = 50;

// Definir ataques posibles para el oponente
estadoCombate.oponente.ataques = [
    {
        nombre: 'Ascuas',
        poder: 20,
        tipo: 'fuego',
        efectividad: 1,
        estado: null // Sin efecto secundario
    },
    {
        nombre: 'Arañazo',
        poder: 15,
        tipo: 'normal',
        efectividad: 1,
        estado: null
    },
    {
        nombre: 'Pantalla de Humo',
        poder: 0,
        tipo: 'normal',
        efectividad: 1,
        estado: 'paralisis' // Aplica parálisis
    }
];

// Elegir ataque del oponente según efectividad y estado del jugador
function elegirAtaqueOponente() {
    const ataques = estadoCombate.oponente.ataques;
    // Si el jugador no está paralizado ni dormido, priorizar ataques de estado
    if (estadoCombate.jugador.estado === 'normal') {
        const ataquesEstado = ataques.filter(a => a.estado);
        if (ataquesEstado.length > 0 && Math.random() < 0.7) {
            // 70% de probabilidad de intentar aplicar estado si el jugador está normal
            return ataquesEstado[Math.floor(Math.random() * ataquesEstado.length)];
        }
    }
    // Si el jugador está paralizado o dormido, priorizar ataques de mayor efectividad
    let mejorAtaque = ataques[0];
    let mejorEfectividad = 0;
    for (const ataque of ataques) {
        if (ataque.poder > 0 && ataque.efectividad > mejorEfectividad) {
            mejorAtaque = ataque;
            mejorEfectividad = ataque.efectividad;
        }
    }
    // 70% de probabilidad de usar el ataque más efectivo, 30% aleatorio
    if (Math.random() < 0.7) {
        return mejorAtaque;
    } else {
        return ataques[Math.floor(Math.random() * ataques.length)];
    }
}

// Ejecutar acción del oponente al inicio de su turno
function turnoOponente() {
    if (!puedeActuar(estadoCombate.oponente)) {
        alert(`${estadoCombate.oponente.nombre} no puede moverse por ${efectosEstado[estadoCombate.oponente.estado].nombre}!`);
        alternarTurno();
        return;
    }
    const ataque = elegirAtaqueOponente();
    let mensaje = `${estadoCombate.oponente.nombre} usó ${ataque.nombre}!`;
    let danio = 0;
    if (ataque.poder > 0) {
        danio = calcularDanio({
            ataque: 52, // Ataque base de ejemplo
            defensa: 40, // Defensa del jugador
            efectividad: ataque.efectividad
        });
        danio = modificarDanioPorEstado(estadoCombate.oponente, danio);
        aplicarDanio(estadoCombate.jugador, danio);
        mensaje += ` ¡Causó ${danio} de daño!`;
    }
    if (ataque.estado) {
        estadoCombate.jugador.estado = ataque.estado;
        mensaje += ` ¡${estadoCombate.jugador.nombre} está ${efectosEstado[ataque.estado].nombre}!`;
    }
    actualizarInfoPokemon();
    alert(mensaje);
    alternarTurno();
}

// Llamar a turnoOponente al inicio del turno del oponente
envTurnoAnterior = null;
function actualizarTurnos() {
    estadoCombate.jugador.turno = estadoCombate.turnoActual === 'jugador';
    estadoCombate.oponente.turno = estadoCombate.turnoActual === 'oponente';
    // Aquí puedes actualizar la UI si lo deseas
    console.log(`Turno de: ${estadoCombate.turnoActual}`);
    if (estadoCombate.turnoActual === 'oponente' && envTurnoAnterior !== 'oponente') {
        setTimeout(turnoOponente, 600); // Pequeña pausa para UX
    }
    envTurnoAnterior = estadoCombate.turnoActual;
}

// Animación de ataque en Canvas
function animarAtaqueCanvas({ atacante, objetivo, tipo = 'linea', callback }) {
    // atacante: 'jugador' u 'oponente'
    // tipo: 'linea', 'parpadeo', 'desplazamiento'
    // callback: función a llamar al terminar la animación
    const idxAtacante = atacante === 'jugador' ? 0 : 1;
    const idxObjetivo = atacante === 'jugador' ? 1 : 0;
    const canvas = document.querySelectorAll('.battlefield canvas')[idxObjetivo];
    if (!canvas) { if (callback) callback(); return; }
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const maxFrames = 18;
    let animInterval;

    if (tipo === 'linea') {
        // Línea de energía que va del atacante al objetivo
        animInterval = setInterval(() => {
            dibujarCombate(canvas, idxObjetivo === 0 ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca'} : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05'});
            ctx.save();
            ctx.strokeStyle = `rgba(255,0,0,${0.7 - frame*0.03})`;
            ctx.lineWidth = 4 + Math.sin(frame/2)*2;
            ctx.beginPath();
            if (atacante === 'jugador') {
                ctx.moveTo(canvas.width * 0.25, canvas.height * 0.65);
                ctx.lineTo(canvas.width * 0.75, canvas.height * 0.25);
            } else {
                ctx.moveTo(canvas.width * 0.75, canvas.height * 0.25);
                ctx.lineTo(canvas.width * 0.25, canvas.height * 0.65);
            }
            ctx.stroke();
            ctx.restore();
            frame++;
            if (frame > maxFrames) { clearInterval(animInterval); if (callback) callback(); }
        }, 22);
    } else if (tipo === 'parpadeo') {
        // Parpadeo del sprite objetivo
        animInterval = setInterval(() => {
            dibujarCombate(canvas, idxObjetivo === 0 ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca'} : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05'});
            if (frame % 2 === 0) {
                ctx.save();
                ctx.globalAlpha = 0.2;
                ctx.fillStyle = '#fff';
                ctx.beginPath();
                if (idxObjetivo === 0) {
                    ctx.arc(canvas.width * 0.25, canvas.height * 0.65, 38, 0, 2 * Math.PI);
                } else {
                    ctx.arc(canvas.width * 0.75, canvas.height * 0.25, 38, 0, 2 * Math.PI);
                }
                ctx.fill();
                ctx.restore();
            }
            frame++;
            if (frame > maxFrames) { clearInterval(animInterval); if (callback) callback(); }
        }, 40);
    } else if (tipo === 'desplazamiento') {
        // Sprite atacante se desplaza hacia el objetivo y regresa
        const canvasAtacante = document.querySelectorAll('.battlefield canvas')[idxAtacante];
        let dir = 1;
        animInterval = setInterval(() => {
            let offset = dir * (frame < maxFrames/2 ? frame : maxFrames-frame) * 4;
            dibujarCombate(canvasAtacante, idxAtacante === 0 ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca', offset: offset} : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05', offset: offset});
            frame++;
            if (frame > maxFrames) { clearInterval(animInterval); dibujarCombate(canvasAtacante, idxAtacante === 0 ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca'} : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05'}); if (callback) callback(); }
        }, 18);
    } else {
        if (callback) callback();
    }
}

// Animación de ingreso de Pokémon
function animarIngresoPokemon({ quien = 'jugador', callback }) {
    // quien: 'jugador' u 'oponente'
    const idx = quien === 'jugador' ? 0 : 1;
    const canvas = document.querySelectorAll('.battlefield canvas')[idx];
    if (!canvas) { if (callback) callback(); return; }
    const ctx = canvas.getContext('2d');
    let frame = 0;
    const maxFrames = 28;
    let animInterval;
    animInterval = setInterval(() => {
        let offsetX = 0;
        if (quien === 'jugador') {
            offsetX = -canvas.width * (1 - frame / maxFrames) * 0.8; // Desde la izquierda
        } else {
            offsetX = canvas.width * (1 - frame / maxFrames) * 0.8; // Desde la derecha
        }
        dibujarCombate(canvas, idx === 0
            ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca', offset: offsetX}
            : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05', offset: offsetX});
        frame++;
        if (frame > maxFrames) {
            clearInterval(animInterval);
            dibujarCombate(canvas, idx === 0
                ? {jugadorColor:'#ffcb05', oponenteColor:'#3b4cca'}
                : {jugadorColor:'#3b4cca', oponenteColor:'#ffcb05'});
            if (callback) callback();
        }
    }, 18);
}

// --- Web Audio API: música de fondo y sonidos de ataque ---
let audioCtx;
let musicaBuffer = null;
let sonidoAtaqueBuffer = null;

function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Cargar un archivo de audio y devolver un buffer
async function cargarAudioBuffer(url) {
    const ctx = getAudioContext();
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await ctx.decodeAudioData(arrayBuffer);
}

// Reproducir un buffer de audio
function reproducirBuffer(buffer, loop = false, volumen = 1) {
    const ctx = getAudioContext();
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = loop;
    const gain = ctx.createGain();
    gain.gain.value = volumen;
    source.connect(gain).connect(ctx.destination);
    source.start(0);
    return source;
}

// Iniciar música de fondo
async function iniciarMusicaFondo() {
    if (!musicaBuffer) {
        musicaBuffer = await cargarAudioBuffer('assets/audio/battle_theme.mp3');
    }
    reproducirBuffer(musicaBuffer, true, 0.25);
}

// Reproducir sonido de ataque
async function reproducirSonidoAtaque() {
    if (!sonidoAtaqueBuffer) {
        sonidoAtaqueBuffer = await cargarAudioBuffer('assets/audio/attack.wav');
    }
    reproducirBuffer(sonidoAtaqueBuffer, false, 0.7);
}

// Llamar a iniciarMusicaFondo() al cargar la página (requiere interacción del usuario en navegadores modernos)
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', () => {
        iniciarMusicaFondo();
    }, { once: true });
});

document.addEventListener('DOMContentLoaded', () => {
    inicializarCanvasCombate();
    inicializarMenuBatalla();
    determinarPrimerTurno();
    actualizarInfoPokemon();
    console.log('PruebasIA listo');
});

// Dibuja el combate en un solo canvas estilo Pokémon
function dibujarCombateCanvasPrincipal({ anim = {}, mostrarVictoria = false, mensajeVictoria = '' } = {}) {
    const canvas = document.getElementById('battle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fondo y suelo
    ctx.fillStyle = '#b3e0ff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(110, 250, 70, 22, 0, 0, 2 * Math.PI);
    ctx.ellipse(370, 110, 70, 22, 0, 0, 2 * Math.PI);
    ctx.fillStyle = 'rgba(80,80,80,0.18)';
    ctx.fill();
    ctx.restore();
    // Sprites
    // Jugador (abajo izquierda)
    let offsetJ = anim.offsetJ || 0;
    let vibraJ = anim.vibraJ || 0;
    let alphaJ = anim.alphaJ !== undefined ? anim.alphaJ : 1;
    if (estadoCombate.jugador.sprite) {
        const imgJ = new window.Image();
        imgJ.src = estadoCombate.jugador.sprite;
        imgJ.onload = function() {
            ctx.save();
            ctx.globalAlpha = alphaJ;
            ctx.drawImage(imgJ, 110 - 48 + offsetJ, 170 - 48 + vibraJ, 96, 96);
            ctx.restore();
        };
        if (imgJ.complete) {
            ctx.save();
            ctx.globalAlpha = alphaJ;
            ctx.drawImage(imgJ, 110 - 48 + offsetJ, 170 - 48 + vibraJ, 96, 96);
            ctx.restore();
        }
    }
    // Oponente (arriba derecha)
    let offsetO = anim.offsetO || 0;
    let vibraO = anim.vibraO || 0;
    let alphaO = anim.alphaO !== undefined ? anim.alphaO : 1;
    if (estadoCombate.oponente.sprite) {
        const imgO = new window.Image();
        imgO.src = estadoCombate.oponente.sprite;
        imgO.onload = function() {
            ctx.save();
            ctx.globalAlpha = alphaO;
            ctx.drawImage(imgO, 370 - 48 + offsetO, 40 - 48 + vibraO, 96, 96);
            ctx.restore();
        };
        if (imgO.complete) {
            ctx.save();
            ctx.globalAlpha = alphaO;
            ctx.drawImage(imgO, 370 - 48 + offsetO, 40 - 48 + vibraO, 96, 96);
            ctx.restore();
        }
    }
    // Animación de victoria
    if (mostrarVictoria) {
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.fillStyle = '#222';
        ctx.fillRect(0, canvas.height/2 - 40, canvas.width, 80);
        ctx.globalAlpha = 1;
        ctx.font = 'bold 32px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(mensajeVictoria, canvas.width/2, canvas.height/2 + 12);
        ctx.restore();
    }
}

// Animación de victoria
function mostrarAnimacionVictoria(mensaje) {
    const div = document.getElementById('victory-message');
    div.textContent = mensaje;
    div.style.display = 'block';
    let frame = 0;
    const canvas = document.getElementById('battle-canvas');
    function anim() {
        dibujarCombateCanvasPrincipal({ mostrarVictoria: true, mensajeVictoria: mensaje });
        frame++;
        if (frame < 80) {
            requestAnimationFrame(anim);
        }
    }
    anim();
}

// Detectar KO y mostrar victoria
function verificarKO() {
    if (estadoCombate.jugador.hp <= 0) {
        mostrarAnimacionVictoria('¡Has perdido!');
        deshabilitarMenuBatalla();
        return true;
    }
    if (estadoCombate.oponente.hp <= 0) {
        mostrarAnimacionVictoria('¡Victoria!');
        deshabilitarMenuBatalla();
        return true;
    }
    return false;
}

function deshabilitarMenuBatalla() {
    document.querySelectorAll('.battle-btn').forEach(btn => btn.disabled = true);
}

// Modificar dibujarCombate para mostrar sprites en vez de círculos
function dibujarCombate(canvas, opciones) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Fondo simple (degradado)
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, '#b3e0ff');
    grad.addColorStop(1, '#e6ffe6');
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
    // Sprites de Pokémon
    // Jugador
    let offset = opciones?.offset || 0;
    let jugadorSprite = estadoCombate.jugador.sprite;
    let oponenteSprite = estadoCombate.oponente.sprite;
    // Jugador
    if (jugadorSprite) {
        const img = new window.Image();
        img.src = jugadorSprite;
        img.onload = function() {
            ctx.save();
            ctx.drawImage(img, canvas.width * 0.25 - 48 + (offset || 0), canvas.height * 0.65 - 48, 96, 96);
            ctx.restore();
        };
    } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width * 0.25 + (offset || 0), canvas.height * 0.65, 38, 0, 2 * Math.PI);
        ctx.fillStyle = opciones?.jugadorColor || '#ffcb05';
        ctx.shadowColor = '#333';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
    }
    // Oponente
    if (oponenteSprite) {
        const img = new window.Image();
        img.src = oponenteSprite;
        img.onload = function() {
            ctx.save();
            ctx.drawImage(img, canvas.width * 0.75 - 48 - (offset || 0), canvas.height * 0.25 - 48, 96, 96);
            ctx.restore();
        };
    } else {
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width * 0.75 - (offset || 0), canvas.height * 0.25, 38, 0, 2 * Math.PI);
        ctx.fillStyle = opciones?.oponenteColor || '#3b4cca';
        ctx.shadowColor = '#222';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
    }
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
function manejarAccionAtacar() {
    if (!estadoCombate.jugador.turno) return;
    if (!puedeActuar(estadoCombate.jugador)) {
        alert(`${estadoCombate.jugador.nombre} no puede moverse por ${efectosEstado[estadoCombate.jugador.estado].nombre}!`);
        alternarTurno();
        return;
    }
    let danio = calcularDanio({
        ataque: 55,
        defensa: estadoCombate.oponente.hpMax ? 45 : 40,
        efectividad: 1
    });
    danio = modificarDanioPorEstado(estadoCombate.jugador, danio);
    animarAtaqueCanvasPrincipal({
        atacante: 'jugador',
        callback: () => {
            reproducirSonidoAtaque();
            aplicarDanio(estadoCombate.oponente, danio);
            actualizarInfoPokemon();
            if (!verificarKO()) {
                alert(`${estadoCombate.jugador.nombre} atacó y causó ${danio} de daño!`);
                alternarTurno();
            }
        }
    });
}

function manejarAccionMochila() {
    alert('¡Abriste la mochila! (Funcionalidad de objetos no implementada)');
}

function manejarAccionHuir() {
    // Probabilidad simple de huida
    if (Math.random() < 0.5) {
        alert('¡Has huido con éxito!');
        // Reiniciar combate o recargar página
        window.location.reload();
    } else {
        alert('¡No pudiste huir!');
        alternarTurno();
    }
}

function inicializarMenuBatalla() {
    document.getElementById('btn-atacar').onclick = manejarAccionAtacar;
    document.getElementById('btn-mochila').onclick = manejarAccionMochila;
    document.getElementById('btn-huir').onclick = manejarAccionHuir;
    document.getElementById('btn-pokemon').onclick = () => alert('Abrir menú de Pokémon (no implementado)');
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
    dibujarCombateCanvasPrincipal();
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
    verificarKO();
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

// Animación de ataque y daño usando sprites, mejorada
function animarAtaqueCanvas({ atacante, objetivo, tipo = 'linea', callback }) {
    const idxAtacante = atacante === 'jugador' ? 0 : 1;
    const idxObjetivo = atacante === 'jugador' ? 1 : 0;
    const canvas = document.querySelectorAll('.battlefield canvas')[idxObjetivo];
    if (!canvas) { if (callback) callback(); return; }
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let animInterval;
    // Parámetros para animaciones
    const maxFramesLinea = 22;
    const maxFramesParpadeo = 16;
    const maxFramesDesplazamiento = 24;
    if (tipo === 'linea') {
        // Línea de energía con destellos y vibración
        animInterval = setInterval(() => {
            dibujarCombate(canvas, {offset: 0});
            // Vibración del objetivo
            if (frame > maxFramesLinea * 0.6) {
                let vibra = Math.sin(frame * 2) * 4;
                dibujarCombate(canvas, {offset: 0});
                ctx.save();
                ctx.translate(0, vibra);
                ctx.restore();
            }
            // Línea animada
            ctx.save();
            ctx.strokeStyle = `rgba(255,${80+Math.floor(Math.random()*175)},0,${0.7 - frame*0.025})`;
            ctx.shadowColor = '#ff0';
            ctx.shadowBlur = 16;
            ctx.lineWidth = 5 + Math.sin(frame/2)*2;
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
            // Destello al final
            if (frame === Math.floor(maxFramesLinea * 0.7)) {
                ctx.save();
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                if (idxObjetivo === 0) {
                    ctx.arc(canvas.width * 0.25, canvas.height * 0.65, 48, 0, 2 * Math.PI);
                } else {
                    ctx.arc(canvas.width * 0.75, canvas.height * 0.25, 48, 0, 2 * Math.PI);
                }
                ctx.fillStyle = '#fffbe6';
                ctx.shadowColor = '#ff0';
                ctx.shadowBlur = 32;
                ctx.fill();
                ctx.restore();
            }
            frame++;
            if (frame > maxFramesLinea) { clearInterval(animInterval); if (callback) callback(); }
        }, 18);
    } else if (tipo === 'parpadeo') {
        // Parpadeo blanco y vibración
        animInterval = setInterval(() => {
            let vibra = Math.sin(frame * 3) * 6;
            dibujarCombate(canvas, {offset: 0});
            ctx.save();
            ctx.globalAlpha = 0.4 + 0.2 * Math.sin(frame);
            ctx.fillStyle = '#fff';
            if (idxObjetivo === 0) {
                ctx.fillRect(canvas.width * 0.25 - 48, canvas.height * 0.65 - 48 + vibra, 96, 96);
            } else {
                ctx.fillRect(canvas.width * 0.75 - 48, canvas.height * 0.25 - 48 + vibra, 96, 96);
            }
            ctx.restore();
            frame++;
            if (frame > maxFramesParpadeo) { clearInterval(animInterval); if (callback) callback(); }
        }, 28);
    } else if (tipo === 'desplazamiento') {
        // Desplazamiento con rebote
        const canvasAtacante = document.querySelectorAll('.battlefield canvas')[idxAtacante];
        let dir = 1;
        animInterval = setInterval(() => {
            let t = frame / maxFramesDesplazamiento;
            let offset = Math.sin(Math.PI * t) * 60; // Rebote
            dibujarCombate(canvasAtacante, {offset: dir * offset});
            frame++;
            if (frame > maxFramesDesplazamiento) { clearInterval(animInterval); dibujarCombate(canvasAtacante, {offset: 0}); if (callback) callback(); }
        }, 16);
    } else {
        if (callback) callback();
    }
}

// Animación de ataque en el canvas principal
function animarAtaqueCanvasPrincipal({ atacante, callback }) {
    let frame = 0;
    const maxFrames = 18;
    function anim() {
        let animObj = {};
        if (atacante === 'jugador') {
            animObj = { offsetJ: Math.sin(Math.PI * frame / maxFrames) * 60 };
        } else {
            animObj = { offsetO: -Math.sin(Math.PI * frame / maxFrames) * 60 };
        }
        dibujarCombateCanvasPrincipal({ anim: animObj });
        frame++;
        if (frame <= maxFrames) {
            requestAnimationFrame(anim);
        } else {
            dibujarCombateCanvasPrincipal();
            if (callback) callback();
        }
    }
    anim();
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

// Llenar los selects con nombre e imagen de los Pokémon de la PokéAPI
async function poblarSelectorConSprites(idSelect) {
    const select = document.getElementById(idSelect);
    if (!select) return;
    select.innerHTML = '<option value="">Cargando...</option>';
    try {
        const resp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await resp.json();
        select.innerHTML = '<option value="">Elige un Pokémon</option>';
        for (const poke of data.results) {
            // Obtener el id del Pokémon desde la URL
            const urlParts = poke.url.split('/');
            const pokeId = urlParts[urlParts.length - 2];
            // Sprite oficial
            const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokeId}.png`;
            const nombre = poke.name.charAt(0).toUpperCase() + poke.name.slice(1);
            // Crear opción con imagen y nombre
            const option = document.createElement('option');
            option.value = poke.name;
            option.textContent = nombre;
            option.setAttribute('data-img', spriteUrl);
            select.appendChild(option);
        }
    } catch (e) {
        select.innerHTML = '<option value="">Error al cargar</option>';
    }
}

// Mostrar imagen en el select seleccionado
function mostrarImagenSelect(idSelect, idImg) {
    const select = document.getElementById(idSelect);
    let img = document.getElementById(idImg);
    if (!img) {
        img = document.createElement('img');
        img.id = idImg;
        img.style.maxWidth = '56px';
        img.style.maxHeight = '56px';
        img.style.verticalAlign = 'middle';
        img.style.marginLeft = '8px';
        select.parentNode.appendChild(img);
    }
    select.addEventListener('change', () => {
        const selected = select.options[select.selectedIndex];
        const sprite = selected.getAttribute('data-img');
        img.src = sprite || '';
        img.alt = selected.textContent;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    inicializarCanvasCombate();
    inicializarMenuBatalla();
    determinarPrimerTurno();
    actualizarInfoPokemon();
    poblarSelectorConSprites('select-pokemon');
    poblarSelectorConSprites('select-oponente');
    mostrarImagenSelect('select-pokemon', 'img-select-pokemon');
    mostrarImagenSelect('select-oponente', 'img-select-oponente');
    manejarCambioPokemonJugador();
    manejarCambioPokemonOponente();
    console.log('PruebasIA listo');
});

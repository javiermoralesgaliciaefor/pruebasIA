# Batallas Pokémon Web (Sin Frameworks)

Este proyecto tiene como objetivo crear un juego de batallas estilo Pokémon directamente en el navegador, sin el uso de frameworks modernos. Está pensado para funcionar como un videojuego tradicional con animaciones, lógica de combate, IA y soporte multijugador básico.

## 🧠 Objetivo del proyecto

Recrear la experiencia de combate por turnos de los juegos clásicos de Pokémon, utilizando exclusivamente tecnologías web nativas.

## 🚫 Reglas técnicas (para Copilot y contribuyentes)

- No usar frameworks como React, Vue, Angular, Svelte, etc.
- Solo usar **HTML**, **CSS**, y **JavaScript puro (ES6+)**.
- Se permite usar Web APIs estándar como:
  - `Canvas API` para gráficos.
  - `Web Audio API` para sonido.
  - `localStorage` para almacenamiento local.
  - `WebSocket` para multijugador.
- Uso mínimo de librerías externas. Solo si no existe una alternativa viable nativa.
- El proyecto debe poder correr directamente desde `index.html` sin servidor, excepto para funcionalidades multijugador.

## 📁 Estructura de archivos esperada

/pruebasIA
│
├── index.html
├── style.css
├── main.js
│
├── /js
│ └── batalla.js # Lógica del combate
│ └── ia.js # Lógica de inteligencia artificial
│ └── red.js # Comunicación multijugador
│
├── /assets
│ ├── /img # Sprites de Pokémon y fondos
│ └── /audio # Música y efectos
│
├── /css
│ └── ui.css # Componentes de interfaz como botones o menú

## 🕹️ Funcionalidades clave

- Menú de combate: Atacar, Mochila, Pokémon, Huir
- Sistema de turnos por velocidad
- Cálculo de daño (tipo, defensa, ataque, STAB)
- Condiciones de estado (parálisis, quemado, dormido, etc.)
- Barra de vida y estadísticas visibles
- Animaciones simples con `Canvas`
- IA básica y avanzada para combate contra la CPU
- Comunicación en tiempo real entre dos jugadores con WebSocket
- Guardado de progreso con `localStorage`

## 📌 Convenciones

- Todas las funciones deben estar comentadas.
- Los nombres de variables deben ser descriptivos (evitar `x`, `y`, `a`, `b`).
- Cada módulo debe tener su responsabilidad clara (separación de lógica, UI y red).

## ⚠️ Notas para GitHub Copilot

Este proyecto es **de propósito educativo**, con enfoque en **HTML/CSS/JS sin frameworks**. Las sugerencias deben seguir ese modelo. Evita sugerir:
- Librerías como jQuery, Lodash, anime.js, etc.
- Paquetes de Node.js (excepto WebSocket si se usa en backend).
- Sintaxis JSX, imports ESModules modernos si no es necesario.


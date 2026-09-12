import { useEffect, useRef } from 'react';

// Taille logique du canvas (mis à l'échelle via CSS)
const CW = 160;
const CH = 40;
const GROUND = CH - 8; // y de la ligne de sol = 32

// Palette noir & blanc style Game Boy
const BG   = '#000000';
const FG   = '#ffffff';
const GRAY = '#777777'; // montagnes lointaines

// ---- Sprites ----

// Personnage 6×10 px — 2 frames de marche
const CHAR_FRAMES = [
  // Frame A : pied droit en avant
  [
    [0,1,1,1,0,0],
    [1,1,1,1,1,0],
    [1,0,1,1,0,0],
    [1,1,1,1,1,0],
    [0,1,1,1,0,0],
    [0,1,1,1,0,0],
    [0,1,1,1,0,0],
    [1,1,0,1,1,0],
    [1,0,0,1,0,0],
    [1,0,0,0,0,0],
  ],
  // Frame B : pied gauche en avant
  [
    [0,1,1,1,0,0],
    [1,1,1,1,1,0],
    [1,0,1,1,0,0],
    [1,1,1,1,1,0],
    [0,1,1,1,0,0],
    [0,1,1,1,0,0],
    [0,1,1,1,0,0],
    [1,1,0,1,1,0],
    [0,0,0,1,1,0],
    [0,0,0,0,1,0],
  ],
];

// Arbre 5×8 px
const TREE = [
  [0,0,1,0,0],
  [0,1,1,1,0],
  [1,1,1,1,1],
  [1,1,1,1,1],
  [0,1,1,1,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
  [0,0,1,0,0],
];

// Étoiles [x, y, période de clignotement en ticks]
const STARS = [
  [5,1,18],[18,4,30],[32,2,24],[48,3,40],
  [62,1,20],[80,4,35],[95,2,28],[110,5,45],
  [124,1,22],[138,3,32],[152,2,38],
];

// Montagnes lointaines [cx, hauteur, largeur] — boucle sur SCENE_W
const MOUNTAINS = [
  [22,11,16],[58,8,14],[98,14,20],[140,9,15],[178,12,18],
];

// Positions X des arbres
const TREE_XS = [50, 100, 160, 215];

const SCENE_W = 230; // largeur de la scène en boucle

// ---- Fonctions de dessin bas niveau ----

function spr(ctx, data, x, y, color) {
  ctx.fillStyle = color;
  for (let ry = 0; ry < data.length; ry++) {
    for (let rx = 0; rx < data[ry].length; rx++) {
      if (data[ry][rx]) ctx.fillRect(x + rx, y + ry, 1, 1);
    }
  }
}

function mtn(ctx, cx, w, h, color) {
  ctx.fillStyle = color;
  for (let i = 0; i < h; i++) {
    const rw = Math.floor((i / h) * w * 2) + 1;
    ctx.fillRect(Math.floor(cx - rw / 2), GROUND - 1 - i, rw, 1);
  }
}

// ---- Dessin d'une frame ----

function drawFrame(ctx, tick, scroll) {
  // Fond noir
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, CW, CH);

  // Étoiles clignotantes
  STARS.forEach(([sx, sy, period]) => {
    if (Math.floor(tick / 4) % period < Math.floor(period * 0.7)) {
      ctx.fillStyle = FG;
      ctx.fillRect(sx, sy, 1, 1);
    }
  });

  // Montagnes lointaines (parallaxe lente)
  MOUNTAINS.forEach(([mx, mh, mw]) => {
    const x = ((mx - scroll * 0.1) % SCENE_W + SCENE_W) % SCENE_W;
    mtn(ctx, x, mw, mh, GRAY);
  });

  // Ligne de sol
  ctx.fillStyle = FG;
  ctx.fillRect(0, GROUND, CW, 1);

  // Texture sol (points qui défilent)
  const dotGap = 5;
  const offset = Math.floor(scroll) % dotGap;
  ctx.fillStyle = FG;
  for (let gx = -offset; gx < CW; gx += dotGap) {
    ctx.fillRect(gx, GROUND + 2, 1, 1);
    ctx.fillRect(gx + 2, GROUND + 4, 1, 1);
  }

  // Arbres qui défilent
  TREE_XS.forEach((tx) => {
    const x = ((tx - Math.floor(scroll)) % (SCENE_W + 10) + SCENE_W + 10) % (SCENE_W + 10) - 5;
    spr(ctx, TREE, x, GROUND - 8, FG);
  });

  // Personnage (position fixe, léger rebond)
  const frame = Math.floor(tick / 3) % 2;
  const bob   = tick % 6 < 3 ? 0 : 1;
  spr(ctx, CHAR_FRAMES[frame], 18, GROUND - 10 + bob, FG);

  // Scanlines CRT
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  for (let sl = 0; sl < CH; sl += 2) {
    ctx.fillRect(0, sl, CW, 1);
  }
}

// ---- Composant ----

function PixelScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Variables locales à cette invocation de l'effect
    let running = true;
    let tick = 0;
    let scroll = 0;
    let lastTime = 0;
    const FRAME_MS = 100; // ~10 fps

    // Dessin immédiat pour ne pas laisser le canvas noir
    drawFrame(ctx, tick, scroll);

    // Pas d'animation si l'utilisateur préfère le mouvement réduit
    const noMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (noMotion) return;

    function loop(timestamp) {
      if (!running) return;
      if (timestamp - lastTime >= FRAME_MS) {
        lastTime = timestamp;
        tick++;
        scroll += 0.5;
        drawFrame(ctx, tick, scroll);
      }
      requestAnimationFrame(loop);
    }

    requestAnimationFrame(loop);

    return () => { running = false; };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={CW}
      height={CH}
      className="pixel-scene"
      aria-hidden="true"
    />
  );
}

export default PixelScene;

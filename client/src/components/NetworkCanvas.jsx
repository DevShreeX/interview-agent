import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * NetworkCanvas — Three.js rebuild.
 * Breathing nodes, faint connective web, travelling data pulses,
 * and cursor response (parallax + soft repulsion/brightening).
 */
const NetworkCanvas = ({ intensity = 1, className = '' }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.z = 9;

    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const onPointerMove = (e) => {
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('resize', onResize);
    onResize();

    /* ── Nodes ─────────────────────────────────────────────────────────── */
    const COUNT = 150;
    const nodes = [];
    const baseColors = [0x00d2ff, 0x5e6ad2];

    for (let i = 0; i < COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 6,
        drift: Math.random() * Math.PI * 2,
        speed: 0.2 + Math.random() * 0.4,
        color: baseColors[i % baseColors.length],
        base: 0.25 + Math.random() * 0.3,
      });
    }

    const positionAttr = new Float32Array(COUNT * 3);
    const colorAttr = new Float32Array(COUNT * 4);
    const pointGeo = new THREE.BufferGeometry();
    pointGeo.setAttribute('position', new THREE.BufferAttribute(positionAttr, 3));
    pointGeo.setAttribute('color', new THREE.BufferAttribute(colorAttr, 4));

    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const sctx = spriteCanvas.getContext('2d');
    const grad = sctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.35, 'rgba(255,255,255,0.5)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 64, 64);
    const sprite = new THREE.CanvasTexture(spriteCanvas);

    const pointMat = new THREE.PointsMaterial({
      size: 0.14,
      map: sprite,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const points = new THREE.Points(pointGeo, pointMat);
    scene.add(points);

    /* ── Connective web ────────────────────────────────────────────────── */
    const LINK_DIST = 2.6;
    const MAX_LINKS = 4000;
    const linkPos = new Float32Array(MAX_LINKS * 6);
    const linkCol = new Float32Array(MAX_LINKS * 8);
    const linkGeo = new THREE.BufferGeometry();
    linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
    linkGeo.setAttribute('color', new THREE.BufferAttribute(linkCol, 4));
    linkGeo.setDrawRange(0, 0);
    const linkMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const links = new THREE.LineSegments(linkGeo, linkMat);
    scene.add(links);

    /* ── Data pulses ───────────────────────────────────────────────────── */
    const PULSE_COUNT = 10;
    const pulses = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      pulses.push({
        a: Math.floor(Math.random() * COUNT),
        b: Math.floor(Math.random() * COUNT),
        t: Math.random(),
        speed: 0.35 + Math.random() * 0.45,
      });
    }
    const pulsePos = new Float32Array(PULSE_COUNT * 3);
    const pulseCol = new Float32Array(PULSE_COUNT * 4);
    const pulseGeo = new THREE.BufferGeometry();
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
    pulseGeo.setAttribute('color', new THREE.BufferAttribute(pulseCol, 4));
    const pulseMat = new THREE.PointsMaterial({
      size: 0.3,
      map: sprite,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      sizeAttenuation: true,
    });
    const pulsePoints = new THREE.Points(pulseGeo, pulseMat);
    scene.add(pulsePoints);

    const v3 = new THREE.Vector3();
    const linked = Array.from({ length: COUNT }, () => new Array(COUNT).fill(false));

    const draw = (time) => {
      const t = time * 0.001;

      /* node drift + projection-based cursor response */
      let cursorX = 0;
      let cursorY = 0;
      if (!reduceMotion) {
        mouse.x += (targetMouse.x - mouse.x) * 0.04;
        mouse.y += (targetMouse.y - mouse.y) * 0.04;
        cursorX = (mouse.x * 0.5 + 0.5) * (container.clientWidth || window.innerWidth);
        cursorY = (-mouse.y * 0.5 + 0.5) * (container.clientHeight || window.innerHeight);
      }

      const viewportH = container.clientHeight || window.innerHeight;
      const viewportW = container.clientWidth || window.innerWidth;
      const cursorR = 110;

      for (let i = 0; i < COUNT; i++) {
        const n = nodes[i];
        const breath = Math.sin(t * n.speed + n.drift);

        if (!reduceMotion) {
          n.x += Math.sin(t * n.speed * 0.4 + n.drift) * 0.0012;
          n.y += Math.cos(t * n.speed * 0.3 + n.drift * 1.3) * 0.0012;
          n.z += Math.sin(t * n.speed * 0.5 + n.drift * 2.1) * 0.0008;
        }

        positionAttr[i * 3] = n.x;
        positionAttr[i * 3 + 1] = n.y;
        positionAttr[i * 3 + 2] = n.z;

        /* cursor proximity: brightness boost */
        let boost = 0;
        if (!reduceMotion) {
          v3.set(n.x, n.y, n.z).project(camera);
          const sx = (v3.x * 0.5 + 0.5) * viewportW;
          const sy = (-v3.y * 0.5 + 0.5) * viewportH;
          const dx = sx - cursorX;
          const dy = sy - cursorY;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < cursorR) boost = (1 - d / cursorR) * 0.6;
        }

        const c = new THREE.Color(n.color);
        const alpha = Math.min(1, (n.base + (breath * 0.5 + 0.5) * 0.25) * intensity + boost);
        colorAttr[i * 4] = c.r;
        colorAttr[i * 4 + 1] = c.g;
        colorAttr[i * 4 + 2] = c.b;
        colorAttr[i * 4 + 3] = alpha;
      }
      pointGeo.attributes.position.needsUpdate = true;
      pointGeo.attributes.color.needsUpdate = true;

      /* links */
      if (!reduceMotion) {
        let li = 0;
        for (let i = 0; i < COUNT; i++) {
          for (let j = i + 1; j < COUNT; j++) {
            if (li >= MAX_LINKS) break;
            const a = nodes[i];
            const b = nodes[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dz = a.z - b.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (dist < LINK_DIST) {
              linked[i][j] = true;
              linkPos[li * 6] = a.x;
              linkPos[li * 6 + 1] = a.y;
              linkPos[li * 6 + 2] = a.z;
              linkPos[li * 6 + 3] = b.x;
              linkPos[li * 6 + 4] = b.y;
              linkPos[li * 6 + 5] = b.z;
              const aC = new THREE.Color(a.color);
              const fade = (1 - dist / LINK_DIST) * 0.16 * intensity;
              linkCol[li * 8] = aC.r;
              linkCol[li * 8 + 1] = aC.g;
              linkCol[li * 8 + 2] = aC.b;
              linkCol[li * 8 + 3] = fade;
              linkCol[li * 8 + 4] = aC.r;
              linkCol[li * 8 + 5] = aC.g;
              linkCol[li * 8 + 6] = aC.b;
              linkCol[li * 8 + 7] = fade;
              li++;
            } else {
              linked[i][j] = false;
            }
          }
        }
        linkGeo.setDrawRange(0, li * 2);
        linkGeo.attributes.position.needsUpdate = true;
        linkGeo.attributes.color.needsUpdate = true;
      }

      /* pulses travel along existing links */
      for (let p = 0; p < PULSE_COUNT; p++) {
        const pulse = pulses[p];
        let a = nodes[pulse.a];
        let b = nodes[pulse.b];
        let dist = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (pulse.t >= 1 || dist > LINK_DIST) {
          let attempts = 0;
          do {
            pulse.a = Math.floor(Math.random() * COUNT);
            pulse.b = Math.floor(Math.random() * COUNT);
            attempts++;
          } while (!linked[pulse.a][pulse.b] && attempts < 12);
          pulse.t = 0;
          a = nodes[pulse.a];
          b = nodes[pulse.b];
        }
        pulse.t += pulse.speed * 0.016;

        pulsePos[p * 3] = a.x + (b.x - a.x) * pulse.t;
        pulsePos[p * 3 + 1] = a.y + (b.y - a.y) * pulse.t;
        pulsePos[p * 3 + 2] = a.z + (b.z - a.z) * pulse.t;

        const fade = Math.sin(pulse.t * Math.PI);
        pulseCol[p * 4] = 0.35;
        pulseCol[p * 4 + 1] = 0.82;
        pulseCol[p * 4 + 2] = 1;
        pulseCol[p * 4 + 3] = fade * 0.9 * intensity;
      }
      pulseGeo.attributes.position.needsUpdate = true;
      pulseGeo.attributes.color.needsUpdate = true;

      /* camera parallax */
      if (!reduceMotion) {
        camera.position.x += (mouse.x * 0.7 - camera.position.x) * 0.03;
        camera.position.y += (mouse.y * 0.5 - camera.position.y) * 0.03;
      }
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    let frameId;
    const loop = (time) => {
      draw(time);
      frameId = requestAnimationFrame(loop);
    };

    if (reduceMotion) {
      draw(0);
    } else {
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(frameId);
      pointGeo.dispose();
      linkGeo.dispose();
      pulseGeo.dispose();
      pointMat.dispose();
      linkMat.dispose();
      pulseMat.dispose();
      sprite.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      className={`network-canvas ${className}`}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    />
  );
};

export default NetworkCanvas;

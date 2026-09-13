/* Bhoomi Rakshak — High-Performance Apple-Style Canvas Scrubber Engine
   Powered by 384 high-definition frames with active Earth revolution & 60/120fps fluid scrub */

const canvas = document.getElementById("film");
const ctx = canvas.getContext("2d");
const track = document.getElementById("track");
const loader = document.getElementById("loader");
const loadbar = document.getElementById("loadbar");
const scrollCue = document.getElementById("scroll-cue");
const captions = [...document.querySelectorAll(".caption")];

// Memory & Prefetch Window Configuration
const KEEP = 140;      // keep up to 140 decoded bitmaps in memory
const AHEAD = 45;      // decode ahead in scroll direction

const state = {
  blobs: [],           // Blob per frame
  bitmaps: new Map(),  // frameIndex → ImageBitmap
  count: 384,
  pattern: "frames/frame_%04d.webp",
  current: -1,
  target: 0,
  smooth: 0,
  dir: 1,
  ready: false,
  decoding: new Set(),
  idleFrame: 0,
  isAutoRotating: true
};

/* ── 1. Loading & Decoding Engine ── */

async function loadManifest() {
  try {
    const res = await fetch("frames/frames.json");
    if (res.ok) {
      const data = await res.json();
      state.count = data.count || 384;
      state.pattern = data.pattern || "frames/frame_%04d.webp";
    }
  } catch (e) {
    console.warn("Using default manifest config", e);
  }
  state.blobs = new Array(state.count).fill(null);
}

function frameURL(i) {
  return state.pattern.replace("%04d", String(i + 1).padStart(4, "0"));
}

async function fetchBlob(i) {
  if (i < 0 || i >= state.count) return null;
  if (state.blobs[i]) return state.blobs[i];
  try {
    const res = await fetch(frameURL(i));
    if (!res.ok) return null;
    state.blobs[i] = await res.blob();
    return state.blobs[i];
  } catch {
    return null;
  }
}

async function decode(i) {
  if (i < 0 || i >= state.count) return;
  if (state.bitmaps.has(i) || state.decoding.has(i)) return;
  
  if (!state.blobs[i]) {
    await fetchBlob(i);
  }
  if (!state.blobs[i] || state.bitmaps.has(i)) return;

  state.decoding.add(i);
  try {
    const bmp = await createImageBitmap(state.blobs[i]);
    state.bitmaps.set(i, bmp);
  } catch {
    /* retry next tick */
  }
  state.decoding.delete(i);
}

function manageWindow(center) {
  // Decode ahead and behind around current playhead
  for (let d = 0; d <= AHEAD; d++) {
    const fwd = center + d * state.dir;
    const back = center - Math.min(d, 12) * state.dir;
    if (fwd >= 0 && fwd < state.count) decode(fwd);
    if (back >= 0 && back < state.count) decode(back);
  }
  // Evict far away bitmaps if memory exceeds threshold
  if (state.bitmaps.size > KEEP * 2) {
    for (const [idx, bmp] of state.bitmaps) {
      if (Math.abs(idx - center) > KEEP) {
        if (typeof bmp.close === "function") bmp.close();
        state.bitmaps.delete(idx);
      }
    }
  }
}

// Rapid initial preload (eagerly fetch first 30 frames so page paints in ~200ms)
async function preload() {
  const EAGER = 30;
  let done = 0;
  
  const eagerPromises = [];
  for (let i = 0; i < EAGER; i++) {
    eagerPromises.push(
      fetchBlob(i).then(async (b) => {
        done++;
        if (loadbar) loadbar.style.width = `${(done / EAGER) * 100}%`;
        if (b && i < 15) await decode(i);
      })
    );
  }
  await Promise.all(eagerPromises);
  
  // Ensure frame 0 is decoded and drawn immediately
  await decode(0);
  state.ready = true;
  drawFrame(0);
  if (loader) loader.classList.add("done");

  // Load remaining frames in background with 6 parallel streams
  let next = EAGER;
  for (let w = 0; w < 6; w++) {
    (async () => {
      while (next < state.count) {
        const i = next++;
        try {
          await fetchBlob(i);
          // decode in background if near playhead
          if (Math.abs(i - state.smooth) < AHEAD) {
            await decode(i);
          }
        } catch {}
      }
    })();
  }
}

/* ── 2. Canvas Rendering ── */

function resize() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(canvas.clientWidth * dpr);
  canvas.height = Math.round(canvas.clientHeight * dpr);
  state.current = -1; // force redraw
  if (state.ready) {
    const idx = Math.round(state.smooth);
    drawFrame(idx);
  }
}

function nearestDecoded(i) {
  if (state.bitmaps.has(i)) return i;
  for (let d = 1; d < 35; d++) {
    if (state.bitmaps.has(i - d)) return i - d;
    if (state.bitmaps.has(i + d)) return i + d;
  }
  return state.bitmaps.has(0) ? 0 : -1;
}

function drawFrame(i) {
  const j = nearestDecoded(i);
  if (j < 0) return;
  const bmp = state.bitmaps.get(j);
  if (!bmp) return;
  
  const cw = canvas.width;
  const ch = canvas.height;
  
  ctx.fillStyle = "#051321";
  ctx.fillRect(0, 0, cw, ch);

  // Cover canvas preserving aspect ratio
  const s = Math.max(cw / bmp.width, ch / bmp.height);
  const w = bmp.width * s;
  const h = bmp.height * s;
  ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
  state.current = j;
}

/* ── 3. Scroll Progress & Telemetry Overlays ── */

function progress() {
  const max = track.offsetHeight - window.innerHeight;
  return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
}

function updateCaptions(p) {
  for (const el of captions) {
    const tIn = +el.dataset.in, tHold = +el.dataset.hold, tOut = +el.dataset.out;
    const rise = Math.max((tHold - tIn) * 0.4, 0.008);
    const fall = Math.max((tOut - tHold) * 0.6, 0.008);
    let o = 0;
    if (p >= tIn && p <= tOut) {
      o = Math.min((p - tIn) / rise, 1) * Math.min((tOut - p) / fall, 1);
      o = Math.min(Math.max(o, 0), 1);
    }
    el.style.opacity = o.toFixed(3);
    const drift = (p - tHold) * -40;
    el.style.transform = `${transformBase(el)} translateY(${drift.toFixed(1)}px)`;
  }
  if (scrollCue) scrollCue.style.opacity = p < 0.015 ? 1 : 0;
}

function transformBase(el) {
  if (el.classList.contains("cap-center")) return "translate(-50%, -50%)";
  if (el.classList.contains("cap-top") || el.classList.contains("cap-bottom")) return "translateX(-50%)";
  return "translateY(-50%)";
}

// Interactive Overlay References
const overlayRain = document.getElementById("node-rainfall");
const overlayMoisture = document.getElementById("node-moisture");
const overlaySlope = document.getElementById("node-slope");
const overlayElevation = document.getElementById("node-elevation");
const overlayVibration = document.getElementById("node-vibration");
const overlayHistory = document.getElementById("node-history");
const overlayTimeline = document.getElementById("prediction-timeline-overlay");
const overlayRiskScore = document.getElementById("risk-score-overlay");

const svgOverlay = document.getElementById("ai-convergence-svg");
const aiCircle = document.getElementById("ai-core-circle");
const aiText = document.getElementById("ai-core-text");

const timelinePath = document.getElementById("timeline-svg-path");
const timelineMarker = document.getElementById("timeline-svg-marker");
const tickNow = document.getElementById("tick-now");
const tick24 = document.getElementById("tick-24");
const tick48 = document.getElementById("tick-48");
const tick72 = document.getElementById("tick-72");

const pathTotalLength = timelinePath ? timelinePath.getTotalLength() : 1000;
if (timelinePath) {
  timelinePath.style.strokeDasharray = pathTotalLength;
}

function updateDynamicOverlays(p) {
  // 1. Environmental Telemetry Nodes (0.50 -> 0.65)
  const triggerNode = (node, start, end) => {
    if (!node) return;
    if (p >= start && p <= end) {
      node.style.opacity = "1";
      node.style.transform = "translate3d(0, 0, 0)";
    } else {
      node.style.opacity = "0";
      node.style.transform = "translate3d(0, 12px, 0)";
    }
  };

  triggerNode(overlayRain, 0.50, 0.65);
  triggerNode(overlayMoisture, 0.52, 0.65);
  triggerNode(overlaySlope, 0.54, 0.65);
  triggerNode(overlayElevation, 0.56, 0.65);
  triggerNode(overlayVibration, 0.58, 0.65);
  triggerNode(overlayHistory, 0.60, 0.65);

  if (p >= 0.50 && p <= 0.65) {
    const factor = (p - 0.50) / 0.15;
    const rainEl = document.getElementById("over-val-rain");
    const moistEl = document.getElementById("over-val-moisture");
    const vibeEl = document.getElementById("over-val-vibe");
    if (rainEl) rainEl.innerText = `${Math.round(15 + factor * 27)} mm/hr`;
    if (moistEl) moistEl.innerText = `${Math.round(45 + factor * 33)}%`;
    if (vibeEl) {
      vibeEl.innerText = factor > 0.6 ? "CRITICAL ALERT" : "ELEVATED";
      vibeEl.style.color = factor > 0.6 ? "var(--risk-red)" : "var(--saffron)";
    }
  }

  // 2. AI Convergence (0.65 -> 0.78)
  if (p >= 0.65 && p <= 0.78) {
    if (svgOverlay) svgOverlay.style.opacity = "1";
    const targetX = window.innerWidth / 2;
    const targetY = window.innerHeight / 2;

    if (aiCircle) {
      aiCircle.setAttribute("cx", targetX);
      aiCircle.setAttribute("cy", targetY);
    }
    if (aiText) {
      aiText.setAttribute("x", targetX);
      aiText.setAttribute("y", targetY + 4);
    }

    const convProgress = (p - 0.65) / 0.13;

    const setLineCoords = (lineEl, nodeEl) => {
      if (!lineEl || !nodeEl) return;
      const pin = nodeEl.querySelector(".telemetry-pin");
      if (!pin) return;
      const rect = pin.getBoundingClientRect();
      const fromX = rect.left + 5;
      const fromY = rect.top + 5;
      const curX = fromX + (targetX - fromX) * convProgress;
      const curY = fromY + (targetY - fromY) * convProgress;
      
      lineEl.setAttribute("x1", fromX);
      lineEl.setAttribute("y1", fromY);
      lineEl.setAttribute("x2", curX);
      lineEl.setAttribute("y2", curY);
    };

    setLineCoords(document.getElementById("line-rain"), overlayRain);
    setLineCoords(document.getElementById("line-moisture"), overlayMoisture);
    setLineCoords(document.getElementById("line-slope"), overlaySlope);
    setLineCoords(document.getElementById("line-elevation"), overlayElevation);
    setLineCoords(document.getElementById("line-vibration"), overlayVibration);
    setLineCoords(document.getElementById("line-history"), overlayHistory);

    if (aiCircle) {
      aiCircle.style.opacity = convProgress >= 0.7 ? ((convProgress - 0.7) / 0.3).toFixed(3) : "0";
    }
    if (aiText) {
      aiText.style.opacity = convProgress >= 0.7 ? ((convProgress - 0.7) / 0.3).toFixed(3) : "0";
    }

    const contractNode = (node) => {
      if (!node) return;
      node.style.opacity = (1 - convProgress).toFixed(2);
      const rect = node.getBoundingClientRect();
      const nodeX = rect.left + rect.width / 2;
      const nodeY = rect.top + rect.height / 2;
      const transX = (targetX - nodeX) * convProgress * 0.4;
      const transY = (targetY - nodeY) * convProgress * 0.4;
      node.style.transform = `translate3d(${transX.toFixed(1)}px, ${transY.toFixed(1)}px, 0)`;
    };

    contractNode(overlayRain);
    contractNode(overlayMoisture);
    contractNode(overlaySlope);
    contractNode(overlayElevation);
    contractNode(overlayVibration);
    contractNode(overlayHistory);

  } else {
    if (svgOverlay) svgOverlay.style.opacity = "0";
  }

  // 3. 72H Timeline (0.78 -> 0.88)
  if (p >= 0.78 && p <= 0.88) {
    if (overlayTimeline) overlayTimeline.style.opacity = "1";
    const pathProgress = (p - 0.78) / 0.10;
    if (timelinePath) {
      const offset = pathTotalLength - (pathProgress * pathTotalLength);
      timelinePath.style.strokeDashoffset = offset;
      const point = timelinePath.getPointAtLength(pathProgress * pathTotalLength);
      if (timelineMarker) {
        timelineMarker.setAttribute("cx", point.x);
        timelineMarker.setAttribute("cy", point.y);
        timelineMarker.style.opacity = "1";
      }
    }

    if (tickNow) tickNow.classList.toggle("active", pathProgress >= 0.0);
    if (tick24) tick24.classList.toggle("active", pathProgress >= 0.33);
    if (tick48) tick48.classList.toggle("active", pathProgress >= 0.66);
    if (tick72) tick72.classList.toggle("active", pathProgress >= 0.95);
  } else {
    if (overlayTimeline) overlayTimeline.style.opacity = "0";
  }

  // 4. Warning Payoff & Risk Score (0.88 -> 0.98)
  if (p >= 0.88 && p <= 0.98) {
    if (overlayRiskScore) overlayRiskScore.style.opacity = "1";
    const riskProgress = (p - 0.88) / 0.10;
    const countTo = Math.round(riskProgress * 78);
    const displayNum = document.getElementById("risk-display-num");
    if (displayNum) displayNum.innerText = `${countTo}%`;
  } else {
    if (overlayRiskScore) overlayRiskScore.style.opacity = "0";
  }
}

/* ── 4. Main Animation & Earth Revolution Loop ── */

let lastT = performance.now();
function tick(now) {
  const dt = Math.min((now - lastT) / 1000, 0.5) || 0.016;
  lastT = now;

  if (state.ready) {
    const p = progress();

    if (p < 0.02 && window.scrollY < 30) {
      // ── Idle Hero State: Active Continuous Earth Revolution ──
      state.isAutoRotating = true;
      // Frames 0 to 80 represent the rotating globe in space before camera accelerates to India
      state.idleFrame = (state.idleFrame + dt * 20) % 80;
      const targetFrame = Math.round(state.idleFrame);
      state.smooth = targetFrame;
      manageWindow(targetFrame);
      drawFrame(targetFrame);
    } else {
      // ── Scroll Driven Scrubbing ──
      state.isAutoRotating = false;
      const prevTarget = state.target;
      state.target = p * (state.count - 1);
      if (state.target !== prevTarget) state.dir = state.target >= prevTarget ? 1 : -1;

      // Ultra-smooth exponential LERP
      const k = 1 - Math.exp(-dt * 14);
      state.smooth += (state.target - state.smooth) * k;
      if (Math.abs(state.target - state.smooth) < 0.4) state.smooth = state.target;

      const i = Math.round(state.smooth);
      manageWindow(i);
      drawFrame(i);
    }

    updateCaptions(p);
    updateDynamicOverlays(p);
  }

  requestAnimationFrame(tick);
}

/* ── 5. Initialization ── */

window.addEventListener("resize", resize);
resize();

// Dismiss loader fallback (guaranteed max 1.5s)
setTimeout(() => {
  if (loader && !loader.classList.contains("done")) {
    loader.classList.add("done");
  }
}, 1500);

loadManifest()
  .then(() => preload())
  .catch((err) => console.error("Error initializing frame sequence:", err));

requestAnimationFrame(tick);

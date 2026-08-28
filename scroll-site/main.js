/* Bhoomi Rakshak — Premium Apple-Style Video Scrubber Engine
   Preserves visual specs and coordinates transitions on a single loop. */

const track = document.getElementById("track");
const video1 = document.getElementById("video1");
const video2 = document.getElementById("video2");
const loader = document.getElementById("loader");
const loadbar = document.getElementById("loadbar");
const scrollCue = document.getElementById("scroll-cue");
const captions = [...document.querySelectorAll(".caption")];
const heroOverlay = document.getElementById("hero-overlay");

// Video Durations (will read dynamic metadata on load)
let dur1 = 8.0;
let dur2 = 8.0;

video1.addEventListener("loadedmetadata", () => {
  dur1 = video1.duration;
  checkLoadProgress();
});
video2.addEventListener("loadedmetadata", () => {
  dur2 = video2.duration;
  checkLoadProgress();
});

// Fast loader gating: hide loader once both videos have metadata ready
let loadedCount = 0;
function checkLoadProgress() {
  loadedCount++;
  loadbar.style.width = `${(loadedCount / 2) * 100}%`;
  if (loadedCount >= 2) {
    loader.classList.add("done");
  }
}

// Fallback loader close in case browser caches/blocks metadata event
setTimeout(() => {
  loader.classList.add("done");
}, 2500);

// Global Anim State
const state = {
  targetProgress: 0,
  currentProgress: 0,
  isStoryVisible: true
};

// 1. Centralized Scroll Listener (Passive)
window.addEventListener("scroll", () => {
  const maxScroll = track.offsetHeight - window.innerHeight;
  state.targetProgress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
}, { passive: true });

// 2. IntersectionObserver to completely suspend seeking when off-screen
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    state.isStoryVisible = entry.isIntersecting;
  });
}, { threshold: 0.01 });
observer.observe(track);

// Ensure videos are paused and set up
video1.pause();
video2.pause();

// Seek utility with hardware decoder seek-lock protection
function seekVideo(video, targetTime) {
  if (!video.duration) return;
  const clampedTime = Math.min(video.duration - 0.05, Math.max(0, targetTime));
  const diff = Math.abs(video.currentTime - clampedTime);
  
  // Only write to currentTime if diff is meaningful AND hardware is idle
  if (diff > 0.04 && !video.seeking) {
    video.currentTime = clampedTime;
  }
}

// 3. Centralized requestAnimationFrame Loop
let lastT = performance.now();
function tick(now) {
  const dt = Math.min((now - lastT) / 1000, 0.5) || 0.016;
  lastT = now;

  // Exponential LERP smoothing
  const k = 1 - Math.exp(-dt * 9.5); 
  state.currentProgress += (state.targetProgress - state.currentProgress) * k;
  if (Math.abs(state.targetProgress - state.currentProgress) < 0.0005) {
    state.currentProgress = state.targetProgress;
  }

  const p = state.currentProgress;

  if (state.isStoryVisible) {
    // Fade out Hero overlay on scroll progress (0.0 -> 0.15)
    if (heroOverlay) {
      if (p <= 0.15) {
        heroOverlay.style.opacity = (1.0 - p / 0.15).toFixed(3);
        heroOverlay.style.display = "block";
      } else {
        heroOverlay.style.opacity = "0";
        heroOverlay.style.display = "none";
      }
    }

    // ── Video Selection & Coordinated Crossfade ──
    if (p < 0.72) {
      // Scale scroll segment [0.0 - 0.72] to fit video 1
      const p1 = p / 0.72;
      seekVideo(video1, p1 * dur1);
      
      video1.style.opacity = "1";
      video2.style.opacity = "0";
    } 
    else if (p >= 0.72 && p <= 0.78) {
      // Transition window: crossfade opacities
      const crossProgress = (p - 0.72) / 0.06; // 0.0 to 1.0
      
      seekVideo(video1, dur1 - 0.05);
      seekVideo(video2, 0.05);
      
      video2.style.opacity = crossProgress.toFixed(3);
      video1.style.opacity = (1.0 - crossProgress).toFixed(3);
    } 
    else {
      // Scale scroll segment [0.78 - 1.0] to fit video 2
      const p2 = (p - 0.78) / 0.22;
      seekVideo(video2, p2 * dur2);
      
      video2.style.opacity = "1";
      video1.style.opacity = "0";
    }

    // ── Update Captions & Overlay Systems ──
    updateCaptions(p);
    updateDynamicOverlays(p);
  }

  requestAnimationFrame(tick);
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
    
    // Gentle GPU translate parallax
    const drift = (p - tHold) * -45;
    el.style.transform = `${transformBase(el)} translate3d(0, ${drift.toFixed(1)}px, 0)`;
  }
  scrollCue.style.opacity = p < 0.015 ? 1 : 0;
}

function transformBase(el) {
  if (el.classList.contains("cap-center")) return "translate3d(-50%, -50%, 0)";
  if (el.classList.contains("cap-top") || el.classList.contains("cap-bottom")) return "translate3d(-50%, 0, 0)";
  return "translate3d(0, -50%, 0)";
}

// ── Overlay Systems coordination ──
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
  // 1. Environmental Telemetry Nodes (Reveal: 0.82 -> 0.90)
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

  triggerNode(overlayRain, 0.82, 0.90);
  triggerNode(overlayMoisture, 0.83, 0.90);
  triggerNode(overlaySlope, 0.84, 0.90);
  triggerNode(overlayElevation, 0.85, 0.90);
  triggerNode(overlayVibration, 0.86, 0.90);
  triggerNode(overlayHistory, 0.87, 0.90);

  if (p >= 0.82 && p <= 0.90) {
    const factor = (p - 0.82) / 0.08;
    const rainEl = document.getElementById("over-val-rain");
    const moistEl = document.getElementById("over-val-moisture");
    const vibeEl = document.getElementById("over-val-vibe");
    
    if (rainEl) rainEl.innerText = `${Math.round(15 + factor * 27)} mm/hr`;
    if (moistEl) moistEl.innerText = `${Math.round(45 + factor * 23)}%`;
    if (vibeEl) {
      vibeEl.innerText = factor > 0.6 ? "CRITICAL ALERT" : "ELEVATED";
      vibeEl.style.color = factor > 0.6 ? "var(--risk-red)" : "var(--saffron)";
    }
  }

  // 2. AI Convergence (0.90 -> 0.93)
  if (p >= 0.90 && p <= 0.93) {
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

    const convProgress = (p - 0.90) / 0.03;

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

  // 3. Risk Score Card (0.93 -> 0.96)
  if (p >= 0.93 && p <= 0.96) {
    if (overlayRiskScore) {
      overlayRiskScore.style.opacity = "1";
      overlayRiskScore.style.pointerEvents = "auto";
    }
    const riskProgress = (p - 0.93) / 0.03;
    const countTo = Math.round(riskProgress * 78);
    const displayNum = document.getElementById("risk-display-num");
    if (displayNum) displayNum.innerText = `${countTo}%`;
  } else {
    if (overlayRiskScore) {
      overlayRiskScore.style.opacity = "0";
      overlayRiskScore.style.pointerEvents = "none";
    }
  }

  // 4. 72H Timeline (0.96 -> 0.99)
  if (p >= 0.96 && p <= 0.99) {
    if (overlayTimeline) {
      overlayTimeline.style.opacity = "1";
      overlayTimeline.style.pointerEvents = "auto";
    }
    const pathProgress = (p - 0.96) / 0.03;
    
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
    if (overlayTimeline) {
      overlayTimeline.style.opacity = "0";
      overlayTimeline.style.pointerEvents = "none";
    }
  }
}

// Boot loop
requestAnimationFrame(tick);

/**
 * Web Audio API Sound Synthesizer for Banana Quest
 * Casual, pleasant, soft sound effects with zero latency.
 */

let audioCtx = null;
let soundEnabled = true;

// Load mute preference from localStorage
try {
  const saved = localStorage.getItem("banana_quest_sound");
  if (saved !== null) {
    soundEnabled = saved === "true";
  }
} catch {
  soundEnabled = true;
}

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function isSoundEnabled() {
  return soundEnabled;
}

export function toggleSound() {
  soundEnabled = !soundEnabled;
  try {
    localStorage.setItem("banana_quest_sound", String(soundEnabled));
  } catch {}
  return soundEnabled;
}

/**
 * Play a gentle, soft UI click
 */
export function playClickSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(540, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(720, ctx.currentTime + 0.04);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.04);
}

/**
 * Play an upbeat, pleasant chime for correct answers
 */
export function playCorrectSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((freq, idx) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.06);

    gain.gain.setValueAtTime(0.09, ctx.currentTime + idx * 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.06 + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + idx * 0.06);
    osc.stop(ctx.currentTime + idx * 0.06 + 0.18);
  });
}

/**
 * Play a gentle, soft low tone when incorrect (no harsh buzz)
 */
export function playWrongSound() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(220, ctx.currentTime);
  osc.frequency.linearRampToValueAtTime(160, ctx.currentTime + 0.18);

  gain.gain.setValueAtTime(0.08, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.18);
}

/**
 * Play a gentle, soft countdown tick
 */
export function playTimerTick() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(700, ctx.currentTime);

  gain.gain.setValueAtTime(0.04, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.03);
}

/**
 * Play gentle power-up streak sound
 */
export function playStreakSound(streak = 2) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const baseFreq = 380 + Math.min(streak, 8) * 60;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.3, ctx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.07, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start();
  osc.stop(ctx.currentTime + 0.15);
}

/**
 * Play gentle celebratory victory melody
 */
export function playVictoryFanfare() {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const melody = [
    { freq: 523.25, duration: 0.12, delay: 0 },
    { freq: 659.25, duration: 0.12, delay: 0.12 },
    { freq: 783.99, duration: 0.12, delay: 0.24 },
    { freq: 1046.50, duration: 0.3, delay: 0.36 },
    { freq: 880.00, duration: 0.15, delay: 0.68 },
    { freq: 1046.50, duration: 0.4, delay: 0.84 }
  ];

  melody.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(note.freq, ctx.currentTime + note.delay);

    gain.gain.setValueAtTime(0.09, ctx.currentTime + note.delay);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + note.delay + note.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime + note.delay);
    osc.stop(ctx.currentTime + note.delay + note.duration);
  });
}

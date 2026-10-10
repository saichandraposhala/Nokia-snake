/**
 * Web Audio API Monophonic & Arcade Sound Synthesis Engine
 * Recreates authentic Nokia 3310 piezo buzzer acoustic characteristics
 * along with rich arcade sound effects (Chomp, Wall Crash, Self-Bite Crunch, Faaah Game Over).
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  public enabled: boolean = true;
  public masterVolume: number = 0.8;
  public moveSoundEnabled: boolean = true;
  public moveSoundVolume: number = 0.25;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = 256;

        this.masterGain.connect(this.analyser);
        this.analyser.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMasterVolume(val: number) {
    this.masterVolume = Math.max(0, Math.min(1, val));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  // --- 1. KEYPAD / BUTTON CLICK ---
  public playKeyClick() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(1100, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.02);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.02);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // --- 2. SNAKE MOVE TICK (Tactile step sound) ---
  public playMoveTick() {
    if (!this.enabled || !this.moveSoundEnabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft short low pulse click
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.015);

      const vol = 0.04 * this.moveSoundVolume;
      gain.gain.setValueAtTime(vol, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.015);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // --- 3. CHOMP SOUND (When snake eats an egg) ---
  public playChomp() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;

      // Stage 1: Crunchy bite transient (downward FM sweep)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(860, now);
      osc1.frequency.exponentialRampToValueAtTime(190, now + 0.055);

      gain1.gain.setValueAtTime(0.18, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.055);

      // Filter for mouth resonance
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1600, now);
      filter.frequency.exponentialRampToValueAtTime(400, now + 0.055);

      osc1.connect(filter);
      filter.connect(gain1);
      gain1.connect(this.masterGain);

      osc1.start(now);
      osc1.stop(now + 0.055);

      // Stage 2: Resonant swallow / gulp crunch
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(320, now + 0.05);
      osc2.frequency.exponentialRampToValueAtTime(680, now + 0.09);
      osc2.frequency.exponentialRampToValueAtTime(240, now + 0.14);

      gain2.gain.setValueAtTime(0.001, now);
      gain2.gain.setValueAtTime(0.14, now + 0.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc2.connect(gain2);
      gain2.connect(this.masterGain);

      osc2.start(now + 0.05);
      osc2.stop(now + 0.14);

      // Stage 3: Noise bite crunch
      const bufferSize = ctx.sampleRate * 0.035;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      noise.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // --- 4. WALL HIT / CRASH SOUND ---
  public playWallCrash() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;

      // Heavy dull brick thud (260Hz down to 40Hz)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.16);

      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.16);

      // Impact noise burst
      const bufferSize = ctx.sampleRate * 0.07;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(600, now);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      noise.start(now);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // --- 5. SELF-BITE COLLISION SOUND (Distinct crunch / snap) ---
  public playSelfBite() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;

      // Harsh dissonant minor second clash (560Hz + 595Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'square';

      osc1.frequency.setValueAtTime(560, now);
      osc1.frequency.exponentialRampToValueAtTime(140, now + 0.12);

      osc2.frequency.setValueAtTime(595, now);
      osc2.frequency.exponentialRampToValueAtTime(155, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.12);
      osc2.stop(now + 0.12);

      // Sharp snapping pop
      const popOsc = ctx.createOscillator();
      const popGain = ctx.createGain();
      popOsc.type = 'triangle';
      popOsc.frequency.setValueAtTime(950, now);
      popOsc.frequency.exponentialRampToValueAtTime(110, now + 0.04);
      popGain.gain.setValueAtTime(0.22, now);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      popOsc.connect(popGain);
      popGain.connect(this.masterGain);
      popOsc.start(now);
      popOsc.stop(now + 0.04);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // --- 6. GAME OVER "FAAAH" SOUND ---
  // Iconic arcade / sad defeat descending sound: "faaa-aa-aa-aaahhh"
  public playFaaah() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;

      // Step sequence recreating "wah-wah-wah-faaaah" or classic descending trombone defeat
      // Tone 1: 370Hz (F#4) for 0.16s
      // Tone 2: 330Hz (E4) for 0.16s
      // Tone 3: 311Hz (D#4) for 0.18s
      // Tone 4: 293Hz dropping all the way to 105Hz with vibrato "faa-aa-aaah" for 0.75s

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(450, now + 1.25);

      // Frequency transitions:
      // Step 1:
      osc.frequency.setValueAtTime(370, now);
      // Step 2:
      osc.frequency.setValueAtTime(370, now + 0.14);
      osc.frequency.linearRampToValueAtTime(330, now + 0.16);
      // Step 3:
      osc.frequency.setValueAtTime(330, now + 0.30);
      osc.frequency.linearRampToValueAtTime(311, now + 0.32);
      // Step 4 (The dramatic descending "faaaah"):
      osc.frequency.setValueAtTime(311, now + 0.48);
      osc.frequency.linearRampToValueAtTime(293, now + 0.50);
      osc.frequency.exponentialRampToValueAtTime(110, now + 1.25);

      // Volume envelope with subtle articulations
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.setValueAtTime(0.18, now + 0.14);
      gain.gain.setValueAtTime(0.04, now + 0.15);
      gain.gain.setValueAtTime(0.18, now + 0.16);
      gain.gain.setValueAtTime(0.18, now + 0.30);
      gain.gain.setValueAtTime(0.04, now + 0.31);
      gain.gain.setValueAtTime(0.18, now + 0.32);
      gain.gain.setValueAtTime(0.18, now + 0.48);
      gain.gain.setValueAtTime(0.04, now + 0.49);
      gain.gain.setValueAtTime(0.22, now + 0.50); // Big emphasis on the final "faaaah"
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

      // Vibrato LFO for tragic wobble on final note
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(6.5, now); // 6.5 Hz vibrato
      lfoGain.gain.setValueAtTime(0, now);
      lfoGain.gain.setValueAtTime(0, now + 0.5);
      lfoGain.gain.linearRampToValueAtTime(14, now + 0.7); // Vibrato depth increases
      lfo.connect(lfoGain);
      lfoGain.connect(osc.frequency);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      lfo.start(now);
      lfo.stop(now + 1.25);
      osc.start(now);
      osc.stop(now + 1.25);
    } catch {
      // Audio autoplay restriction fallback
    }
  }

  // --- 7. BONUS INSECT EATEN (Sparkly Nokia chime) ---
  public playBonusEat() {
    if (!this.enabled) return;
    const ctx = this.initContext();
    if (!ctx || !this.masterGain) return;

    try {
      const now = ctx.currentTime;
      const notes = [587, 880, 1174, 1760]; // D5, A5, D6, A6 arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const start = now + idx * 0.05;

        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);

        gain.gain.setValueAtTime(0.12, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.09);

        osc.connect(gain);
        gain.connect(this.masterGain!);

        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch {
      // Audio autoplay restriction fallback
    }
  }
}

export const audioEngine = new SoundEngine();

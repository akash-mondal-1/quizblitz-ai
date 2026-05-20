type OscillatorType = 'sine' | 'square' | 'sawtooth' | 'triangle';

interface ToneConfig {
  frequency: number;
  type: OscillatorType;
  duration: number;
  volume: number;
  rampDown?: boolean;
  delay?: number;
}

export class SoundManager {
  private ctx: AudioContext | null = null;
  private initialized = false;

  /**
   * Lazily creates and resumes the AudioContext.
   * Must be called from a user-gesture handler at least once.
   */
  init(): void {
    if (this.initialized && this.ctx) return;
    try {
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch {
      console.warn('[SoundManager] Web Audio API is not available.');
    }
  }

  private ensureContext(): AudioContext | null {
    if (!this.ctx) this.init();
    if (this.ctx?.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private playTone(config: ToneConfig): void {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + (config.delay ?? 0);

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.frequency, startTime);

    gainNode.gain.setValueAtTime(config.volume, startTime);
    if (config.rampDown !== false) {
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + config.duration);
    }

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + config.duration);
  }

  private playTones(tones: ToneConfig[]): void {
    tones.forEach((tone) => this.playTone(tone));
  }

  /** Pleasant ascending two-tone — correct answer */
  playCorrect(): void {
    this.playTones([
      { frequency: 523.25, type: 'sine', duration: 0.12, volume: 0.3, delay: 0 },
      { frequency: 659.25, type: 'sine', duration: 0.18, volume: 0.25, delay: 0.1 },
    ]);
  }

  /** Descending buzz — wrong answer */
  playWrong(): void {
    this.playTones([
      { frequency: 330, type: 'square', duration: 0.15, volume: 0.15, delay: 0 },
      { frequency: 247, type: 'square', duration: 0.25, volume: 0.12, delay: 0.12 },
    ]);
  }

  /** Soft click — timer tick */
  playTick(): void {
    this.playTone({ frequency: 1200, type: 'sine', duration: 0.03, volume: 0.1 });
  }

  /** Urgent beep — countdown (last 5 seconds) */
  playCountdown(): void {
    this.playTone({ frequency: 880, type: 'sine', duration: 0.1, volume: 0.2 });
  }

  /** Short ascending fanfare — game start */
  playGameStart(): void {
    this.playTones([
      { frequency: 392, type: 'sine', duration: 0.12, volume: 0.25, delay: 0 },
      { frequency: 523.25, type: 'sine', duration: 0.12, volume: 0.25, delay: 0.1 },
      { frequency: 659.25, type: 'sine', duration: 0.12, volume: 0.25, delay: 0.2 },
      { frequency: 783.99, type: 'sine', duration: 0.25, volume: 0.3, delay: 0.3 },
    ]);
  }

  /** Triumphant chord — game end */
  playGameEnd(): void {
    this.playTones([
      { frequency: 523.25, type: 'sine', duration: 0.4, volume: 0.2, delay: 0 },
      { frequency: 659.25, type: 'sine', duration: 0.4, volume: 0.2, delay: 0 },
      { frequency: 783.99, type: 'sine', duration: 0.4, volume: 0.2, delay: 0 },
      { frequency: 1046.5, type: 'sine', duration: 0.35, volume: 0.15, delay: 0.15 },
    ]);
  }

  /** Soft pop — button click */
  playButtonClick(): void {
    this.playTone({ frequency: 600, type: 'sine', duration: 0.06, volume: 0.12 });
  }

  /** Sparkle — achievement unlocked */
  playAchievement(): void {
    this.playTones([
      { frequency: 1318.5, type: 'sine', duration: 0.08, volume: 0.15, delay: 0 },
      { frequency: 1567.98, type: 'sine', duration: 0.08, volume: 0.15, delay: 0.07 },
      { frequency: 2093, type: 'sine', duration: 0.12, volume: 0.2, delay: 0.14 },
      { frequency: 2637, type: 'triangle', duration: 0.2, volume: 0.12, delay: 0.22 },
    ]);
  }
}

export const soundManager = new SoundManager();

export class SoundManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
private musicGain: GainNode | null = null;


// Volume State
private sfxVol = 0.5;
private musicVol = 0.3;


  // Music Sequencer State
  private isPlayingMusic = false;
  private musicInterval: number | null = null;
  private currentNoteIndex = 0;
  
  // Melody: C Major 7 -> A Minor 9 -> F Major 7 -> G Dominant
  private melody = [
    261.63, 329.63, 392.00, 493.88, // C Maj7
    523.25, 493.88, 392.00, 329.63,
    
    220.00, 261.63, 329.63, 392.00, // A Min9
    440.00, 392.00, 329.63, 261.63,

    174.61, 220.00, 261.63, 329.63, // F Maj7
    349.23, 329.63, 261.63, 220.00,

    196.00, 246.94, 293.66, 349.23, // G Dom
    392.00, 349.23, 293.66, 246.94
  ];
  private bassNotes = [
  65.41 *4 , // C2
  55.00 *4 , // A1
  43.65 *4, // F1
  49.00*4   // G1
];
private playChordBass(freq: number) {
  if (!this.ctx || !this.musicGain) return;

  const now = this.ctx.currentTime;

  const bass = this.ctx.createOscillator();
  const bassGain = this.ctx.createGain();
  const bassFilter = this.ctx.createBiquadFilter();

  bass.type = "sine";        // smooth hum
  bass.frequency.setValueAtTime(freq, now);

  bassFilter.type = "lowpass";
  bassFilter.frequency.setValueAtTime(180, now); // warm bass

  bass.connect(bassFilter);
  bassFilter.connect(bassGain);
  bassGain.connect(this.musicGain);

  bass.start(now);
  bass.stop(now + 4); // lasts full chord length (8 melody notes)

  // Smooth long hum envelope
  bassGain.gain.setValueAtTime(0, now);
  bassGain.gain.linearRampToValueAtTime(0.2, now + 0.4);
  bassGain.gain.setValueAtTime(0.2, now + 3.5);
  bassGain.gain.exponentialRampToValueAtTime(0.001, now + 4);
}


  constructor() {
    try {
      // Create context but it starts in 'suspended' state
      const CtxCtor = (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext);
      if (!CtxCtor) throw new Error('Web Audio API not supported');
      const ctx = new CtxCtor();
      this.ctx = ctx;
      
      this.masterGain = ctx.createGain();
      this.masterGain.connect(ctx.destination);
      
      this.musicGain = ctx.createGain();
      this.musicGain.connect(this.masterGain);
      
      // Initial volume set to 0 to prevent loud pops on start
      this.musicGain.gain.value = 0; 
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  public init() {
    if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
    }
  }

  public setVolume(sfxVol: number, musicVol: number) {
    this.sfxVol = sfxVol;
    this.musicVol = musicVol;

    if (!this.masterGain || !this.musicGain || !this.ctx) return;
    
    // Apply volumes immediately
    const now = this.ctx.currentTime;
    this.masterGain.gain.setTargetAtTime(sfxVol, now, 0.1);
    this.musicGain.gain.setTargetAtTime(musicVol * 0.4, now, 0.1);
  }

  private createOscillator(type: OscillatorType, freq: number, duration: number, startTime: number = 0, outputNode: AudioNode | null = null) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    
    osc.connect(gain);
    gain.connect(outputNode || this.masterGain);
    
    osc.start(this.ctx.currentTime + startTime);
    osc.stop(this.ctx.currentTime + startTime + duration);
    
    // Envelope to avoid clicking
    gain.gain.setValueAtTime(0, this.ctx.currentTime + startTime);
    gain.gain.linearRampToValueAtTime(1, this.ctx.currentTime + startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + startTime + duration);
  }

  // --- SFX ---
  public playClick() { this.createOscillator('sine', 800, 0.05); }

  public playPop() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
  }

  public playSwap() {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, this.ctx.currentTime + 0.3);
    osc.type = 'triangle';
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start();
    osc.stop(this.ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.5, this.ctx.currentTime + 0.1);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.3);
  }

  public playCorrect() {
    this.createOscillator('sine', 523.25, 0.3, 0);   
    this.createOscillator('sine', 659.25, 0.3, 0.08); 
    this.createOscillator('sine', 783.99, 0.4, 0.16); 
    this.createOscillator('sine', 1046.50, 0.5, 0.24);
  }

  public playWrong() {
    this.createOscillator('sawtooth', 150, 0.4, 0);
    this.createOscillator('sawtooth', 142, 0.4, 0.05);
  }

  public playLevelUp() {
    const now = 0;
    this.createOscillator('triangle', 440, 0.2, now);      
    this.createOscillator('triangle', 554, 0.2, now + 0.1); 
    this.createOscillator('triangle', 659, 0.2, now + 0.2); 
    this.createOscillator('triangle', 880, 0.6, now + 0.3); 
    this.createOscillator('triangle', 1108, 0.8, now + 0.4); 
  }

  public playGameOver() {
    this.createOscillator('triangle', 300, 0.5, 0);
    this.createOscillator('triangle', 250, 0.5, 0.4);
    this.createOscillator('triangle', 200, 0.8, 0.8);
  }
  

  // --- Music Engine ---
  
private playNextNote() {
  if (!this.ctx || !this.musicGain || !this.isPlayingMusic) return;

  const freq = this.melody[this.currentNoteIndex];
  const now = this.ctx.currentTime;

  // Start long bass on chord change
  if (this.currentNoteIndex % 8 === 0) {
    const chordIndex = Math.floor(this.currentNoteIndex / 8);
    this.playChordBass(this.bassNotes[chordIndex]);
  }

  // --- MAIN ARPEGGIO NOTE ---
  const osc = this.ctx.createOscillator();
  const gain = this.ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq, now);

  osc.connect(gain);
  gain.connect(this.musicGain);

  const duration = 0.8;

  osc.start(now);
  osc.stop(now + duration);

  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.2, now + 0.2);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Advance melody
  this.currentNoteIndex = (this.currentNoteIndex + 1) % this.melody.length;
}



  public startMusic() {
    this.init(); 
    
    // FORCE VOLUME UPDATE
    // This ensures that even if init() was delayed, we apply the stored volume now
    this.setVolume(this.sfxVol, this.musicVol);

    if (this.isPlayingMusic) return;
    
    this.isPlayingMusic = true;
    this.currentNoteIndex = 0;
    
    this.playNextNote();
    
    if (this.musicInterval) clearInterval(this.musicInterval);
    this.musicInterval = window.setInterval(() => {
      this.playNextNote();
    }, 500); 
  }

  public stopMusic() {
    this.isPlayingMusic = false;
    if (this.musicInterval) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
  }
}

export const soundManager = new SoundManager();
// Synthesized festive sound effects using Web Audio API
class SoundFX {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  playPop() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio not supported or blocked
    }
  }

  playFanfare() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      
      // Happy birthday melody notes [G4, G4, A4, G4, C5, B4]
      const notes = [392, 392, 440, 392, 523.25, 493.88];
      const times = [0, 0.25, 0.5, 0.75, 1.0, 1.4];
      const durations = [0.2, 0.2, 0.22, 0.22, 0.35, 0.5];

      notes.forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + times[i]);
        
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime + times[i]);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + times[i] + durations[i]);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(this.ctx.currentTime + times[i]);
        osc.stop(this.ctx.currentTime + times[i] + durations[i]);
      });
    } catch {
      // Audio not supported
    }
  }
}

export const soundFX = new SoundFX();

export class SoundController {
  constructor() {
    this.context = new(window.AudioContext || window.webkitAudioContext)();
    this.volume = this.context.createGain();
    this.volume.connect(this.context.destination);
  };

  playFrequency(hz) {
    this.stop();

    this.oscillator = this.context.createOscillator();
    this.oscillator.type = 'sine';
    this.oscillator.connect(this.volume);
    this.oscillator.frequency.value = hz;
    this.oscillator.start();
  }

  stop() {
    this.oscillator && this.oscillator.stop();
  }

  setVolume(percentLevel) {
    this.volume.gain.value = percentLevel / 100;
  }
}

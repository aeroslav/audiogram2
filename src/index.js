import './styles/index.scss';

import { Model } from './components/model';
import { SoundController } from './scripts/sound-controller';
import App from './components/App.html';

const model = new Model();

const app = new App({
  target: document.body,
  store: model
});

const soundController = new SoundController();

model.on('state', ({ changed, current }) => {
  const { 
    isPlaying,
    hz,
    volume
  } = current;

  if (changed.isPlaying) {
    isPlaying
      ? soundController.playFrequency(hz)
      : soundController.stop();
  }
  if (changed.hz && isPlaying) {
    soundController.playFrequency(hz);
  }

  if (changed.volume) {
    soundController.setVolume(volume);
  }
});

export default app;

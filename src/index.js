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

model.on('state', ({ current: { isPlaying, volume, hz } }) => {
  isPlaying
    ? soundController.playFrequency(hz)
    : soundController.stop();
  soundController.setVolume(volume);
});

export default app;

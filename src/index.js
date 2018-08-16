import './styles/index.scss';

import { Model } from './components/model';
import App from './components/App.html';

const model = new Model();

const app = new App({
  target: document.body,
  store: model.store,
  data: {
    model
  }
});

export default app;

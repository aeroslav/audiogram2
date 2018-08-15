import './styles/index.scss';

import App from './components/App.html';

const app = new App({
  target: document.body,
  data: {
    name: 'world'
  }
});

export default app;
const { render, h } = require('preact');
const App = require('./components/app');

const appEl = document.getElementById('app');
render(h(App), appEl, appEl.lastChild);
appEl.classList.remove('loading');

import soundworks from '@soundworks/core/client';
import { render, html } from 'lit-html';


class PlayerExperience extends soundworks.Experience {
  constructor(soudnworks, options = {}) {
    super(soudnworks);

    this.delay1 = this.require('delay-1');
    this.delay2 = this.require('delay-2', {}, ['delay-1']);

    this.$container = document.querySelector('#container');
    this.renderApp('Starting...', {});

    soundworks.serviceManager.observe(() => {
      const statuses = soundworks.serviceManager.getValues();
      this.renderApp('Starting...', JSON.stringify(statuses));
    });
  }

  start() {
    super.start();

    this.renderApp('Hello Player');
  }

  renderApp(msg, statuses) {
    render(html`<div><h3>${msg}</h3><p>${statuses}</p></div>`, this.$container);
  }
}

export default PlayerExperience;

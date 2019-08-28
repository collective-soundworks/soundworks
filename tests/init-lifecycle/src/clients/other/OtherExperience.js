import soundworks from '@soundworks/core/client';
import { render, html } from 'lit-html';


class OtherExperience extends soundworks.Experience {
  constructor(soudnworks, options = {}) {
    super(soudnworks);

    this.delay1 = this.require('delay-3');
    this.delay2 = this.require('delay-4', {}, ['delay-3']);

    this.$container = document.querySelector('#container');
    this.renderApp('Starting...', {});

    soundworks.serviceManager.observe(() => {
      const statuses = soundworks.serviceManager.getValues();
      this.renderApp('Starting...', JSON.stringify(statuses));
    });
  }

  start() {
    super.start();

    this.renderApp('Hello Other');
  }

  renderApp(msg, statuses) {
    render(html`<div><h3>${msg}</h3><p>${statuses}</p></div>`, this.$container);
  }
}

export default OtherExperience;

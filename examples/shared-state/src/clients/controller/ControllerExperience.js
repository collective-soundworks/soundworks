import { Experience } from '@soundworks/core/client';
import { render, html } from 'lit-html';
import renderAppInitialization from '../views/renderAppInitialization';

class ControllerExperience extends Experience {
  constructor(client, config, $container) {
    super(client);

    this.config = config;
    this.$container = $container;
    this.rafId = null;

    renderAppInitialization(client, config, $container);
  }

  async start() {
    super.start();

    window.addEventListener('resize', () => this.renderApp());
    this.renderApp();
  }

  renderApp() {
    window.cancelAnimationFrame(this.rafId);

    this.rafId = window.requestAnimationFrame(() => {

      render(html`
        <div class="screen">
          <section class="half-screen aligner">
            <h1 class="title">controller [id: ${this.client.id}]</h1>
          </section>
          <section class="half-screen aligner"></section>
        </div>
      `, this.$container);
    });
  }
}

export default ControllerExperience;

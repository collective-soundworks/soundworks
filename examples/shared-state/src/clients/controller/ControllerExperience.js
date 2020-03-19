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

    // attach to global state
    const globalsState = await this.client.stateManager.attach('globals');
    console.log('globalsState:', globalsState.getValues());

    this.playerStates = new Set();

    this.client.stateManager.observe(async (schemaName, stateId, nodeId) => {
      console.log('arguments:', schemaName, stateId, nodeId);

      switch(schemaName) {
        case 'player':
          const playerState = await this.client.stateManager.attach(schemaName, stateId);
          console.log('playerState:', playerState.getValues());

          // logic to do when the state is deleted (e.g. when the player disconnects)
          playerState.onDetach(() => this.playerStates.delete(playerState));
          // stoare the player state into a list
          this.playerStates.add(playerState);
          break;
      }
    });

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

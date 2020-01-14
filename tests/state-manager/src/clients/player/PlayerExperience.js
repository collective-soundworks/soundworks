import { Experience } from '@soundworks/core/client';
import { render, html } from 'lit-html';
import renderAppInitialization from '../views/renderAppInitialization';

class PlayerExperience extends Experience {
  constructor(client, config = {}, $container) {
    super(client);

    this.config = config;
    this.$container = $container;

    // default initialization views
    renderAppInitialization(client, config, $container);
  }

  async start() {
    super.start();

    this.playerState = await this.client.stateManager.create('player', {
      id: this.client.id,
      rand: Math.random(),
    });
    this.playerState.subscribe(() => this.renderApp())

    this.globalState = await this.client.stateManager.attach('global');
    this.globalState.subscribe(() => this.renderApp())

    this.renderApp();
  }

  renderApp(msg) {
    render(html`
      <div class="screen" style="padding: 20px">
        <h1 style="font-size: 20px">id: ${this.client.id}</h1>
        <button
          @click="${e => this.playerState.set({ rand: Math.random() })}"
        >update rand</button>
        <pre><code>
playerState:
${JSON.stringify(this.playerState.getValues(), null, 2)}

globalState:
${JSON.stringify(this.globalState.getValues(), null, 2)}
        </code></pre>
      </div>
    `, this.$container);
  }
}

export default PlayerExperience;

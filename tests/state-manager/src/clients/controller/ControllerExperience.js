import { Experience } from '@soundworks/core/client';
import { render, html } from 'lit-html';

class ControllerExperience extends Experience {
  constructor(client, config, $container) {
    super(client);

    this.config = config;
    this.$container = $container;

    this.playerStates = new Map();
  }

  async start() {
    super.start();

    this.client.stateManager.observe(async (schemaName, stateId, nodeId) => {
      if (schemaName === 'player') {
        const state = await this.client.stateManager.attach(schemaName, stateId);
        console.log(state);

        state.onDetach(() => {
          console.log('detached playerState', nodeId);
          this.playerStates.delete(nodeId);
        });
        state.subscribe(() => this.renderApp());

        this.playerStates.set(nodeId, state);

        this.renderApp();
      }
    });

    this.globalState = await this.client.stateManager.attach('global');
    this.globalState.subscribe((updates) => this.renderApp());

    this.renderApp();
  }

  renderApp() {
    const players = Array.from(this.playerStates.values());
    render(
      html`
global.float: <input type="range"
  min="0"
  max="1"
  step="0.001"
  .value="${this.globalState.get('float')}"
  @input="${e => this.globalState.set({ float: parseFloat(e.target.value) })}"
></input>
<br />
<pre><code>
globals:
${JSON.stringify(this.globalState.getValues(), null, 2)}

players:
${players.map(state => JSON.stringify(state.getValues(), null, 2))}
</code><pre>
      `, this.$container
    );
  }
}

export default ControllerExperience;

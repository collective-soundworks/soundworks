import { LitElement, html, css, nothing } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

function padLeft(value, size) {
  let str = value + ''; // cast to string

  while (str.length <= size) {
    str = `&nbsp;${str}`;
  }

  return str;
}

/**
 * component for the soundworks internal audit state
 */
class SwAudit extends LitElement {
  static get styles() {
    return css`
      :host > div {
        background-color: var(--sw-light-background-color);
        height: 100%;
        padding: 0 20px;
      }
    `;
  }

  constructor() {
    super();

    this.client = null;
    this.auditState = null;
    this.numClientsString = '';
  }

  async firstUpdated() {
    this.auditState = await this.client.getAuditState();
    this.auditState.onUpdate(updates => {
      if ('numClients' in updates) {
        const numClientsStrings = [];
        const numClients = this.auditState.get('numClients');

        for (let role in numClients) {
          const str = `${role}: ${padLeft(numClients[role], 2)}`;
          numClientsStrings.push(str);
        }

        this.numClientsString = numClientsStrings.join(' - ');
      }

      this.requestUpdate();
    }, true);
  }

  render() {
    if (this.auditState === null) {
      return nothing;
    }

    const avgLatency = this.auditState.get('averageNetworkLatency');
    const avgLatencyString = padLeft((avgLatency * 1e3).toFixed(2), 6);

    return html`
      <div>
        ${unsafeHTML(this.numClientsString)} | avg latency: ${unsafeHTML(avgLatencyString)} ms
      </div>
    `;
  }
}

customElements.define('sw-audit', SwAudit);

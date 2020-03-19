import { LitElement, html, css } from 'lit-element';

class SwAppHeader extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      subtitle: { type: String },
    }
  }

  static get styles() {
    return css`
      :host {
        font-family: Consolas, monaco, monospace;
      }

      .title {
        font-size: 3rem;
        line-height: 3.4rem;
        margin: 0 0 6px 0;
        /*margin: 20px 0;*/
        text-align: center;
        font-family: Consolas, monaco, monospace;
        font-weight: normal;
      }

      .subtitle {
        margin: 0;
        font-size: 2rem;
        line-height: 2.4rem;
        font-style: italic;
        opacity: 0.5;
        text-align: center;
      }
    `;
  }

  constructor() {
    super();
  }

  render() {
    return html`
      <div>
        <h1 class="title">${this.title}</h1>
        <p class="subtitle">${this.subtitle ? this.subtitle : ''}</p>
      </div>
    `;
  }
}

customElements.define('sw-app-header', SwAppHeader);

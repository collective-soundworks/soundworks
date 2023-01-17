import { LitElement, html, css } from 'lit';

class SwCredits extends LitElement {
  static get styles() {
    return css`
      :host > div {
        line-height: 1.6rem;
        padding: 20px;
        background-color: var(--sw-light-background-color);
        box-sizing: border-box;
      }

      span {
        font-style: italic;
        color: var(--sw-light-font-color);
        font-weight: bold;
      }

      a {
        color: var(--sw-light-font-color);
      }
    `;
  }

  render() {
    return html`
      <div>
        <p>
           <span>${this.client.config.app.name}</span>
          ${this.client.config.app.author ? html`by <span>${this.client.config.app.author}</span>` : ``}
          has been developped using the <a href="https://soundworks.dev" target="_blank">soundworks</a>
          framework developped by the ISMM team at Ircam.
        </p>
        <p>
          Copyright (c) 2014-present IRCAM – Centre Pompidou (France, Paris)
        </p>
      </div>
    `;
  }
}

customElements.define('sw-credits', SwCredits);

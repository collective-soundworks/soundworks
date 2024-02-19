import { LitElement, html, css, nothing } from 'lit';

import '@ircam/sc-components/sc-icon.js';

class SwCredits extends LitElement {
  static properties = {
    _show: {
      type: Boolean,
      state: true,
    },
  };

  static styles = css`
    :host {
      width: 100%;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 1000;
    }

    :host > footer {
      display: block;
      line-height: 1.6rem;
      padding: 20px;
      background-color: var(--sw-light-background-color);
      box-sizing: border-box;
    }

    footer span {
      font-style: italic;
      color: var(--sw-light-font-color);
      font-weight: bold;
    }

    footer a {
      color: var(--sw-light-font-color);
    }

    sc-icon {
      position: absolute;
      bottom: 20px;
      right: 20px;
      z-index: 1001;
      border: none;
      background-color: transparent;
      opacity: 0.6;
    }
  `;

  constructor() {
    super();

    this._show = false;
    this.infos = {};
  }

  render() {
    const $footer = html`
      <footer>
        <p>
           <span>${this.infos.name}</span>
          ${this.infos.author ? html`by <span>${this.infos.author}</span>` : ``}
          has been developped using the <a href="https://soundworks.dev" target="_blank">soundworks</a>
          framework developped by the ISMM team at Ircam.
        </p>
        <p>
          Copyright (c) 2014-present IRCAM – Centre Pompidou (France, Paris)
        </p>
      </footer>
    `;

    return html`
      ${this._show ? $footer : nothing}
      <sc-icon type="question" @release=${e => this._show = !this._show}></sc-icon>
    `
  }
}

customElements.define('sw-credits', SwCredits);

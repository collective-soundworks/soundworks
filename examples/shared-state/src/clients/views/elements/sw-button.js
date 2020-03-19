import { LitElement, html, css } from 'lit-element';

class SwButton extends LitElement {
  static get properties() {
    return {
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      text: {
        type: String
      },
      value: {
        type: String
      },
    }
  }

  static get styles() {
    return css`
      :host {
        vertical-align: top;
        display: inline-block;
        box-sizing: border-box;
        overflow: hidden;
      }

      button {
        box-sizing: border-box;
        font-family: Consolas, monaco, monospace;
        color: #ffffff;
        background-color: #121212;
        border: 1px solid #454545;
        padding: 4px 4px 2px 4px;
        border-radius: 1px;
      }

      button:hover {
        background-color: #181818;
        cursor: pointer;
      }

      button:active {
        background-color: #232323;
        border: 1px solid #656565;
      }

      button:focus {
        outline: none;
        border: 1px solid #656565;
      }
    `;
  }

  constructor() {
    super();

    this.width = 200;
    this.height = 30;
    this.text = 'click';
    this.value = null;
  }

  /**
   * @todo - add `down` and `up` events
   */
  render() {
    return html`
      <button
        style="
          width: ${this.width}px;
          height: ${this.height}px;
          line-height: ${this.height - 6}px;
        "
        @click="${this.onClick}"
      >${this.text}</button>
    `;
  }

  onClick(e) {
    e.preventDefault();
    e.stopPropagation(); // we need this to override the default click event

    const event = new CustomEvent('click', {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    });

    this.dispatchEvent(event);
  }
}

customElements.define('sw-button', SwButton);

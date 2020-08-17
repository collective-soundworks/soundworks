import { LitElement, html, svg, css } from 'lit-element';

class SwToggle extends LitElement {
  static get properties() {
    return {
      size: {
        type: Number,
      },
      active: {
        type: Boolean,
        reflect: true,
      }
    };
  }

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }
    `;
  }

  constructor() {
    super();

    this.size = 30;
    this.active = false;
  }

  render() {
    return html`
      <svg
        style="width: ${this.size}px; height: ${this.size}px"
        viewport="0 0 ${this.size} ${this.size}"
        @click="${this.updateValue}"
      >
        <rect
          x="0"
          y="0"
          width="${this.size}"
          height="${this.size}"
          fill="#242424"
        ></rect>
        ${this.active
          ? svg`
              <line x1="4" y1="4" x2="${this.size - 4}" y2="${this.size - 4}" stroke="white" />
              <line x1="4" y1="${this.size - 4}" x2="${this.size - 4}" y2="4" stroke="white" />
            `
          : ''
        }
      </svg>
    `;
  }

  updateValue() {
    this.active = !this.active;
    const event = new CustomEvent('change', {
      bubbles: true,
      composed: true,
      detail: { active: this.active },
    });

    this.requestUpdate();
    this.dispatchEvent(event);
  }
}

customElements.define('sw-toggle', SwToggle);

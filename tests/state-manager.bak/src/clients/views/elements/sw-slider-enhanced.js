import { LitElement, html, css } from 'lit-element';
import './sw-slider';

class SwSliderEnhanced extends LitElement {
  static get properties() {
    return {
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      label: {
        type: String,
      },
      min: {
        type: Number,
      },
      max: {
        type: Number,
      },
      step: {
        type: Number,
      },
      value: {
        reflect: true,
      },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }

      label, sw-slider, input {
        display: inline-block;
      }

      label {
        color: white;
        font-family: Consolas, monaco, monospace;
        text-indent: 6px;
        overflow: hidden;
        user-select: none;
      }

      input {
        box-sizing: border-box;
        padding: 2px 4px;
        border: none;
        font-family: Consolas, monaco, monospace;
        background-color: transparent;
        color: white;
      }

      input:focus {
        outline: 1px solid #454545;
      }
    `;
  }

  constructor() {
    super();

    this.width = 200;
    this.height = 30;
    this.min = 0;
    this.max = 1;
    this.step = 0.001;
    this.value = 0.5;
  }

  render() {
    const labelWidth = this.width * 0.25;
    const sliderWidth = this.width * 0.6;
    const numboxWidth = this.width * 0.15;

    return html`
      <div style="width: ${this.width}px; height: ${this.height}px; position: relative">
        <label
          style="
            width: ${labelWidth}px;
            height: ${this.height}px;
            line-height: ${this.height}px;
            position: absolute;
            top: 0;
            left: 0;
            line-height: ${this.height}px;
          "
        >${this.label}</label>
        <sw-slider
          style="
            position: absolute;
            top: 0;
            left: ${labelWidth}px;
            width: ${sliderWidth}px;
            height: ${this.height}px;
          "
          width="${sliderWidth}"
          height="${this.height}"
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          value="${this.value}"
          @input=${this.updateValue}
        ></sw-slider>
        <input
          type="number"
          style="
            width: ${numboxWidth}px;
            height: ${this.height}px;
            position: absolute;
            top: 0;
            left: ${labelWidth + sliderWidth}px;
          "
          min="${this.min}"
          max="${this.max}"
          step="${this.step}"
          .value="${this.value}"
          @change=${this.updateValue}
        />
      </div>
    `;
  }

  updateValue(e) {
    e.stopPropagation();
    const value = e.detail ? e.detail.value : parseFloat(e.target.value);

    if (!isNaN(value)) {
      this.value = value;

      const event = new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: { value: this.value },
      });

      this.requestUpdate();
      this.dispatchEvent(event);
    }
  }
}

customElements.define('sw-slider-enhanced', SwSliderEnhanced);

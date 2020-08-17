import { LitElement, html, css } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import './sw-slider-enhanced';
import './sw-toggle';

class SwPreset extends LitElement {
  static get properties() {
    return {
      width: {
        type: Number,
      },
      label: {
        type: String,
      },
      definitions: {
        type: Object,
      },
      values: {
        type: Object,
      },
      expanded: {
        type: Boolean,
      },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      }

      sw-slider-enhanced, .toggle-enhanced {
        margin-bottom: 4px;
      }

      button {
        color: #ffffff;
        font-family: Consolas, monaco, monospace;
        background-color: #454545;
        border: none;
        height: 30px;
        min-width: 100px;
      }

      button:active {
        outline: 1px solid #ababab;
      }

      .overlay {
        position: relative;
        z-index: 10;
        padding: 4px;
        background-color: #161616;
        border-radius: 1px;
        border: 1px solid #454545;
        padding-top: 40px;
      }

      .overlay p {
        position: absolute;
        top: 0;
        left: 0;
        height: 30px;
        line-height: 30px;
        margin: 0;
        text-indent: 10px;
        font-style: italic;
      }

      .overlay button {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
      }

      label {
        text-indent: 6px;
        overflow: hidden;
        user-select: none;
      }
    `;
  }

  constructor() {
    super();

    this.width = 600;
    this.label = '';
    this.definitions = {};
    this.values = {};
    this.expanded = false;
  }

  render() {
    if (this.expanded) {
      return html`
        <div class="overlay">
          <button @click="${this.close}">close</button>

          ${this.label ? html`<p>${this.label}</p>` : ''}

          <div style="width: ${this.width}px;">

            ${Object.keys(this.definitions).map((name) => {
              const def = this.definitions[name];
              const value = this.values[name];

              if (def.type === 'integer' || def.type === 'float') {
                return html`
                  <sw-slider-enhanced
                    label="${name}"
                    type="number"
                    width="${this.width}"
                    height="30"
                    min="${def.min}"
                    max="${def.max}"
                    step="${def.step}"
                    name="${name}"
                    .value="${value}"
                    @change="${(e) => this.propagateValue(name, e.detail.value)}"
                  ></sw-slider-enhanced>
                `;
              } else if (def.type === 'boolean') {
                const labelWidth = this.width * 0.25; // cf slider extended...

                return html`
                  <div class="toggle-enhanced" style="width: ${this.width}px; height: 30px; position: relative">
                    <label
                      style="
                        width: ${labelWidth}px;
                        height: 30px;
                        line-height: 30px;
                        position: absolute;
                        top: 0;
                        left: 0;
                        line-height: 30px;
                      "
                    >${name}</label>
                    <sw-toggle
                      style="
                        position: absolute;
                        left: ${labelWidth}px;
                        top: 0;
                      "
                      size="30"
                      active="${ifDefined(value ? true : undefined)}"
                      @change="${(e) => this.propagateValue(name, e.detail.active)}"
                    ></sw-toggle>
                  </div>
                `;
              } else {
                console.error(`sw-preset: ${def.type} not implemented`);
              }
            })}
          </div>
        </div>
      `;
    } else {
      return html`
        <button @click="${this.open}">
          ${this.label ? html`${this.label}` : 'open'}
        </button>
      `;
    }
  }

  propagateValue(name, value) {
    const event = new CustomEvent('update', {
      detail: { name, value },
    });

    this.dispatchEvent(event);
  }

  open() {
    const event = new CustomEvent('open');
    this.expanded = true;
    this.requestUpdate();

    this.dispatchEvent(event);
  }

  close() {
    const event = new CustomEvent('close');
    this.expanded = false;
    this.requestUpdate();

    this.dispatchEvent(event);
  }
}

customElements.define('sw-preset', SwPreset);

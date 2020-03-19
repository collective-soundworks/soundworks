import { LitElement, html, svg, css } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined';
import * as defaultStyles from './defaultStyles';
import './sw-surface';

class SwServicePosition extends LitElement {
  static get properties() {
    return {
      xRange: {
        type: Array,
        attribute: 'x-range',
      },
      yRange: {
        type: Array,
        attribute: 'y-range',
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      backgroundImage: { type: '' },
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
      }

      .svg-container {
        position: relative;
      }

      svg {
        background-color: #343434;
        position: absolute;
      }

      .bottom-container {
        box-sizing: border-box;
        position: relative;
        padding: 20px;
      }

      .event-surface {
        position: absolute;
        z-index: 1;
      }

      .placeholder {
        position: relative;
        top: 50%;
        margin-top: -20px;
      }

      .btn {
        ${defaultStyles.largeBtn}
      }

      .info {
        ${defaultStyles.info}
      }
    `;
  }

  constructor() {
    super();

    this.x = null;
    this.y = null;

    this.svgWidth = null;
    this.svgHeight = null;
    this.containerSize = null;
    this.deltaRange = null;
  }

  // define svg size, and ratio to map to xRange and yRange
  async performUpdate() {
    const orientation = this.width > this.height ? 'landscape' : 'portrait';
    const containerSize = orientation === 'portrait' ? this.width : this.height;
    const xDelta = this.xRange[1] - this.xRange[0];
    const yDelta = this.yRange[1] - this.yRange[0];
    const deltaRange = yDelta > xDelta ? yDelta : xDelta;
    const valToPxRatio = containerSize / deltaRange;

    this.svgWidth = valToPxRatio * xDelta;
    this.svgHeight = valToPxRatio * yDelta;
    this.containerSize = containerSize;
    this.deltaRange = deltaRange;

    this.x2px = (val) => {
      return valToPxRatio * (val - this.xRange[0]);
    }

    this.y2px = (val) => {
      return valToPxRatio * (val - this.yRange[0]);
    }

    super.performUpdate();
  }

  render() {
    return html`
      <section
        class="svg-container"
        style="width: ${this.containerSize}px; height: ${this.containerSize}px;"
      >
        <sw-surface
          class="event-surface"
          width="${this.svgWidth}"
          height="${this.svgHeight}"
          x-range="${JSON.stringify(this.xRange)}"
          y-range="${JSON.stringify(this.yRange)}"
          clamp-positions
          style="
            top: ${(this.containerSize - this.svgHeight) / 2}px;
            left: ${(this.containerSize - this.svgWidth) / 2}px;"
          @input="${this.onUpdatePositions}"
        ></sw-surface>
        <svg
          viewBox="0 0 ${this.svgWidth} ${this.svgHeight}"
          style="width: ${this.svgWidth}px;
            height: ${this.svgHeight}px;
            top: ${(this.containerSize - this.svgHeight) / 2}px;
            left: ${(this.containerSize - this.svgWidth) / 2}px;"
        >
          ${(this.x !== null && this.y !== null) ? svg`
            <circle
              r="5"
              fill="steelblue"
              cx="${this.x2px(this.x)}"
              cy="${this.y2px(this.y)}"
              style="pointer-event: none"
            ></circle>
          ` : ''}
        </svg>
      </section>
      <section
        class="bottom-container"
        style="height: ${this.height - this.containerSize}px"
      >
        <div class="placeholder">
          ${(this.x !== null && this.y !== null)
            ? html`
              <button
                @click="${this.propagateChange}"
                class="btn"
              >Send</button>`
            : html`<p class="info">Please, select your position</p>`
          }
        </div>
      </section>
    `;
  }

  onUpdatePositions(e) {
    const positions = e.detail;

    if (positions[0]) {
      this.x = positions[0].x;
      this.y = positions[0].y;

      this.requestUpdate();
    }
  }

  propagateChange(eventName) {
    const event = new CustomEvent('change', {
      detail: { x: this.x, y: this.y }
    });

    this.dispatchEvent(event);
  }
}

customElements.define('sw-service-position', SwServicePosition);

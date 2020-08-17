import { LitElement, html, css } from 'lit-element';

class SwSurface extends LitElement {
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
      clampPositions: {
        type: Boolean,
        attribute: 'clamp-positions',
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        box-sizing: border-box;
      };

    `;
  }

  constructor() {
    super();

    this.xRange = [0, 1];
    this.yRange = [0, 1];
    this.clampPositions = false;

    this.activePointers = new Map();
    this.pointerIds = []; // keep order
  }

  performUpdate() {
    const xDelta = this.xRange[1] - this.xRange[0];
    const yDelta = this.yRange[1] - this.yRange[0];

    this.px2x = (px) => {
      let val = px / this.width * xDelta + this.xRange[0];

      if (this.clampPositions) {
        val = Math.min(this.xRange[1], Math.max(this.xRange[0], val));
      }

      return val;
    }

    this.px2y = (px) => {
      let val = px / this.width * yDelta + this.yRange[0];

      if (this.clampPositions) {
        val = Math.min(this.yRange[1], Math.max(this.yRange[0], val));
      }

      return val;
    }

    super.performUpdate();
  }

  render() {
    return html`
      <div
        style="width: ${this.width}px; height: ${this.height}px; touch-action: none;"
        touch-action="none"

        @pointerdown="${this.pointerDown}"
        @pointermove="${this.pointerMove}"
        @pointerup="${this.pointerUp}"
        @pointercancel="${this.pointerUp}"

        @contextmenu="${this.preventContextMenu}"
      ></div>
    `
  }

  pointerDown(e) {
    const pointerId = e.pointerId;
    const data = { x: e.offsetX, y: e.offsetY };
    this.pointerIds.push(pointerId);
    this.activePointers.set(pointerId, data);

    this.propagateValues();
  }

  pointerMove(e) {
    const pointerId = e.pointerId;
    const data = { x: e.offsetX, y: e.offsetY };

    if (this.activePointers.has(pointerId)) {
      this.activePointers.set(pointerId, data);
      this.propagateValues();
    }
  }

  pointerUp(e) {
    const pointerId = e.pointerId;
    this.pointerIds.splice(this.pointerIds.indexOf(pointerId));
    this.activePointers.delete(pointerId);

    this.propagateValues();
  }

  preventContextMenu(e) {
    e.preventDefault();
  }

  propagateValues() {
    const positions = this.pointerIds.map(pointerId => {
      const data = this.activePointers.get(pointerId);
      return { x: this.px2x(data.x), y: this.px2y(data.y) };
    });

    // propagate outside the shadow dom boudaries
    // cf. https://lit-element.polymer-project.org/guide/events#custom-events
    const event = new CustomEvent('input', {
      bubbles: true,
      composed: true,
      detail: positions,
    });

    this.dispatchEvent(event);
  }
}

customElements.define('sw-surface', SwSurface);

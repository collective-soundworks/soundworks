import { LitElement } from 'lit-element';
import { html, svg, css } from 'lit-element';

function getScale(domain, range) {
  const slope = (range[1] - range[0]) / (domain[1] - domain[0]);
  const intercept = range[0] - slope * domain[0];

  function scale(val) {
    return slope * val + intercept;
  }

  scale.invert = function(val) {
    return (val - intercept) / slope;
  }

  return scale;
}

function getClipper(min, max, step) {
  return (val) => {
    const clippedValue = Math.round(val / step) * step;
    const fixed = Math.max(Math.log10(1 / step), 0);
    const fixedValue = clippedValue.toFixed(fixed); // fix floating point errors
    return Math.min(max, Math.max(min, parseFloat(fixedValue)));
  }
}


class SwSlider extends LitElement {
  static get properties() {
    return {
      mode: {
        type: String
      },
      width: {
        type: Number
      },
      height: {
        type: Number
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
      orientation: {
        type: String,
      },
      value: {
        type: Number,
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

      :host > div {
        position: relative;
      }

      .event-surface {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }
    `;
  }

  constructor() {
    super();

    this.mode = 'jump';
    this.width = 200;
    this.height = 30;
    this.min = 0;
    this.max = 1;
    this.step = 0.001;
    this.orientation = 'horizontal';
    this.value = 0.5;

    this.pointerId = null;
  }

  performUpdate() {
    const { orientation, width, height, min, max, step } = this;
    // define transfert functions
    const domain = orientation === 'horizontal' ? [min, max] : [max, min];
    const screenSize = orientation === 'horizontal' ? width : height;
    const screenRange = [0, screenSize];

    this.screenScale = getScale(domain, screenRange);
    this.clipper = getClipper(min, max, step);

    super.performUpdate();
  }

  render() {
    // console.log(this.value, this.screenScale(this.value))
    // @todo - handle orientation with matrix
    return html`
      <div>
        <svg
          style="width: ${this.width}px; height: ${this.height}px"
          viewport="0 0 ${this.width} ${this.height}"
        >
          <rect width="${this.width}" height="${this.height}" fill="#232323"></rect>
          <rect width="${this.screenScale(this.value)}" height="${this.height}" fill="steelblue"></rect>
        </svg>
        <div
          class="event-surface"
          style="width: ${this.width}px; height: ${this.height}px; touch-action: none;"
          touch-action="none"
          @pointerdown="${this.onStart}"
          @pointermove="${this.onMove}"
          @pointerup="${this.onEnd}"
          @pointercancel="${this.onEnd}"

          @contextmenu="${this.preventContextMenu}"></div>
      </div>
    `;
  }

  preventContextMenu(e) {
    e.preventDefault();
  }

  onStart(e) {
    if (this.pointerId) {
      return;
    }

    const { offsetX, offsetY, pointerId } = e;

    switch (this.mode) {
      case 'jump':
        this.pointerId = pointerId;
        this.updateValue(offsetX, offsetY, 'input');
        break;
      // case 'proportionnal':
      //   this._currentMousePosition.x = x;
      //   this._currentMousePosition.y = y;
      //   started = true;
      //   break;
      // case 'handle':
      //   const orientation = this.params.orientation;
      //   const position = this.screenScale(this._value);
      //   const compare = orientation === 'horizontal' ? x : y;
      //   const delta = this.params.handleSize / 2;

      //   if (compare < position + delta && compare > position - delta) {
      //     this._currentMousePosition.x = x;
      //     this._currentMousePosition.y = y;
      //     started = true;
      //   } else {
      //     started = false;
      //   }
      //   break;
    }
  }

  onMove(e) {
    if (this.pointerId === e.pointerId) {
      const { offsetX, offsetY } = e;
      // switch (this.params.mode) {
      //   case 'jump':
      //     break;
      //   case 'proportionnal':
      //   case 'handle':
      //     const deltaX = x - this._currentMousePosition.x;
      //     const deltaY = y - this._currentMousePosition.y;
      //     this._currentMousePosition.x = x;
      //     this._currentMousePosition.y = y;

      //     x = this.screenScale(this._value) + deltaX;
      //     y = this.screenScale(this._value) + deltaY;
      //     break;
      // }

      this.updateValue(offsetX, offsetY, 'input');
    }
  }

  onEnd(e) {
    if (this.pointerId === e.pointerId) {
      const { offsetX, offsetY } = e;

      switch (this.mode) {
        case 'jump':
          this.pointerId = null;
          this.updateValue(offsetX, offsetY, 'change');
          break;
        // case 'proportionnal':
        // case 'handle':
        //   this._currentMousePosition.x = null;
        //   this._currentMousePosition.y = null;
        //   break;
      }
    }
  }

  updateValue(x, y, eventName) {
    const { orientation } = this;
    const position = orientation === 'horizontal' ? x : y;
    const value = this.screenScale.invert(position);
    const clippedValue = this.clipper(value);

    this.value = clippedValue;

    const event = new CustomEvent(eventName, {
      bubbles: true,
      composed: true,
      detail: { value: this.value },
    });

    this.requestUpdate();
    this.dispatchEvent(event);
  }
}

customElements.define('sw-slider', SwSlider);

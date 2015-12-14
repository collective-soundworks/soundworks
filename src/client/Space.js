// import client from './client';
// import ClientModule from './ClientModule';

// const ns = 'http://www.w3.org/2000/svg';

// /**
//  * [client] Render a set of positions (i.e. coordinates with optional labels) graphically.
//  *
//  * The module never has a view (it displays the graphical representation in a `div` passed in as an argument of the {@link Space#display} method).
//  *
//  * The module finishes its initialization immediately.
//  *
//  * @example const space = new Space();
//  * space.display(container);
//  */
// export default class Space extends ClientModule {
//   /**
//    * @param {Object} [options={}] Options.
//    * @param {String} [options.name='space'] Name of the module.
//    * @param {Boolean} [options.fitContainer=false] Indicates whether the graphical representation fits the container size or not.
//    * @param {Boolean} [options.listenTouchEvent=false] Indicates whether to setup a listener on the space graphical representation or not.
//    */
//   constructor(options = {}) {
//     super(options.name || 'space');

//     this._width = 10;
//     this._height = 10;

//     this._fitContainer = (options.fitContainer || false);
//     this._listenTouchEvent = (options.listenTouchEvent || false);

//     this._xFactor = 1;
//     this._yFactor = 1;

//     // map between shapes and their related positions
//     this._shapePositionMap = [];
//     this._positionIndexShapeMap = {};
//   }

//   /**
//    * Start the module.
//    * @private
//    */
//   start() {
//     super.start();
//     this.done();
//   }

//   /**
//    * Restart the module.
//    * @private
//    */
//   restart() {
//     super.restart();
//     this.done();
//   }

//   /**
//    * Reset the module.
//    * @private
//    */
//   reset() {
//     super.reset();
//     this._shapePositionMap = [];
//     this._positionIndexShapeMap = {};
//     this._container.innerHTML = '';
//   }

//   /**
//    * Display a graphical representation of the space.
//    * @param {DOMElement} container Container to append the representation to.
//    * @param {Array} positions List of positions to display.
//    * @param {Object} [options={}] Options.
//    * @param {String} [options.transform] Indicates which transformation to aply to the representation. Possible values are:
//    * - `'rotate180'`: rotates the representation by 180 degrees.
//    * @todo Big problem with the container (_container --> only one of them, while we should be able to use the display method on several containers)
//    */
//   display(container, options = {}) {
//     this._container = container;
//     this._container.classList.add('space');
//     this._renderingOptions = options;

//     this._width = options.width;
//     this._height = options.height;

//     if (options.background) {
//       this._container.style.backgroundImage = `url(${options.background})`;
//       this._container.style.backgroundPosition = '50% 50%';
//       this._container.style.backgroundRepeat = 'no-repeat';
//       this._container.style.backgroundSize = 'contain';
//     }

//     const svg = document.createElementNS(ns, 'svg');
//     const group = document.createElementNS(ns, 'g');

//     svg.appendChild(group);
//     this._container.appendChild(svg);

//     this._svg = svg;
//     this._group = group;

//     this.resize(this._container);

//     this.done();
//   }

//   /**
//    * Display an array of positions.
//    * @param {Object[]} positions Positions to display.
//    * @param {Number} size Size of the positions to display.
//    */
//   displayPositions(positions, size) {
//     // clean surface
//     this.removeAllPositions();

//     positions.forEach((position) => {
//       this.addPosition(position, size);
//     });

//     // add listeners
//     if (this._listenTouchEvent) {
//       this._container.addEventListener('touchstart', (e) => {
//         e.preventDefault();
//         const dots = this._shapePositionMap.map((entry) => { return entry.dot });
//         let target = e.target;

//         // Could probably be simplified...
//         while (target !== this._container) {
//           if (dots.indexOf(target) !== -1) {
//             for (let i = 0; i < this._shapePositionMap; i++) {
//               const entry = this._shapePositionMap[i];
//               if (target === entry.dot) {
//                 const position = entry.position;
//                 this.emit('select', position);
//               }
//             }
//           }

//           target = target.parentNode;
//         }
//       });
//     }
//   }

//   /**
//    * Adds a position to the display.
//    * @param {Object} position Position to add.
//    * @param {Number} size Size of the position to draw.
//    */
//   addPosition(position, size) {
//     const radius = size / 2;
//     const coordinates = position.coordinates;
//     const index = position.index;

//     const dot = document.createElementNS(ns, 'circle');
//     dot.setAttributeNS(null, 'r', radius / this._ratio);
//     dot.setAttributeNS(null, 'cx', coordinates[0] * this._width);
//     dot.setAttributeNS(null, 'cy', coordinates[1] * this._height);
//     dot.style.fill = 'steelblue';

//     this._group.appendChild(dot);
//     this._shapePositionMap.push({ dot, position });
//     this._positionIndexShapeMap[index] = dot;
//   }

//   /**
//    * Removes a position from the display.
//    * @param {Number} index of position to remove.
//    */
//   removePosition(index) {
//     const el = this._positionIndexShapeMap[index];
//     this._group.removeChild(el);
//   }

//   /**
//    * Remove all the positions displayed.
//    */
//   removeAllPositions() {
//     while (this._group.firstChild) {
//       this._group.removeChild(this._group.firstChild);
//     }
//   }

//   /**
//    * Resize the SVG element.
//    */
//   resize() {
//     const boundingRect = this._container.getBoundingClientRect();
//     const containerWidth = boundingRect.width;
//     const containerHeight = boundingRect.height;
//     // force adaptation to container size

//     const ratio = (() => {
//       return (this._width > this._height) ?
//         containerWidth / this._width :
//         containerHeight / this._height;
//     })();

//     let svgWidth = this._width * ratio;
//     let svgHeight = this._height * ratio;

//     if (this._fitContainer) {
//       svgWidth = containerWidth;
//       svgHeight = containerHeight;
//     }

//     const offsetLeft = (containerWidth - svgWidth) / 2;
//     const offsetTop = (containerHeight - svgHeight) / 2;

//     this._svg.setAttributeNS(null, 'width', svgWidth);
//     this._svg.setAttributeNS(null, 'height', svgHeight);
//      // use space coordinates
//     this._svg.setAttributeNS(null, 'viewBox', `0 0 ${this._width} ${this._height}`);
//     // center svg in container
//     this._svg.style.position = 'absolute';
//     this._svg.style.left = `${offsetLeft}px`;
//     this._svg.style.top = `${offsetTop}px`;

//     // apply rotations
//     if (this._renderingOptions.transform) {
//       switch (this._renderingOptions.transform) {
//         case 'rotate180':
//           this._container.setAttribute('data-xfactor', -1);
//           this._container.setAttribute('data-yfactor', -1);
//           // const transform = `rotate(180, ${svgWidth / 2}, ${svgHeight / 2})`;
//           const transform = 'rotate(180, 0.5, 0.5)';
//           this._group.setAttributeNS(null, 'transform', transform);
//           break;
//       }
//     }

//     /**
//      * Left offset of the SVG element.
//      * @type {Number}
//      */
//     this.svgOffsetLeft = offsetLeft;

//     /**
//      * Top offset of the SVG element.
//      * @type {Number}
//      */
//     this.svgOffsetTop = offsetTop;

//     /**
//      * Width of the SVG element.
//      * @type {Number}
//      */
//     this.svgWidth = svgWidth;

//     /**
//      * Height of the SVG element.
//      * @type {Number}
//      */
//     this.svgHeight = svgHeight;

//     this._ratio = ratio;
//   }
// }

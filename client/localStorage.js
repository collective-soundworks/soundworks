'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var namespace = 'soundworks';

exports['default'] = {
  set: function set(key, value) {
    window.localStorage.setItem(key, value);
  },

  get: function get(key) {
    return window.localStorage.getItem(key) || null;
  },

  'delete': function _delete(key) {
    window.localStorage.removeItem(key);
  },

  clear: function clear() {
    window.localStorage.clear();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvbG9jYWxTdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDOztxQkFFaEI7QUFDYixLQUFHLEVBQUEsYUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ2QsVUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ3pDOztBQUVELEtBQUcsRUFBQSxhQUFDLEdBQUcsRUFBRTtBQUNQLFdBQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDO0dBQ2pEOztBQUVELFlBQU0saUJBQUMsR0FBRyxFQUFFO0FBQ1YsVUFBTSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDckM7O0FBRUQsT0FBSyxFQUFBLGlCQUFHO0FBQ04sVUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsQ0FBQztHQUM3QjtDQUNGIiwiZmlsZSI6InNyYy9jbGllbnQvbG9jYWxTdG9yYWdlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbmFtZXNwYWNlID0gJ3NvdW5kd29ya3MnO1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIHNldChrZXksIHZhbHVlKSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5zZXRJdGVtKGtleSwgdmFsdWUpO1xuICB9LFxuXG4gIGdldChrZXkpIHtcbiAgICByZXR1cm4gd2luZG93LmxvY2FsU3RvcmFnZS5nZXRJdGVtKGtleSkgfHwgbnVsbDtcbiAgfSxcblxuICBkZWxldGUoa2V5KSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH0sXG5cbiAgY2xlYXIoKSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICB9LFxufSJdfQ==
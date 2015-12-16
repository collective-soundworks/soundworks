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
    return window.localStorage.getItem(key);
  },

  'delete': function _delete(key) {
    window.localStorage.removeItem(key);
  },

  clear: function clear() {
    window.localStorage.clear();
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvbG9jYWxTdG9yYWdlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTSxTQUFTLEdBQUcsWUFBWSxDQUFDOztxQkFFaEI7QUFDYixLQUFHLEVBQUEsYUFBQyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ2QsVUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQ3pDOztBQUVELEtBQUcsRUFBQSxhQUFDLEdBQUcsRUFBRTtBQUNQLFdBQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7R0FDekM7O0FBRUQsWUFBTSxpQkFBQyxHQUFHLEVBQUU7QUFDVixVQUFNLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNyQzs7QUFFRCxPQUFLLEVBQUEsaUJBQUc7QUFDTixVQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxDQUFDO0dBQzdCO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9sb2NhbFN0b3JhZ2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBuYW1lc3BhY2UgPSAnc291bmR3b3Jrcyc7XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgc2V0KGtleSwgdmFsdWUpIHtcbiAgICB3aW5kb3cubG9jYWxTdG9yYWdlLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG4gIH0sXG5cbiAgZ2V0KGtleSkge1xuICAgIHJldHVybiB3aW5kb3cubG9jYWxTdG9yYWdlLmdldEl0ZW0oa2V5KTtcbiAgfSxcblxuICBkZWxldGUoa2V5KSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKGtleSk7XG4gIH0sXG5cbiAgY2xlYXIoKSB7XG4gICAgd2luZG93LmxvY2FsU3RvcmFnZS5jbGVhcigpO1xuICB9LFxufSJdfQ==
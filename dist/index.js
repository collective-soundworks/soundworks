// import client from './client/index';
// import server from './server/index';

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports['default'] = function (side) {
  var mod = undefined;

  switch (side) {
    case 'server':
      mod = require('./server/index');
      break;
    case 'client':
      mod = require('./client/index');
      break;
  }

  return mod;
};

module.exports = exports['default'];
// export default { client, server };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7cUJBS2UsVUFBUyxJQUFJLEVBQUU7QUFDNUIsTUFBSSxHQUFHLFlBQUEsQ0FBQzs7QUFFUixVQUFRLElBQUk7QUFDVixTQUFLLFFBQVE7QUFDWCxTQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUE7QUFDL0IsWUFBTTtBQUFBLEFBQ1IsU0FBSyxRQUFRO0FBQ1gsU0FBRyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBQ2hDLFlBQU07QUFBQSxHQUNUOztBQUVELFNBQU8sR0FBRyxDQUFDO0NBQ1oiLCJmaWxlIjoic3JjL2luZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IGNsaWVudCBmcm9tICcuL2NsaWVudC9pbmRleCc7XG4vLyBpbXBvcnQgc2VydmVyIGZyb20gJy4vc2VydmVyL2luZGV4JztcblxuLy8gZXhwb3J0IGRlZmF1bHQgeyBjbGllbnQsIHNlcnZlciB9O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihzaWRlKSB7XG4gIGxldCBtb2Q7XG5cbiAgc3dpdGNoIChzaWRlKSB7XG4gICAgY2FzZSAnc2VydmVyJzpcbiAgICAgIG1vZCA9IHJlcXVpcmUoJy4vc2VydmVyL2luZGV4JylcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2NsaWVudCc6XG4gICAgICBtb2QgPSByZXF1aXJlKCcuL2NsaWVudC9pbmRleCcpO1xuICAgICAgYnJlYWs7XG4gIH1cblxuICByZXR1cm4gbW9kO1xufSJdfQ==
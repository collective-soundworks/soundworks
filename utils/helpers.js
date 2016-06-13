"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpt = getOpt;
function getOpt(opt, def) {
  var min = arguments.length <= 2 || arguments[2] === undefined ? -Infinity : arguments[2];
  var max = arguments.length <= 3 || arguments[3] === undefined ? Infinity : arguments[3];

  var val = opt;

  if (val === undefined) val = def;

  return Math.max(min, Math.min(max, val));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0IsTSxHQUFBLE07QUFBVCxTQUFTLE1BQVQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMkQ7QUFBQSxNQUFqQyxHQUFpQyx5REFBM0IsQ0FBQyxRQUEwQjtBQUFBLE1BQWhCLEdBQWdCLHlEQUFWLFFBQVU7O0FBQ2hFLE1BQUksTUFBTSxHQUFWOztBQUVBLE1BQUksUUFBUSxTQUFaLEVBQ0UsTUFBTSxHQUFOOztBQUVGLFNBQU8sS0FBSyxHQUFMLENBQVMsR0FBVCxFQUFjLEtBQUssR0FBTCxDQUFTLEdBQVQsRUFBYyxHQUFkLENBQWQsQ0FBUDtBQUNEIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0T3B0KG9wdCwgZGVmLCBtaW4gPSAtSW5maW5pdHksIG1heCA9IEluZmluaXR5KSB7XG4gIHZhciB2YWwgPSBvcHQ7XG5cbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKVxuICAgIHZhbCA9IGRlZjtcblxuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHZhbCkpO1xufTtcbiJdfQ==
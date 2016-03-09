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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7UUFBZ0I7QUFBVCxTQUFTLE1BQVQsQ0FBZ0IsR0FBaEIsRUFBcUIsR0FBckIsRUFBMkQ7TUFBakMsNERBQU0sQ0FBQyxRQUFELGdCQUEyQjtNQUFoQiw0REFBTSx3QkFBVTs7QUFDaEUsTUFBSSxNQUFNLEdBQU4sQ0FENEQ7O0FBR2hFLE1BQUksUUFBUSxTQUFSLEVBQ0YsTUFBTSxHQUFOLENBREY7O0FBR0EsU0FBTyxLQUFLLEdBQUwsQ0FBUyxHQUFULEVBQWMsS0FBSyxHQUFMLENBQVMsR0FBVCxFQUFjLEdBQWQsQ0FBZCxDQUFQLENBTmdFO0NBQTNEIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0T3B0KG9wdCwgZGVmLCBtaW4gPSAtSW5maW5pdHksIG1heCA9IEluZmluaXR5KSB7XG4gIHZhciB2YWwgPSBvcHQ7XG5cbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKVxuICAgIHZhbCA9IGRlZjtcblxuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHZhbCkpO1xufTtcbiJdfQ==
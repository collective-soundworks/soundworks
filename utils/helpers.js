"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOpt = getOpt;
function getOpt(opt, def) {
  var min = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : -Infinity;
  var max = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : Infinity;

  var val = opt;

  if (val === undefined) val = def;

  return Math.max(min, Math.min(max, val));
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwibmFtZXMiOlsiZ2V0T3B0Iiwib3B0IiwiZGVmIiwibWluIiwiSW5maW5pdHkiLCJtYXgiLCJ2YWwiLCJ1bmRlZmluZWQiLCJNYXRoIl0sIm1hcHBpbmdzIjoiOzs7OztRQUFnQkEsTSxHQUFBQSxNO0FBQVQsU0FBU0EsTUFBVCxDQUFnQkMsR0FBaEIsRUFBcUJDLEdBQXJCLEVBQTJEO0FBQUEsTUFBakNDLEdBQWlDLHVFQUEzQixDQUFDQyxRQUEwQjtBQUFBLE1BQWhCQyxHQUFnQix1RUFBVkQsUUFBVTs7QUFDaEUsTUFBSUUsTUFBTUwsR0FBVjs7QUFFQSxNQUFJSyxRQUFRQyxTQUFaLEVBQ0VELE1BQU1KLEdBQU47O0FBRUYsU0FBT00sS0FBS0gsR0FBTCxDQUFTRixHQUFULEVBQWNLLEtBQUtMLEdBQUwsQ0FBU0UsR0FBVCxFQUFjQyxHQUFkLENBQWQsQ0FBUDtBQUNEIiwiZmlsZSI6ImhlbHBlcnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2V0T3B0KG9wdCwgZGVmLCBtaW4gPSAtSW5maW5pdHksIG1heCA9IEluZmluaXR5KSB7XG4gIHZhciB2YWwgPSBvcHQ7XG5cbiAgaWYgKHZhbCA9PT0gdW5kZWZpbmVkKVxuICAgIHZhbCA9IGRlZjtcblxuICByZXR1cm4gTWF0aC5tYXgobWluLCBNYXRoLm1pbihtYXgsIHZhbCkpO1xufTtcbiJdfQ==
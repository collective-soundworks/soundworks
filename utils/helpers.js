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
}

;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy91dGlscy9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBTyxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFtQztNQUFqQyxHQUFHLHlEQUFHLENBQUMsUUFBUTtNQUFFLEdBQUcseURBQUcsUUFBUTs7QUFDOUQsTUFBSSxHQUFHLEdBQUcsR0FBRyxDQUFDOztBQUVkLE1BQUksR0FBRyxLQUFLLFNBQVMsRUFDbkIsR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFWixTQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7Q0FDMUM7O0FBQUEsQ0FBQyIsImZpbGUiOiJzcmMvdXRpbHMvaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBnZXRPcHQob3B0LCBkZWYsIG1pbiA9IC1JbmZpbml0eSwgbWF4ID0gSW5maW5pdHkpIHtcbiAgdmFyIHZhbCA9IG9wdDtcblxuICBpZiAodmFsID09PSB1bmRlZmluZWQpXG4gICAgdmFsID0gZGVmO1xuXG4gIHJldHVybiBNYXRoLm1heChtaW4sIE1hdGgubWluKG1heCwgdmFsKSk7XG59O1xuIl19
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvdXRpbHMvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQU8sU0FBUyxNQUFNLENBQUMsR0FBRyxFQUFFLEdBQUcsRUFBbUM7TUFBakMsR0FBRyx5REFBRyxDQUFDLFFBQVE7TUFBRSxHQUFHLHlEQUFHLFFBQVE7O0FBQzlELE1BQUksR0FBRyxHQUFHLEdBQUcsQ0FBQzs7QUFFZCxNQUFJLEdBQUcsS0FBSyxTQUFTLEVBQ25CLEdBQUcsR0FBRyxHQUFHLENBQUM7O0FBRVosU0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0NBQzFDOztBQUFBLENBQUMiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy91dGlscy9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGZ1bmN0aW9uIGdldE9wdChvcHQsIGRlZiwgbWluID0gLUluZmluaXR5LCBtYXggPSBJbmZpbml0eSkge1xuICB2YXIgdmFsID0gb3B0O1xuXG4gIGlmICh2YWwgPT09IHVuZGVmaW5lZClcbiAgICB2YWwgPSBkZWY7XG5cbiAgcmV0dXJuIE1hdGgubWF4KG1pbiwgTWF0aC5taW4obWF4LCB2YWwpKTtcbn07XG4iXX0=
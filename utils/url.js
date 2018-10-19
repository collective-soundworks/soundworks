'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalize = normalize;
exports.isValid = isValid;
// remove '// at the beginning or when NOT following ':'
var _doubleSlashReplaceExpression = '(^|[^:])(/+)';
var _doubleSlashReplaceRegExp = new RegExp(_doubleSlashReplaceExpression, 'g');

/**
 * Remove multiple slashes from URL, except after ':'. Note that it also removes
 * multiple slashes in the beginning of an URL (like in protocol-relative URL).
 *
 * 'https://co.si.ma/.//noextensio' -> 'https://co.si.ma/./noextension'
 * '///d e//multi.ple.ext.ensions' -> '/d e/multi.ple.ext.ensions'
 *
 * @param {String} url
 * @returns {String} url without multiple slashes
 */
function normalize(url) {
  return url.replace(_doubleSlashReplaceRegExp, '$1/');
}

// do not consider '://'
var _doubleSlashTestExpression = '(^|[^:])//';
var _doubleSlashTestRegExp = new RegExp(_doubleSlashTestExpression, 'g');

/**
 * Test for multiple slashes from URL, except after ':'.
 *
 * @param {String} url
 * @returns {Boolean} false if url contains '//', except '://'
 */
function isValid(url) {
  return url.match(_doubleSlashTestRegExp) === null;
}

exports.default = {
  normalize: normalize,
  isValid: isValid
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVybC5qcyJdLCJuYW1lcyI6WyJub3JtYWxpemUiLCJpc1ZhbGlkIiwiX2RvdWJsZVNsYXNoUmVwbGFjZUV4cHJlc3Npb24iLCJfZG91YmxlU2xhc2hSZXBsYWNlUmVnRXhwIiwiUmVnRXhwIiwidXJsIiwicmVwbGFjZSIsIl9kb3VibGVTbGFzaFRlc3RFeHByZXNzaW9uIiwiX2RvdWJsZVNsYXNoVGVzdFJlZ0V4cCIsIm1hdGNoIl0sIm1hcHBpbmdzIjoiOzs7OztRQWVnQkEsUyxHQUFBQSxTO1FBZUFDLE8sR0FBQUEsTztBQTlCaEI7QUFDQSxJQUFNQyxnQ0FBZ0MsY0FBdEM7QUFDQSxJQUFNQyw0QkFBNEIsSUFBSUMsTUFBSixDQUFXRiw2QkFBWCxFQUEwQyxHQUExQyxDQUFsQzs7QUFHQTs7Ozs7Ozs7OztBQVVPLFNBQVNGLFNBQVQsQ0FBbUJLLEdBQW5CLEVBQXdCO0FBQzdCLFNBQU9BLElBQUlDLE9BQUosQ0FBWUgseUJBQVosRUFBdUMsS0FBdkMsQ0FBUDtBQUNEOztBQUVEO0FBQ0EsSUFBTUksNkJBQTZCLFlBQW5DO0FBQ0EsSUFBTUMseUJBQXlCLElBQUlKLE1BQUosQ0FBV0csMEJBQVgsRUFBdUMsR0FBdkMsQ0FBL0I7O0FBR0E7Ozs7OztBQU1PLFNBQVNOLE9BQVQsQ0FBaUJJLEdBQWpCLEVBQXNCO0FBQzNCLFNBQU9BLElBQUlJLEtBQUosQ0FBVUQsc0JBQVYsTUFBc0MsSUFBN0M7QUFDRDs7a0JBRWM7QUFDYlIsc0JBRGE7QUFFYkM7QUFGYSxDIiwiZmlsZSI6InVybC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHJlbW92ZSAnLy8gYXQgdGhlIGJlZ2lubmluZyBvciB3aGVuIE5PVCBmb2xsb3dpbmcgJzonXG5jb25zdCBfZG91YmxlU2xhc2hSZXBsYWNlRXhwcmVzc2lvbiA9ICcoXnxbXjpdKSgvKyknO1xuY29uc3QgX2RvdWJsZVNsYXNoUmVwbGFjZVJlZ0V4cCA9IG5ldyBSZWdFeHAoX2RvdWJsZVNsYXNoUmVwbGFjZUV4cHJlc3Npb24sICdnJyk7XG5cblxuLyoqXG4gKiBSZW1vdmUgbXVsdGlwbGUgc2xhc2hlcyBmcm9tIFVSTCwgZXhjZXB0IGFmdGVyICc6Jy4gTm90ZSB0aGF0IGl0IGFsc28gcmVtb3Zlc1xuICogbXVsdGlwbGUgc2xhc2hlcyBpbiB0aGUgYmVnaW5uaW5nIG9mIGFuIFVSTCAobGlrZSBpbiBwcm90b2NvbC1yZWxhdGl2ZSBVUkwpLlxuICpcbiAqICdodHRwczovL2NvLnNpLm1hLy4vL25vZXh0ZW5zaW8nIC0+ICdodHRwczovL2NvLnNpLm1hLy4vbm9leHRlbnNpb24nXG4gKiAnLy8vZCBlLy9tdWx0aS5wbGUuZXh0LmVuc2lvbnMnIC0+ICcvZCBlL211bHRpLnBsZS5leHQuZW5zaW9ucydcbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gdXJsXG4gKiBAcmV0dXJucyB7U3RyaW5nfSB1cmwgd2l0aG91dCBtdWx0aXBsZSBzbGFzaGVzXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemUodXJsKSB7XG4gIHJldHVybiB1cmwucmVwbGFjZShfZG91YmxlU2xhc2hSZXBsYWNlUmVnRXhwLCAnJDEvJyk7XG59XG5cbi8vIGRvIG5vdCBjb25zaWRlciAnOi8vJ1xuY29uc3QgX2RvdWJsZVNsYXNoVGVzdEV4cHJlc3Npb24gPSAnKF58W146XSkvLyc7XG5jb25zdCBfZG91YmxlU2xhc2hUZXN0UmVnRXhwID0gbmV3IFJlZ0V4cChfZG91YmxlU2xhc2hUZXN0RXhwcmVzc2lvbiwgJ2cnKTtcblxuXG4vKipcbiAqIFRlc3QgZm9yIG11bHRpcGxlIHNsYXNoZXMgZnJvbSBVUkwsIGV4Y2VwdCBhZnRlciAnOicuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IHVybFxuICogQHJldHVybnMge0Jvb2xlYW59IGZhbHNlIGlmIHVybCBjb250YWlucyAnLy8nLCBleGNlcHQgJzovLydcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWQodXJsKSB7XG4gIHJldHVybiB1cmwubWF0Y2goX2RvdWJsZVNsYXNoVGVzdFJlZ0V4cCkgPT09IG51bGw7XG59XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbm9ybWFsaXplLFxuICBpc1ZhbGlkLFxufTtcbiJdfQ==
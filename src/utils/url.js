// remove '// at the beginning or when NOT following ':'
const _doubleSlashReplaceExpression = '(^|[^:])(/+)';
const _doubleSlashReplaceRegExp = new RegExp(_doubleSlashReplaceExpression, 'g');


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
export function normalize(url) {
  return url.replace(_doubleSlashReplaceRegExp, '$1/');
}

// do not consider '://'
const _doubleSlashTestExpression = '(^|[^:])//';
const _doubleSlashTestRegExp = new RegExp(_doubleSlashTestExpression, 'g');


/**
 * Test for multiple slashes from URL, except after ':'.
 *
 * @param {String} url
 * @returns {Boolean} false if url contains '//', except '://'
 */
export function isValid(url) {
  return url.match(_doubleSlashTestRegExp) === null;
}

export default {
  normalize,
  isValid,
};

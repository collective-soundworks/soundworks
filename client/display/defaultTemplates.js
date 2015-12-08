// import templateGenerator from './templateGenerator';

/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 *
 * These template are internally parsed using `lodash.template`, see [https://lodash.com/docs#template](https://lodash.com/docs#template) for more information.
 *
 * @type {Object}
 */
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = {
  welcome: "\n    <div class=\"centered-content\">\n      <% if (error) { %>\n        <p><%- error %></p>\n      <% } else { %>\n        <p><%- welcome %> <b><%- _globals.appName %></b>,</p>\n        <p><%- touchScreen %></p>\n      <% } %>\n    </div>\n  ",

  loader: "\n    <div class=\"centered-content soft-blink\">\n      <p><%- loading %></p>\n      <% if (showProgress) { %>\n      <div class=\"progress-wrap\">\n        <div class=\"progress-bar\" id=\"progress-bar\"></div>\n      </div>\n      <% } %>\n    </div>\n  "
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQVNlO0FBQ2IsU0FBTyx3UEFTTjs7QUFFRCxRQUFNLHFRQVNMO0NBQ0YiLCJmaWxlIjoic3JjL2NsaWVudC9kaXNwbGF5L2RlZmF1bHRUZW1wbGF0ZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgdGVtcGxhdGVHZW5lcmF0b3IgZnJvbSAnLi90ZW1wbGF0ZUdlbmVyYXRvcic7XG5cbi8qKlxuICogVGhlIGRlZmF1bHQgdGVtcGxhdGVzIGZvciB0aGUgc2hpcHBlZCBtb2R1bGVzLiBUaGUgdGVtcGxhdGVzIGFyZSBvcmdhbml6ZWQgYWNjb3JkaW5nIHRvIHRoZSBgTW9kdWxlLm5hbWVgIHByb3BlcnR5LlxuICpcbiAqIFRoZXNlIHRlbXBsYXRlIGFyZSBpbnRlcm5hbGx5IHBhcnNlZCB1c2luZyBgbG9kYXNoLnRlbXBsYXRlYCwgc2VlIFtodHRwczovL2xvZGFzaC5jb20vZG9jcyN0ZW1wbGF0ZV0oaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjdGVtcGxhdGUpIGZvciBtb3JlIGluZm9ybWF0aW9uLlxuICpcbiAqIEB0eXBlIHtPYmplY3R9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IHtcbiAgd2VsY29tZTogYFxuICAgIDxkaXYgY2xhc3M9XCJjZW50ZXJlZC1jb250ZW50XCI+XG4gICAgICA8JSBpZiAoZXJyb3IpIHsgJT5cbiAgICAgICAgPHA+PCUtIGVycm9yICU+PC9wPlxuICAgICAgPCUgfSBlbHNlIHsgJT5cbiAgICAgICAgPHA+PCUtIHdlbGNvbWUgJT4gPGI+PCUtIF9nbG9iYWxzLmFwcE5hbWUgJT48L2I+LDwvcD5cbiAgICAgICAgPHA+PCUtIHRvdWNoU2NyZWVuICU+PC9wPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICBgLFxuXG4gIGxvYWRlcjogYFxuICAgIDxkaXYgY2xhc3M9XCJjZW50ZXJlZC1jb250ZW50IHNvZnQtYmxpbmtcIj5cbiAgICAgIDxwPjwlLSBsb2FkaW5nICU+PC9wPlxuICAgICAgPCUgaWYgKHNob3dQcm9ncmVzcykgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLXdyYXBcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzLWJhclwiIGlkPVwicHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcbn07Il19
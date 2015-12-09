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
  welcome: "\n    <div class=\"centered-content\">\n      <% if (error) { %>\n        <p><%= error %></p>\n      <% } else { %>\n        <p><%= welcome %> <b><%= _globals.appName %></b>,</p>\n        <p><%= touchScreen %></p>\n      <% } %>\n    </div>\n  ",

  loader: "\n    <div class=\"centered-content soft-blink\">\n      <p><%= loading %></p>\n      <% if (showProgress) { %>\n      <div class=\"progress-wrap\">\n        <div class=\"progress-bar\" id=\"progress-bar\"></div>\n      </div>\n      <% } %>\n    </div>\n  ",

  checkin: "\n    <div class=\"centered-content\">\n      <% if (waiting) { %>\n        <p><%= wait %></p>\n      <% } else { %>\n        <% if (label) { %>\n          <p><%= labelPrefix %></p>\n          <div class=\"checkin-label circled\"><span><%= label %></span></div>\n          <p><small><%= labelPostfix %></small></p>\n        <% } else { %>\n          <p><%= error %></p>\n        <% } %>\n      <% } %>\n    </div>\n  "
};
module.exports = exports["default"];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9jbGllbnQvZGlzcGxheS9kZWZhdWx0VGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O3FCQVNlO0FBQ2IsU0FBTyx3UEFTTjs7QUFFRCxRQUFNLHFRQVNMOztBQUVELFNBQU8scWFBY047Q0FDRiIsImZpbGUiOiJzcmMvY2xpZW50L2Rpc3BsYXkvZGVmYXVsdFRlbXBsYXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCB0ZW1wbGF0ZUdlbmVyYXRvciBmcm9tICcuL3RlbXBsYXRlR2VuZXJhdG9yJztcblxuLyoqXG4gKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZXMgZm9yIHRoZSBzaGlwcGVkIG1vZHVsZXMuIFRoZSB0ZW1wbGF0ZXMgYXJlIG9yZ2FuaXplZCBhY2NvcmRpbmcgdG8gdGhlIGBNb2R1bGUubmFtZWAgcHJvcGVydHkuXG4gKlxuICogVGhlc2UgdGVtcGxhdGUgYXJlIGludGVybmFsbHkgcGFyc2VkIHVzaW5nIGBsb2Rhc2gudGVtcGxhdGVgLCBzZWUgW2h0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3RlbXBsYXRlXShodHRwczovL2xvZGFzaC5jb20vZG9jcyN0ZW1wbGF0ZSkgZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICB3ZWxjb21lOiBgXG4gICAgPGRpdiBjbGFzcz1cImNlbnRlcmVkLWNvbnRlbnRcIj5cbiAgICAgIDwlIGlmIChlcnJvcikgeyAlPlxuICAgICAgICA8cD48JT0gZXJyb3IgJT48L3A+XG4gICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICA8cD48JT0gd2VsY29tZSAlPiA8Yj48JT0gX2dsb2JhbHMuYXBwTmFtZSAlPjwvYj4sPC9wPlxuICAgICAgICA8cD48JT0gdG91Y2hTY3JlZW4gJT48L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIGAsXG5cbiAgbG9hZGVyOiBgXG4gICAgPGRpdiBjbGFzcz1cImNlbnRlcmVkLWNvbnRlbnQgc29mdC1ibGlua1wiPlxuICAgICAgPHA+PCU9IGxvYWRpbmcgJT48L3A+XG4gICAgICA8JSBpZiAoc2hvd1Byb2dyZXNzKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3Mtd3JhcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCIgaWQ9XCJwcm9ncmVzcy1iYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICBgLFxuXG4gIGNoZWNraW46IGBcbiAgICA8ZGl2IGNsYXNzPVwiY2VudGVyZWQtY29udGVudFwiPlxuICAgICAgPCUgaWYgKHdhaXRpbmcpIHsgJT5cbiAgICAgICAgPHA+PCU9IHdhaXQgJT48L3A+XG4gICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICA8JSBpZiAobGFiZWwpIHsgJT5cbiAgICAgICAgICA8cD48JT0gbGFiZWxQcmVmaXggJT48L3A+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNoZWNraW4tbGFiZWwgY2lyY2xlZFwiPjxzcGFuPjwlPSBsYWJlbCAlPjwvc3Bhbj48L2Rpdj5cbiAgICAgICAgICA8cD48c21hbGw+PCU9IGxhYmVsUG9zdGZpeCAlPjwvc21hbGw+PC9wPlxuICAgICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICAgIDxwPjwlPSBlcnJvciAlPjwvcD5cbiAgICAgICAgPCUgfSAlPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICBgLFxufTsiXX0=
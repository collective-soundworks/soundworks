'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * The default view templates for the services. Each key correspond
 * to the `id` attribute of the activity it is associated to.
 *
 * The view templates are internally parsed using the `lodash.template` system,
 * see [https://lodash.com/docs#template]{@link https://lodash.com/docs#template}
 * for more information.
 * Each variable used inside a given template is declared inside the
 * [`defaultContent`]{@link module:soundworks/client.defaultContent} inside
 * an object with the same key.
 *
 * These default templates can be overriden by passing an object to the
 * [`client.setViewTemplateDefinitions`]{@link module:soundworks/client.client.setViewTemplateDefinitions}
 * method.
 *
 * @namespace
 * @memberof module:soundworks/client
 *
 * @see {@link module:soundworks/client.defaultViewContent}
 * @see {@link module:soundworks/client.client}
 * @see {@link https://lodash.com/docs#template}
 */
var defaultViewTemplates = {
  /**
   * Default template of the `checkin` service.
   * @type {String}
   */
  'service:checkin': '\n    <% if (label) { %>\n      <div class="section-top flex-middle">\n        <p class="big"><%= labelPrefix %></p>\n      </div>\n      <div class="section-center flex-center">\n        <div class="checkin-label">\n          <p class="huge bold"><%= label %></p></div>\n      </div>\n      <div class="section-bottom flex-middle">\n        <p class="small"><%= labelPostfix %></p>\n      </div>\n    <% } else { %>\n      <div class="section-top"></div>\n      <div class="section-center flex-center">\n        <p><%= error ? errorMessage : wait %></p>\n      </div>\n      <div class="section-bottom"></div>\n    <% } %>\n  ',

  /**
   * Default template of the `loader` service.
   * @type {String}
   */
  'service:loader': '\n    <div class="section-top flex-middle">\n      <p><%= loading %></p>\n    </div>\n    <div class="section-center flex-center">\n      <% if (showProgress) { %>\n      <div class="progress-wrap">\n        <div class="progress-bar"></div>\n      </div>\n      <% } %>\n    </div>\n    <div class="section-bottom"></div>\n  ',

  /**
   * Default template of the `locator` service.
   * @type {String}
   */
  'service:locator': '\n    <div class="section-square"></div>\n    <div class="section-float flex-middle">\n      <% if (!showBtn) { %>\n        <p class="small"><%= instructions %></p>\n      <% } else { %>\n        <button class="btn"><%= send %></button>\n      <% } %>\n    </div>\n  ',

  /**
   * Default template of the `placer` service.
   * @type {String}
   */
  'service:placer': '\n    <div class="section-square<%= mode === \'list\' ? \' flex-middle\' : \'\' %>">\n      <% if (rejected) { %>\n      <div class="fit-container flex-middle"><p><%= reject %></p></div>\n      <% } %>\n    </div>\n    <div class="section-float flex-middle">\n      <% if (!rejected) { %>\n        <% if (mode === \'graphic\') { %>\n          <p><%= instructions %></p>\n        <% } else if (mode === \'list\') { %>\n          <% if (showBtn) { %>\n            <button class="btn"><%= send %></button>\n          <% } %>\n        <% } %>\n      <% } %>\n    </div>\n  ',

  /**
   * Default template of the `platform` service.
   * @type {String}
   */
  'service:platform': '\n    <% if (!isCompatible) { %>\n      <div class="section-top"></div>\n      <div class="section-center flex-center">\n        <p><%= errorMessage %></p>\n      </div>\n      <div class="section-bottom"></div>\n    <% } else { %>\n      <div class="section-top flex-middle"></div>\n      <div class="section-center flex-center">\n          <p class="big">\n            <%= intro %>\n            <br />\n            <b><%= globals.appName %></b>\n          </p>\n      </div>\n      <div class="section-bottom flex-middle">\n        <p class="small soft-blink"><%= instructions %></p>\n      </div>\n    <% } %>\n  ',

  /**
   * Default template of the `sync` service.
   * @type {String}
   */
  'service:sync': '\n    <div class="section-top"></div>\n    <div class="section-center flex-center">\n      <p class="soft-blink"><%= wait %></p>\n    </div>\n    <div class="section-bottom"></div>\n  ',

  /** @private */
  survey: '\n    <div class="section-top">\n      <% if (counter <= length) { %>\n        <p class="counter"><%= counter %> / <%= length %></p>\n      <% } %>\n    </div>\n    <% if (counter > length) { %>\n      <div class="section-center flex-center">\n        <p class="big"><%= thanks %></p>\n      </div>\n    <% } else { %>\n      <div class="section-center"></div>\n    <% } %>\n    <div class="section-bottom flex-middle">\n      <% if (counter < length) { %>\n        <button class="btn"><%= next %></button>\n      <% } else if (counter === length) { %>\n        <button class="btn"><%= validate %></button>\n      <% } %>\n    </div>\n  '
};

exports.default = defaultViewTemplates;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRWaWV3VGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxJQUFNLHVCQUF1Qjs7Ozs7QUFLM0IsMG9CQUwyQjs7Ozs7O0FBOEIzQiwyVkE5QjJCOzs7Ozs7QUFnRDNCLGtTQWhEMkI7Ozs7OztBQStEM0IsK2tCQS9EMkI7Ozs7OztBQXNGM0IsZ29CQXRGMkI7Ozs7OztBQWdIM0IsNE1BaEgyQjs7O0FBeUgzQix5b0JBekgyQjtDQUF2Qjs7a0JBZ0pTIiwiZmlsZSI6ImRlZmF1bHRWaWV3VGVtcGxhdGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBUaGUgZGVmYXVsdCB2aWV3IHRlbXBsYXRlcyBmb3IgdGhlIHNlcnZpY2VzLiBFYWNoIGtleSBjb3JyZXNwb25kXG4gKiB0byB0aGUgYGlkYCBhdHRyaWJ1dGUgb2YgdGhlIGFjdGl2aXR5IGl0IGlzIGFzc29jaWF0ZWQgdG8uXG4gKlxuICogVGhlIHZpZXcgdGVtcGxhdGVzIGFyZSBpbnRlcm5hbGx5IHBhcnNlZCB1c2luZyB0aGUgYGxvZGFzaC50ZW1wbGF0ZWAgc3lzdGVtLFxuICogc2VlIFtodHRwczovL2xvZGFzaC5jb20vZG9jcyN0ZW1wbGF0ZV17QGxpbmsgaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjdGVtcGxhdGV9XG4gKiBmb3IgbW9yZSBpbmZvcm1hdGlvbi5cbiAqIEVhY2ggdmFyaWFibGUgdXNlZCBpbnNpZGUgYSBnaXZlbiB0ZW1wbGF0ZSBpcyBkZWNsYXJlZCBpbnNpZGUgdGhlXG4gKiBbYGRlZmF1bHRDb250ZW50YF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmRlZmF1bHRDb250ZW50fSBpbnNpZGVcbiAqIGFuIG9iamVjdCB3aXRoIHRoZSBzYW1lIGtleS5cbiAqXG4gKiBUaGVzZSBkZWZhdWx0IHRlbXBsYXRlcyBjYW4gYmUgb3ZlcnJpZGVuIGJ5IHBhc3NpbmcgYW4gb2JqZWN0IHRvIHRoZVxuICogW2BjbGllbnQuc2V0Vmlld1RlbXBsYXRlRGVmaW5pdGlvbnNgXXtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuY2xpZW50LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zfVxuICogbWV0aG9kLlxuICpcbiAqIEBuYW1lc3BhY2VcbiAqIEBtZW1iZXJvZiBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnRcbiAqXG4gKiBAc2VlIHtAbGluayBtb2R1bGU6c291bmR3b3Jrcy9jbGllbnQuZGVmYXVsdFZpZXdDb250ZW50fVxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudH1cbiAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3RlbXBsYXRlfVxuICovXG5jb25zdCBkZWZhdWx0Vmlld1RlbXBsYXRlcyA9IHtcbiAgLyoqXG4gICAqIERlZmF1bHQgdGVtcGxhdGUgb2YgdGhlIGBjaGVja2luYCBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgJ3NlcnZpY2U6Y2hlY2tpbic6IGBcbiAgICA8JSBpZiAobGFiZWwpIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPlxuICAgICAgICA8cCBjbGFzcz1cImJpZ1wiPjwlPSBsYWJlbFByZWZpeCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJjaGVja2luLWxhYmVsXCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJodWdlIGJvbGRcIj48JT0gbGFiZWwgJT48L3A+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPlxuICAgICAgICA8cCBjbGFzcz1cInNtYWxsXCI+PCU9IGxhYmVsUG9zdGZpeCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwlIH0gZWxzZSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgICA8cD48JT0gZXJyb3IgPyBlcnJvck1lc3NhZ2UgOiB3YWl0ICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgICA8JSB9ICU+XG4gIGAsXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdGVtcGxhdGUgb2YgdGhlIGBsb2FkZXJgIHNlcnZpY2UuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICAnc2VydmljZTpsb2FkZXInOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8cD48JT0gbG9hZGluZyAlPjwvcD5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgIDwlIGlmIChzaG93UHJvZ3Jlc3MpIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy13cmFwXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIj48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuICBgLFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSBgbG9jYXRvcmAgc2VydmljZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gICdzZXJ2aWNlOmxvY2F0b3InOiBgXG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tc3F1YXJlXCI+PC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmICghc2hvd0J0bikgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cInNtYWxsXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICAgIDwlIH0gZWxzZSB7ICU+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIj48JT0gc2VuZCAlPjwvYnV0dG9uPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICBgLFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSBgcGxhY2VyYCBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgJ3NlcnZpY2U6cGxhY2VyJzogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZTwlPSBtb2RlID09PSAnbGlzdCcgPyAnIGZsZXgtbWlkZGxlJyA6ICcnICU+XCI+XG4gICAgICA8JSBpZiAocmVqZWN0ZWQpIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJmaXQtY29udGFpbmVyIGZsZXgtbWlkZGxlXCI+PHA+PCU9IHJlamVjdCAlPjwvcD48L2Rpdj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1mbG9hdCBmbGV4LW1pZGRsZVwiPlxuICAgICAgPCUgaWYgKCFyZWplY3RlZCkgeyAlPlxuICAgICAgICA8JSBpZiAobW9kZSA9PT0gJ2dyYXBoaWMnKSB7ICU+XG4gICAgICAgICAgPHA+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICAgICAgPCUgfSBlbHNlIGlmIChtb2RlID09PSAnbGlzdCcpIHsgJT5cbiAgICAgICAgICA8JSBpZiAoc2hvd0J0bikgeyAlPlxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBzZW5kICU+PC9idXR0b24+XG4gICAgICAgICAgPCUgfSAlPlxuICAgICAgICA8JSB9ICU+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIGAsXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdGVtcGxhdGUgb2YgdGhlIGBwbGF0Zm9ybWAgc2VydmljZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gICdzZXJ2aWNlOnBsYXRmb3JtJzogYFxuICAgIDwlIGlmICghaXNDb21wYXRpYmxlKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgICA8cD48JT0gZXJyb3JNZXNzYWdlICU+PC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wIGZsZXgtbWlkZGxlXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgICAgICA8cCBjbGFzcz1cImJpZ1wiPlxuICAgICAgICAgICAgPCU9IGludHJvICU+XG4gICAgICAgICAgICA8YnIgLz5cbiAgICAgICAgICAgIDxiPjwlPSBnbG9iYWxzLmFwcE5hbWUgJT48L2I+XG4gICAgICAgICAgPC9wPlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbCBzb2Z0LWJsaW5rXCI+PCU9IGluc3RydWN0aW9ucyAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwlIH0gJT5cbiAgYCxcblxuICAvKipcbiAgICogRGVmYXVsdCB0ZW1wbGF0ZSBvZiB0aGUgYHN5bmNgIHNlcnZpY2UuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICAnc2VydmljZTpzeW5jJzogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgPHAgY2xhc3M9XCJzb2Z0LWJsaW5rXCI+PCU9IHdhaXQgJT48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG4gIGAsXG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHN1cnZleTogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcFwiPlxuICAgICAgPCUgaWYgKGNvdW50ZXIgPD0gbGVuZ3RoKSB7ICU+XG4gICAgICAgIDxwIGNsYXNzPVwiY291bnRlclwiPjwlPSBjb3VudGVyICU+IC8gPCU9IGxlbmd0aCAlPjwvcD5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgICA8JSBpZiAoY291bnRlciA+IGxlbmd0aCkgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICAgIDxwIGNsYXNzPVwiYmlnXCI+PCU9IHRoYW5rcyAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgIDwlIH0gZWxzZSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXJcIj48L2Rpdj5cbiAgICA8JSB9ICU+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoY291bnRlciA8IGxlbmd0aCkgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IG5leHQgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gZWxzZSBpZiAoY291bnRlciA9PT0gbGVuZ3RoKSB7ICU+XG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIj48JT0gdmFsaWRhdGUgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRWaWV3VGVtcGxhdGVzO1xuIl19
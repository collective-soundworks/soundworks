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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlZmF1bHRWaWV3VGVtcGxhdGVzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXNCQSxJQUFNLHVCQUF1Qjs7Ozs7QUFLM0IsMG9CQUwyQjs7Ozs7O0FBOEIzQiwyVkE5QjJCOzs7Ozs7QUFnRDNCLGtTQWhEMkI7Ozs7OztBQStEM0IsK2tCQS9EMkI7Ozs7OztBQXNGM0IsZ29CQXRGMkI7Ozs7OztBQWdIM0IsNE1BaEgyQjs7O0FBeUgzQjtBQXpIMkIsQ0FBN0I7O2tCQWdKZSxvQiIsImZpbGUiOiJkZWZhdWx0Vmlld1RlbXBsYXRlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhlIGRlZmF1bHQgdmlldyB0ZW1wbGF0ZXMgZm9yIHRoZSBzZXJ2aWNlcy4gRWFjaCBrZXkgY29ycmVzcG9uZFxuICogdG8gdGhlIGBpZGAgYXR0cmlidXRlIG9mIHRoZSBhY3Rpdml0eSBpdCBpcyBhc3NvY2lhdGVkIHRvLlxuICpcbiAqIFRoZSB2aWV3IHRlbXBsYXRlcyBhcmUgaW50ZXJuYWxseSBwYXJzZWQgdXNpbmcgdGhlIGBsb2Rhc2gudGVtcGxhdGVgIHN5c3RlbSxcbiAqIHNlZSBbaHR0cHM6Ly9sb2Rhc2guY29tL2RvY3MjdGVtcGxhdGVde0BsaW5rIGh0dHBzOi8vbG9kYXNoLmNvbS9kb2NzI3RlbXBsYXRlfVxuICogZm9yIG1vcmUgaW5mb3JtYXRpb24uXG4gKiBFYWNoIHZhcmlhYmxlIHVzZWQgaW5zaWRlIGEgZ2l2ZW4gdGVtcGxhdGUgaXMgZGVjbGFyZWQgaW5zaWRlIHRoZVxuICogW2BkZWZhdWx0Q29udGVudGBde0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5kZWZhdWx0Q29udGVudH0gaW5zaWRlXG4gKiBhbiBvYmplY3Qgd2l0aCB0aGUgc2FtZSBrZXkuXG4gKlxuICogVGhlc2UgZGVmYXVsdCB0ZW1wbGF0ZXMgY2FuIGJlIG92ZXJyaWRlbiBieSBwYXNzaW5nIGFuIG9iamVjdCB0byB0aGVcbiAqIFtgY2xpZW50LnNldFZpZXdUZW1wbGF0ZURlZmluaXRpb25zYF17QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmNsaWVudC5zZXRWaWV3VGVtcGxhdGVEZWZpbml0aW9uc31cbiAqIG1ldGhvZC5cbiAqXG4gKiBAbmFtZXNwYWNlXG4gKiBAbWVtYmVyb2YgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50XG4gKlxuICogQHNlZSB7QGxpbmsgbW9kdWxlOnNvdW5kd29ya3MvY2xpZW50LmRlZmF1bHRWaWV3Q29udGVudH1cbiAqIEBzZWUge0BsaW5rIG1vZHVsZTpzb3VuZHdvcmtzL2NsaWVudC5jbGllbnR9XG4gKiBAc2VlIHtAbGluayBodHRwczovL2xvZGFzaC5jb20vZG9jcyN0ZW1wbGF0ZX1cbiAqL1xuY29uc3QgZGVmYXVsdFZpZXdUZW1wbGF0ZXMgPSB7XG4gIC8qKlxuICAgKiBEZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSBgY2hlY2tpbmAgc2VydmljZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gICdzZXJ2aWNlOmNoZWNraW4nOiBgXG4gICAgPCUgaWYgKGxhYmVsKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3AgZmxleC1taWRkbGVcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJiaWdcIj48JT0gbGFiZWxQcmVmaXggJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tpbi1sYWJlbFwiPlxuICAgICAgICAgIDxwIGNsYXNzPVwiaHVnZSBib2xkXCI+PCU9IGxhYmVsICU+PC9wPjwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b20gZmxleC1taWRkbGVcIj5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPjwlPSBsYWJlbFBvc3RmaXggJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgICAgPHA+PCU9IGVycm9yID8gZXJyb3JNZXNzYWdlIDogd2FpdCAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG4gICAgPCUgfSAlPlxuICBgLFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSBgbG9hZGVyYCBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgJ3NlcnZpY2U6bG9hZGVyJzogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPlxuICAgICAgPHA+PCU9IGxvYWRpbmcgJT48L3A+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICA8JSBpZiAoc2hvd1Byb2dyZXNzKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3Mtd3JhcFwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwicHJvZ3Jlc3MtYmFyXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1ib3R0b21cIj48L2Rpdj5cbiAgYCxcblxuICAvKipcbiAgICogRGVmYXVsdCB0ZW1wbGF0ZSBvZiB0aGUgYGxvY2F0b3JgIHNlcnZpY2UuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICAnc2VydmljZTpsb2NhdG9yJzogYFxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXNxdWFyZVwiPjwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWZsb2F0IGZsZXgtbWlkZGxlXCI+XG4gICAgICA8JSBpZiAoIXNob3dCdG4pIHsgJT5cbiAgICAgICAgPHAgY2xhc3M9XCJzbWFsbFwiPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gICAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IHNlbmQgJT48L2J1dHRvbj5cbiAgICAgIDwlIH0gJT5cbiAgICA8L2Rpdj5cbiAgYCxcblxuICAvKipcbiAgICogRGVmYXVsdCB0ZW1wbGF0ZSBvZiB0aGUgYHBsYWNlcmAgc2VydmljZS5cbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gICdzZXJ2aWNlOnBsYWNlcic6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1zcXVhcmU8JT0gbW9kZSA9PT0gJ2xpc3QnID8gJyBmbGV4LW1pZGRsZScgOiAnJyAlPlwiPlxuICAgICAgPCUgaWYgKHJlamVjdGVkKSB7ICU+XG4gICAgICA8ZGl2IGNsYXNzPVwiZml0LWNvbnRhaW5lciBmbGV4LW1pZGRsZVwiPjxwPjwlPSByZWplY3QgJT48L3A+PC9kaXY+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tZmxvYXQgZmxleC1taWRkbGVcIj5cbiAgICAgIDwlIGlmICghcmVqZWN0ZWQpIHsgJT5cbiAgICAgICAgPCUgaWYgKG1vZGUgPT09ICdncmFwaGljJykgeyAlPlxuICAgICAgICAgIDxwPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gICAgICAgIDwlIH0gZWxzZSBpZiAobW9kZSA9PT0gJ2xpc3QnKSB7ICU+XG4gICAgICAgICAgPCUgaWYgKHNob3dCdG4pIHsgJT5cbiAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG5cIj48JT0gc2VuZCAlPjwvYnV0dG9uPlxuICAgICAgICAgIDwlIH0gJT5cbiAgICAgICAgPCUgfSAlPlxuICAgICAgPCUgfSAlPlxuICAgIDwvZGl2PlxuICBgLFxuXG4gIC8qKlxuICAgKiBEZWZhdWx0IHRlbXBsYXRlIG9mIHRoZSBgcGxhdGZvcm1gIHNlcnZpY2UuXG4gICAqIEB0eXBlIHtTdHJpbmd9XG4gICAqL1xuICAnc2VydmljZTpwbGF0Zm9ybSc6IGBcbiAgICA8JSBpZiAoIWlzQ29tcGF0aWJsZSkgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tdG9wXCI+PC9kaXY+XG4gICAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgICAgPHA+PCU9IGVycm9yTWVzc2FnZSAlPjwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tXCI+PC9kaXY+XG4gICAgPCUgfSBlbHNlIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLXRvcCBmbGV4LW1pZGRsZVwiPjwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyIGZsZXgtY2VudGVyXCI+XG4gICAgICAgICAgPHAgY2xhc3M9XCJiaWdcIj5cbiAgICAgICAgICAgIDwlPSBpbnRybyAlPlxuICAgICAgICAgICAgPGJyIC8+XG4gICAgICAgICAgICA8Yj48JT0gZ2xvYmFscy5hcHBOYW1lICU+PC9iPlxuICAgICAgICAgIDwvcD5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tYm90dG9tIGZsZXgtbWlkZGxlXCI+XG4gICAgICAgIDxwIGNsYXNzPVwic21hbGwgc29mdC1ibGlua1wiPjwlPSBpbnN0cnVjdGlvbnMgJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8JSB9ICU+XG4gIGAsXG5cbiAgLyoqXG4gICAqIERlZmF1bHQgdGVtcGxhdGUgb2YgdGhlIGBzeW5jYCBzZXJ2aWNlLlxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgJ3NlcnZpY2U6c3luYyc6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj48L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi1jZW50ZXIgZmxleC1jZW50ZXJcIj5cbiAgICAgIDxwIGNsYXNzPVwic29mdC1ibGlua1wiPjwlPSB3YWl0ICU+PC9wPlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbVwiPjwvZGl2PlxuICBgLFxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBzdXJ2ZXk6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2VjdGlvbi10b3BcIj5cbiAgICAgIDwlIGlmIChjb3VudGVyIDw9IGxlbmd0aCkgeyAlPlxuICAgICAgICA8cCBjbGFzcz1cImNvdW50ZXJcIj48JT0gY291bnRlciAlPiAvIDwlPSBsZW5ndGggJT48L3A+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gICAgPCUgaWYgKGNvdW50ZXIgPiBsZW5ndGgpIHsgJT5cbiAgICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWNlbnRlciBmbGV4LWNlbnRlclwiPlxuICAgICAgICA8cCBjbGFzcz1cImJpZ1wiPjwlPSB0aGFua3MgJT48L3A+XG4gICAgICA8L2Rpdj5cbiAgICA8JSB9IGVsc2UgeyAlPlxuICAgICAgPGRpdiBjbGFzcz1cInNlY3Rpb24tY2VudGVyXCI+PC9kaXY+XG4gICAgPCUgfSAlPlxuICAgIDxkaXYgY2xhc3M9XCJzZWN0aW9uLWJvdHRvbSBmbGV4LW1pZGRsZVwiPlxuICAgICAgPCUgaWYgKGNvdW50ZXIgPCBsZW5ndGgpIHsgJT5cbiAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiPjwlPSBuZXh0ICU+PC9idXR0b24+XG4gICAgICA8JSB9IGVsc2UgaWYgKGNvdW50ZXIgPT09IGxlbmd0aCkgeyAlPlxuICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCI+PCU9IHZhbGlkYXRlICU+PC9idXR0b24+XG4gICAgICA8JSB9ICU+XG4gICAgPC9kaXY+XG4gIGAsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0Vmlld1RlbXBsYXRlcztcbiJdfQ==
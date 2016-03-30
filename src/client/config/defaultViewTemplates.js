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
const defaultViewTemplates = {
  /**
   * Default template of the `checkin` service.
   * @type {String}
   */
  'service:checkin': `
    <% if (label) { %>
      <div class="section-top flex-middle">
        <p class="big"><%= labelPrefix %></p>
      </div>
      <div class="section-center flex-center">
        <div class="checkin-label">
          <p class="huge bold"><%= label %></p></div>
      </div>
      <div class="section-bottom flex-middle">
        <p class="small"><%= labelPostfix %></p>
      </div>
    <% } else { %>
      <div class="section-top"></div>
      <div class="section-center flex-center">
        <p><%= error ? errorMessage : wait %></p>
      </div>
      <div class="section-bottom"></div>
    <% } %>
  `,

  /**
   * Default template of the `loader` service.
   * @type {String}
   */
  'service:loader': `
    <div class="section-top flex-middle">
      <p><%= loading %></p>
    </div>
    <div class="section-center flex-center">
      <% if (showProgress) { %>
      <div class="progress-wrap">
        <div class="progress-bar"></div>
      </div>
      <% } %>
    </div>
    <div class="section-bottom"></div>
  `,

  /**
   * Default template of the `locator` service.
   * @type {String}
   */
  'service:locator': `
    <div class="section-square"></div>
    <div class="section-float flex-middle">
      <% if (!showBtn) { %>
        <p class="small"><%= instructions %></p>
      <% } else { %>
        <button class="btn"><%= send %></button>
      <% } %>
    </div>
  `,

  /**
   * Default template of the `placer` service.
   * @type {String}
   */
  'service:placer': `
    <div class="section-square<%= mode === 'list' ? ' flex-middle' : '' %>">
      <% if (rejected) { %>
      <div class="fit-container flex-middle"><p><%= reject %></p></div>
      <% } %>
    </div>
    <div class="section-float flex-middle">
      <% if (!rejected) { %>
        <% if (mode === 'graphic') { %>
          <p><%= instructions %></p>
        <% } else if (mode === 'list') { %>
          <% if (showBtn) { %>
            <button class="btn"><%= send %></button>
          <% } %>
        <% } %>
      <% } %>
    </div>
  `,

  /**
   * Default template of the `platform` service.
   * @type {String}
   */
  'service:platform': `
    <% if (!isCompatible) { %>
      <div class="section-top"></div>
      <div class="section-center flex-center">
        <p><%= errorMessage %></p>
      </div>
      <div class="section-bottom"></div>
    <% } else { %>
      <div class="section-top flex-middle"></div>
      <div class="section-center flex-center">
          <p class="big">
            <%= intro %>
            <br />
            <b><%= globals.appName %></b>
          </p>
      </div>
      <div class="section-bottom flex-middle">
        <p class="small soft-blink"><%= instructions %></p>
      </div>
    <% } %>
  `,

  /**
   * Default template of the `sync` service.
   * @type {String}
   */
  'service:sync': `
    <div class="section-top"></div>
    <div class="section-center flex-center">
      <p class="soft-blink"><%= wait %></p>
    </div>
    <div class="section-bottom"></div>
  `,

  /** @private */
  survey: `
    <div class="section-top">
      <% if (counter <= length) { %>
        <p class="counter"><%= counter %> / <%= length %></p>
      <% } %>
    </div>
    <% if (counter > length) { %>
      <div class="section-center flex-center">
        <p class="big"><%= thanks %></p>
      </div>
    <% } else { %>
      <div class="section-center"></div>
    <% } %>
    <div class="section-bottom flex-middle">
      <% if (counter < length) { %>
        <button class="btn"><%= next %></button>
      <% } else if (counter === length) { %>
        <button class="btn"><%= validate %></button>
      <% } %>
    </div>
  `,
};

export default defaultViewTemplates;

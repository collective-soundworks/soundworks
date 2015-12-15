// import templateGenerator from './templateGenerator';

/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 *
 * These template are internally parsed using `lodash.template`, see [https://lodash.com/docs#template](https://lodash.com/docs#template) for more information.
 *
 * @type {Object}
 */
export default {
  checkin: `
    <% if (waiting || !label) { %>
      <div class="section-top"></div>
      <div class="section-center">
        <p class="big"><%= waiting || error %></p>
      </div>
      <div class="section-bottom"></div>
    <% } else { %>
      <div class="section-top">
        <p class="big"><%= labelPrefix %></p>
      </div>
      <div class="section-center">
        <div class="checkin-label">
          <p class="huge bold"><%= label %></p></div>
      </div>
      <div class="section-bottom">
        <p class="small"><%= labelPostfix %></p>
      </div>
    <% } %>
  `,

  loader: `
    <div class="section-top">
      <p><%= loading %></p>
    </div>
    <div class="section-center">
      <% if (showProgress) { %>
      <div class="progress-wrap">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <% } %>
    </div>
    <div class="section-bottom"></div>
  `,

  locator: `
    <div class="section-square"></div>
    <div class="section-float">
      <% if (!activateBtn) { %>
        <p class="small"><%= instructions %></p>
      <% } else { %>
        <button class="btn"><%= send %></button>
      <% } %>
    </div>
  `,

  orientation: `
    <div class="section-top"></div>
    <div class="section-center">
      <p><%= instructions %></p>
    </div>
    <div class="section-bottom"></div>
  `,

  sync: `
    <div class="section-top"></div>
    <div class="section-center">
      <p class="soft-blink"><%= wait %></p>
    </div>
    <div class="section-bottom"></div>
  `,

  welcome: `
    <div class="section-top">
      <% if (!error) { %>
        <p class="big"><%= welcome %> <b><%= _globals.appName %></b>,</p>
      <% } %>
    </div>
    <div class="section-center">
      <% if (error) { %>
        <p class="big"><%= error %></p>
      <% } else { %>
        <p class="small"><%= touchScreen %></p>
      <% } %>
    </div>
    <div class="section-bottom"></div>
  `,
};
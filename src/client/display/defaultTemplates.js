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
      <div class="section-center flex-center">
        <p class="big"><%= waiting || error %></p>
      </div>
      <div class="section-bottom"></div>
    <% } else { %>
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
    <% } %>
  `,

  control: `
    <h1 class="big"><%= title %></h1>
  `,

  loader: `
    <div class="section-top flex-middle">
      <p><%= loading %></p>
    </div>
    <div class="section-center flex-center">
      <% if (showProgress) { %>
      <div class="progress-wrap">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <% } %>
    </div>
    <div class="section-bottom"></div>
  `,

  locator: `
    <div class="section-square flex-middle"></div>
    <div class="section-float flex-middle">
      <% if (!activateBtn) { %>
        <p class="small"><%= instructions %></p>
      <% } else { %>
        <button class="btn"><%= send %></button>
      <% } %>
    </div>
  `,

  orientation: `
    <div class="section-top"></div>
    <div class="section-center flex-center">
      <p><%= instructions %></p>
    </div>
    <div class="section-bottom"></div>
  `,

  placer: `
    <div class="section-square flex-middle"></div>
    <div class="section-float flex-middle">
      <% if (mode === 'graphic') { %>
        <p><%= instructions %></p>
      <% } else if (mode === 'list') { %>
        <% if (showBtn) { %>
          <button class="btn"><%= send %></button>
        <% } %>
      <% } %>
    </div>
  `,

  sync: `
    <div class="section-top"></div>
    <div class="section-center flex-center">
      <p class="soft-blink"><%= wait %></p>
    </div>
    <div class="section-bottom"></div>
  `,

  survey: `
    <div class="section-top">
      <% if (counter <= length) { %>
        <p class="counter"><%= counter %> / <%= length %></p>
      <% } %>
    </div>
    <% if (counter > length) { %>
      <div class="section-center flex-center">
        <p class="big"><%= thanks %>
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

  welcome: `
    <div class="section-top flex-middle">
      <% if (!error) { %>
        <p class="big"><%= welcome %> <b><%= _globals.appName %></b></p>
      <% } %>
    </div>
    <div class="section-center flex-center">
      <% if (error) { %>
        <p class="big"><%= error %></p>
      <% } else { %>
        <p class="small"><%= touchScreen %></p>
      <% } %>
    </div>
    <div class="section-bottom flex-middle"></div>
  `,
};

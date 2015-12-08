// import templateGenerator from './templateGenerator';

/**
 * The default templates for the shipped modules. The templates are organized according to the `Module.name` property.
 *
 * These template are internally parsed using `lodash.template`, see [https://lodash.com/docs#template](https://lodash.com/docs#template) for more information.
 *
 * @type {Object}
 */
export default {
  welcome: `
    <div class="centered-content">
      <% if (error) { %>
        <p><%- error %></p>
      <% } else { %>
        <p><%- welcome %> <b><%- _globals.appName %></b>,</p>
        <p><%- touchScreen %></p>
      <% } %>
    </div>
  `,

  loader: `
    <div class="centered-content soft-blink">
      <p><%- loading %></p>
      <% if (showProgress) { %>
      <div class="progress-wrap">
        <div class="progress-bar" id="progress-bar"></div>
      </div>
      <% } %>
    </div>
  `,
};
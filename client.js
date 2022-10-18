"use strict";

/**
 * This is a dirty shortcut to enable cleaner import in template using `type=module`
 * This should be cleaned little by little...
 *
 * We need to define if we can be backward compatible there if we go to full module (probably not)
 */
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Client = exports.Context = void 0;

var _Context2 = _interopRequireDefault(require("./client/Context.js"));

var _Client2 = _interopRequireDefault(require("./client/Client.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Context = _Context2.default;
exports.Context = Context;
const Client = _Client2.default;
exports.Client = Client;
var _default = {
  Context: _Context2.default,
  Client: _Client2.default
};
exports.default = _default;

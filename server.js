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
exports.default = exports.Server = exports.Context = void 0;

var _Server2 = _interopRequireDefault(require("./server/Server.js"));

var _Context2 = _interopRequireDefault(require("./server/Context.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Context = _Context2.default;
exports.Context = Context;
const Server = _Server2.default;
exports.Server = Server;
var _default = {
  Context: _Context2.default,
  Server: _Server2.default
};
exports.default = _default;

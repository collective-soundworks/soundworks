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
exports.default = exports.Server = exports.AbstractExperience = void 0;

var _Server2 = _interopRequireDefault(require("./server/Server.js"));

var _AbstractExperience2 = _interopRequireDefault(require("./server/AbstractExperience.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const AbstractExperience = _AbstractExperience2.default;
exports.AbstractExperience = AbstractExperience;
const Server = _Server2.default;
exports.Server = Server;
var _default = {
  AbstractExperience: _AbstractExperience2.default,
  Server: _Server2.default
};
exports.default = _default;

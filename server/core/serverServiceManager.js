'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ctors = {};
var _instances = {};

/**
 * Manager the services and their relations. Acts as a factory to ensure services
 * are instanciated only once.
 */
var serverServiceManager = {
  /**
   * Retrieve a service according to the given id. If the service as not beeen
   * requested yet, it is instanciated.
   * @param {String} id - The id of the registered service
   * @param {ServerActivity} consumer - The activity instance requering the service.
   * @param {Object} options - The options to configure the service.
   */

  require: function require(id) {
    var consumer = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    id = 'service:' + id;

    if (!_ctors[id]) throw new Error('Service "' + id + '" does not exists');

    var instance = _instances[id];

    if (!instance) {
      instance = new _ctors[id]();
      _instances[id] = instance;
    }

    if (consumer !== null) {
      consumer.addRequiredActivity(instance);
      instance.addClientType(consumer.clientTypes);
    }

    instance.configure(options);
    return instance;
  },


  /**
   * Regiter a service
   * @param {String} id - The id of the service, in order to retrieve it later.
   * @param {Function} ctor - The constructor of the service.
   */
  register: function register(id, ctor) {
    _ctors[id] = ctor;
  }
};

exports.default = serverServiceManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZlclNlcnZpY2VNYW5hZ2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsSUFBTSxTQUFTLEVBQVQ7QUFDTixJQUFNLGFBQWEsRUFBYjs7Ozs7O0FBT04sSUFBTSx1QkFBdUI7Ozs7Ozs7OztBQVEzQiw0QkFBUSxJQUFtQztRQUEvQixpRUFBVyxvQkFBb0I7UUFBZCxnRUFBVSxrQkFBSTs7QUFDekMsU0FBSyxhQUFhLEVBQWIsQ0FEb0M7O0FBR3pDLFFBQUksQ0FBQyxPQUFPLEVBQVAsQ0FBRCxFQUNGLE1BQU0sSUFBSSxLQUFKLGVBQXNCLHdCQUF0QixDQUFOLENBREY7O0FBR0EsUUFBSSxXQUFXLFdBQVcsRUFBWCxDQUFYLENBTnFDOztBQVF6QyxRQUFJLENBQUMsUUFBRCxFQUFXO0FBQ2IsaUJBQVcsSUFBSSxPQUFPLEVBQVAsQ0FBSixFQUFYLENBRGE7QUFFYixpQkFBVyxFQUFYLElBQWlCLFFBQWpCLENBRmE7S0FBZjs7QUFLQSxRQUFJLGFBQWEsSUFBYixFQUFtQjtBQUNyQixlQUFTLG1CQUFULENBQTZCLFFBQTdCLEVBRHFCO0FBRXJCLGVBQVMsYUFBVCxDQUF1QixTQUFTLFdBQVQsQ0FBdkIsQ0FGcUI7S0FBdkI7O0FBS0EsYUFBUyxTQUFULENBQW1CLE9BQW5CLEVBbEJ5QztBQW1CekMsV0FBTyxRQUFQLENBbkJ5QztHQVJoQjs7Ozs7Ozs7QUFtQzNCLDhCQUFTLElBQUksTUFBTTtBQUNqQixXQUFPLEVBQVAsSUFBYSxJQUFiLENBRGlCO0dBbkNRO0NBQXZCOztrQkF3Q1MiLCJmaWxlIjoic2VydmVyU2VydmljZU1hbmFnZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBfY3RvcnMgPSB7fTtcbmNvbnN0IF9pbnN0YW5jZXMgPSB7fTtcblxuXG4vKipcbiAqIE1hbmFnZXIgdGhlIHNlcnZpY2VzIGFuZCB0aGVpciByZWxhdGlvbnMuIEFjdHMgYXMgYSBmYWN0b3J5IHRvIGVuc3VyZSBzZXJ2aWNlc1xuICogYXJlIGluc3RhbmNpYXRlZCBvbmx5IG9uY2UuXG4gKi9cbmNvbnN0IHNlcnZlclNlcnZpY2VNYW5hZ2VyID0ge1xuICAvKipcbiAgICogUmV0cmlldmUgYSBzZXJ2aWNlIGFjY29yZGluZyB0byB0aGUgZ2l2ZW4gaWQuIElmIHRoZSBzZXJ2aWNlIGFzIG5vdCBiZWVlblxuICAgKiByZXF1ZXN0ZWQgeWV0LCBpdCBpcyBpbnN0YW5jaWF0ZWQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgcmVnaXN0ZXJlZCBzZXJ2aWNlXG4gICAqIEBwYXJhbSB7U2VydmVyQWN0aXZpdHl9IGNvbnN1bWVyIC0gVGhlIGFjdGl2aXR5IGluc3RhbmNlIHJlcXVlcmluZyB0aGUgc2VydmljZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBUaGUgb3B0aW9ucyB0byBjb25maWd1cmUgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZXF1aXJlKGlkLCBjb25zdW1lciA9IG51bGwsIG9wdGlvbnMgPSB7fSkge1xuICAgIGlkID0gJ3NlcnZpY2U6JyArIGlkO1xuXG4gICAgaWYgKCFfY3RvcnNbaWRdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBTZXJ2aWNlIFwiJHtpZH1cIiBkb2VzIG5vdCBleGlzdHNgKTtcblxuICAgIGxldCBpbnN0YW5jZSA9IF9pbnN0YW5jZXNbaWRdO1xuXG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBuZXcgX2N0b3JzW2lkXTtcbiAgICAgIF9pbnN0YW5jZXNbaWRdID0gaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgaWYgKGNvbnN1bWVyICE9PSBudWxsKSB7XG4gICAgICBjb25zdW1lci5hZGRSZXF1aXJlZEFjdGl2aXR5KGluc3RhbmNlKTtcbiAgICAgIGluc3RhbmNlLmFkZENsaWVudFR5cGUoY29uc3VtZXIuY2xpZW50VHlwZXMpO1xuICAgIH1cblxuICAgIGluc3RhbmNlLmNvbmZpZ3VyZShvcHRpb25zKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlZ2l0ZXIgYSBzZXJ2aWNlXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCAtIFRoZSBpZCBvZiB0aGUgc2VydmljZSwgaW4gb3JkZXIgdG8gcmV0cmlldmUgaXQgbGF0ZXIuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGN0b3IgLSBUaGUgY29uc3RydWN0b3Igb2YgdGhlIHNlcnZpY2UuXG4gICAqL1xuICByZWdpc3RlcihpZCwgY3Rvcikge1xuICAgIF9jdG9yc1tpZF0gPSBjdG9yO1xuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQgc2VydmVyU2VydmljZU1hbmFnZXI7XG4iXX0=
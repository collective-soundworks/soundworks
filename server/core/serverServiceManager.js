'use strict';

Object.defineProperty(exports, '__esModule', {
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

exports['default'] = serverServiceManager;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zY2huZWxsL0RldmVsb3BtZW50L3dlYi9jb2xsZWN0aXZlLXNvdW5kd29ya3Mvc291bmR3b3Jrcy9zcmMvc2VydmVyL2NvcmUvc2VydmVyU2VydmljZU1hbmFnZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDbEIsSUFBTSxVQUFVLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFPdEIsSUFBTSxvQkFBb0IsR0FBRzs7Ozs7Ozs7QUFRM0IsU0FBTyxFQUFBLGlCQUFDLEVBQUUsRUFBaUM7UUFBL0IsUUFBUSx5REFBRyxJQUFJO1FBQUUsT0FBTyx5REFBRyxFQUFFOztBQUN2QyxNQUFFLEdBQUcsVUFBVSxHQUFHLEVBQUUsQ0FBQzs7QUFFckIsUUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFDYixNQUFNLElBQUksS0FBSyxlQUFhLEVBQUUsdUJBQW9CLENBQUM7O0FBRXJELFFBQUksUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQzs7QUFFOUIsUUFBSSxDQUFDLFFBQVEsRUFBRTtBQUNiLGNBQVEsR0FBRyxJQUFJLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBQSxDQUFDO0FBQzFCLGdCQUFVLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDO0tBQzNCOztBQUVELFFBQUksUUFBUSxLQUFLLElBQUksRUFBRTtBQUNyQixjQUFRLENBQUMsbUJBQW1CLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkMsY0FBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7S0FDOUM7O0FBRUQsWUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUM1QixXQUFPLFFBQVEsQ0FBQztHQUNqQjs7Ozs7OztBQU9ELFVBQVEsRUFBQSxrQkFBQyxFQUFFLEVBQUUsSUFBSSxFQUFFO0FBQ2pCLFVBQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7R0FDbkI7Q0FDRixDQUFDOztxQkFFYSxvQkFBb0IiLCJmaWxlIjoiL1VzZXJzL3NjaG5lbGwvRGV2ZWxvcG1lbnQvd2ViL2NvbGxlY3RpdmUtc291bmR3b3Jrcy9zb3VuZHdvcmtzL3NyYy9zZXJ2ZXIvY29yZS9zZXJ2ZXJTZXJ2aWNlTWFuYWdlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IF9jdG9ycyA9IHt9O1xuY29uc3QgX2luc3RhbmNlcyA9IHt9O1xuXG5cbi8qKlxuICogTWFuYWdlciB0aGUgc2VydmljZXMgYW5kIHRoZWlyIHJlbGF0aW9ucy4gQWN0cyBhcyBhIGZhY3RvcnkgdG8gZW5zdXJlIHNlcnZpY2VzXG4gKiBhcmUgaW5zdGFuY2lhdGVkIG9ubHkgb25jZS5cbiAqL1xuY29uc3Qgc2VydmVyU2VydmljZU1hbmFnZXIgPSB7XG4gIC8qKlxuICAgKiBSZXRyaWV2ZSBhIHNlcnZpY2UgYWNjb3JkaW5nIHRvIHRoZSBnaXZlbiBpZC4gSWYgdGhlIHNlcnZpY2UgYXMgbm90IGJlZWVuXG4gICAqIHJlcXVlc3RlZCB5ZXQsIGl0IGlzIGluc3RhbmNpYXRlZC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSByZWdpc3RlcmVkIHNlcnZpY2VcbiAgICogQHBhcmFtIHtTZXJ2ZXJBY3Rpdml0eX0gY29uc3VtZXIgLSBUaGUgYWN0aXZpdHkgaW5zdGFuY2UgcmVxdWVyaW5nIHRoZSBzZXJ2aWNlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIFRoZSBvcHRpb25zIHRvIGNvbmZpZ3VyZSB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlcXVpcmUoaWQsIGNvbnN1bWVyID0gbnVsbCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgaWQgPSAnc2VydmljZTonICsgaWQ7XG5cbiAgICBpZiAoIV9jdG9yc1tpZF0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFNlcnZpY2UgXCIke2lkfVwiIGRvZXMgbm90IGV4aXN0c2ApO1xuXG4gICAgbGV0IGluc3RhbmNlID0gX2luc3RhbmNlc1tpZF07XG5cbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICBpbnN0YW5jZSA9IG5ldyBfY3RvcnNbaWRdO1xuICAgICAgX2luc3RhbmNlc1tpZF0gPSBpbnN0YW5jZTtcbiAgICB9XG5cbiAgICBpZiAoY29uc3VtZXIgIT09IG51bGwpIHtcbiAgICAgIGNvbnN1bWVyLmFkZFJlcXVpcmVkQWN0aXZpdHkoaW5zdGFuY2UpO1xuICAgICAgaW5zdGFuY2UuYWRkQ2xpZW50VHlwZShjb25zdW1lci5jbGllbnRUeXBlcyk7XG4gICAgfVxuXG4gICAgaW5zdGFuY2UuY29uZmlndXJlKG9wdGlvbnMpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSxcblxuICAvKipcbiAgICogUmVnaXRlciBhIHNlcnZpY2VcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIC0gVGhlIGlkIG9mIHRoZSBzZXJ2aWNlLCBpbiBvcmRlciB0byByZXRyaWV2ZSBpdCBsYXRlci5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3RvciAtIFRoZSBjb25zdHJ1Y3RvciBvZiB0aGUgc2VydmljZS5cbiAgICovXG4gIHJlZ2lzdGVyKGlkLCBjdG9yKSB7XG4gICAgX2N0b3JzW2lkXSA9IGN0b3I7XG4gIH0sXG59O1xuXG5leHBvcnQgZGVmYXVsdCBzZXJ2ZXJTZXJ2aWNlTWFuYWdlcjtcbiJdfQ==
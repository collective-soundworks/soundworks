'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Configuration parameters of the Soundworks framework.
 * These parameters allow for configuring components of the framework such as Express and SocketIO.
 */
exports.default = {
  port: 8000,
  osc: {
    receiveAddress: '127.0.0.1',
    receivePort: 57121,
    sendAddress: '127.0.0.1',
    sendPort: 57120
  },
  logger: {
    name: 'soundworks',
    level: 'info',
    streams: [{
      level: 'info',
      stream: process.stdout
    }]
  }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7a0JBSWU7QUFDYixRQUFNLElBQU47QUFDQSxPQUFLO0FBQ0gsb0JBQWdCLFdBQWhCO0FBQ0EsaUJBQWEsS0FBYjtBQUNBLGlCQUFhLFdBQWI7QUFDQSxjQUFVLEtBQVY7R0FKRjtBQU1BLFVBQVE7QUFDTixVQUFNLFlBQU47QUFDQSxXQUFPLE1BQVA7QUFDQSxhQUFTLENBQUM7QUFDUixhQUFPLE1BQVA7QUFDQSxjQUFRLFFBQVEsTUFBUjtLQUZELENBQVQ7R0FIRiIsImZpbGUiOiJlbnYuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENvbmZpZ3VyYXRpb24gcGFyYW1ldGVycyBvZiB0aGUgU291bmR3b3JrcyBmcmFtZXdvcmsuXG4gKiBUaGVzZSBwYXJhbWV0ZXJzIGFsbG93IGZvciBjb25maWd1cmluZyBjb21wb25lbnRzIG9mIHRoZSBmcmFtZXdvcmsgc3VjaCBhcyBFeHByZXNzIGFuZCBTb2NrZXRJTy5cbiAqL1xuZXhwb3J0IGRlZmF1bHQge1xuICBwb3J0OiA4MDAwLFxuICBvc2M6IHtcbiAgICByZWNlaXZlQWRkcmVzczogJzEyNy4wLjAuMScsXG4gICAgcmVjZWl2ZVBvcnQ6IDU3MTIxLFxuICAgIHNlbmRBZGRyZXNzOiAnMTI3LjAuMC4xJyxcbiAgICBzZW5kUG9ydDogNTcxMjAsXG4gIH0sXG4gIGxvZ2dlcjoge1xuICAgIG5hbWU6ICdzb3VuZHdvcmtzJyxcbiAgICBsZXZlbDogJ2luZm8nLFxuICAgIHN0cmVhbXM6IFt7XG4gICAgICBsZXZlbDogJ2luZm8nLFxuICAgICAgc3RyZWFtOiBwcm9jZXNzLnN0ZG91dCxcbiAgICB9LCAvKntcbiAgICAgIGxldmVsOiAnaW5mbycsXG4gICAgICBwYXRoOiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ2xvZ3MnLCAnc291bmR3b3Jrcy5sb2cnKSxcbiAgICB9Ki9dXG4gIH1cbn07XG4iXX0=
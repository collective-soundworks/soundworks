/**
 * @fileoverview Soundworks server side module export
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

module.exports = {
  server: require('./server'),
  Control: require('./ServerControl'),
  Client: require('./ServerClient'),
  Module: require('./ServerModule'),
  Checkin: require('./ServerCheckin'),
  Seatmap: require('./ServerSeatmap'),
  Sync: require('./ServerSync'),
};

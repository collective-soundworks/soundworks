/**
 * @fileoverview Matrix server side setup manager base class
 * @author Sebastien.Robaszkiewicz@ircam.fr, Norbert.Schnell@ircam.fr
 */
'use strict';

var EventEmitter = require('events').EventEmitter;

class ServerSetupManager extends EventEmitter {
	constructor() {
		this.playerManager = null;
	}

	init(playerManager) {
		this.playerManager = playerManager;
	}

	addPlayer(player) {

	}

	removePlayer(player) {

	}

	updateTopology() {

	}
}

module.exports = ServerSetupManager;
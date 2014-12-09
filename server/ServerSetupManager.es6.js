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
}

module.exports = ServerSetupManager;
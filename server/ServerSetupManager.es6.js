var EventEmitter = require('events').EventEmitter;

'use strict';

class ServerSetupManager extends EventEmitter {
	constructor(topologyManager) {
		this.topologyManager = topologyManager;
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
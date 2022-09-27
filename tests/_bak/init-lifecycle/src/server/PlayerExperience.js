import soundworks from '@soundworks/core/server';

class PlayerExperience extends soundworks.Experience {
  constructor(soundworks, clientTypes, options = {}) {
    super(soundworks, clientTypes);

    this.delay1 = this.require('delay-1');
    this.delay2 = this.require('delay-2', {}, ['delay-1']);
  }

  start() {
    super.start();
  }

  enter(client) {
    super.enter(client);
  }

  exit(client) {
    super.exit(client);
  }
}

export default PlayerExperience;

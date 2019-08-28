import soundworks from '@soundworks/core/server';

class OtherExperience extends soundworks.Experience {
  constructor(soundworks, clientTypes, options = {}) {
    super(soundworks, clientTypes);

    this.delay1 = this.require('delay-3', { delayTime: 1.5 });
    this.delay2 = this.require('delay-4', { delayTime: 1.5 }, ['delay-3']);
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

export default OtherExperience;

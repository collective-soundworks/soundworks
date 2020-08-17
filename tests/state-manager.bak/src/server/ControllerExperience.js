import { Experience } from '@soundworks/core/server';

class ControllerExperience extends Experience {
  constructor(server, clientTypes, options = {}) {
    super(server, clientTypes);

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

export default ControllerExperience;

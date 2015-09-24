const ServerModule = require('./ServerModule');
const fs = require('fs');

class ServerSurvey extends ServerModule {
  constructor(options = {}) {
    super(options.name || 'survey');
    // prepare file name
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const day = now.getDate();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const fileName = `survey-${year}-${month}-${day}_${hour}-${minutes}`;

    // @TODO allow to change folder name (aka `surveys`)
    this.filePath = `${process.cwd()}/surveys/${fileName}`;
    this._appendToFile = this._appendToFile.bind(this);
  }

  connect(client) {
    super.connect(client);

    client.receive(`${this.name}:answers`, this._appendToFile)
  }

  disconnect(client) {
    super.disconnect(client);
  }

  _appendToFile(json) {
    fs.appendFile(this.filePath, `${json}\n`, (err) => {
      if (err) { console.error(err.message); }
      console.log(json + ' appended to ' + this.filePath);
    });
  }
}

module.exports = ServerSurvey;
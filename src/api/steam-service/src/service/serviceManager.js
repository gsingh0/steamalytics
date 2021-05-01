const SteamApiInterface = require('../interface/steamApiInterface');

class ServiceManager {
    constructor() {
        this.steamApiInterface = new SteamApiInterface();
    }

    async init() {
        await this.steamApiInterface.init();
    }

}

module.exports = ServiceManager;
const {EventEmitter} = require("events");
const DiscordConnector = require("./discord/index.js");

class OtterFX extends EventEmitter {
    constructor(options = {}) {
        super();
        this.options = options;
        this.discord_connector =  new DiscordConnector(this);
    }

    async start() {
        return this.discord_connector.login();
    }
}

module.exports = OtterFX;
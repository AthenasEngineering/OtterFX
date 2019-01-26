const {Client: DiscordClient} = require("discord.js");

class DiscordConnector extends DiscordClient {
    constructor(otterfx, ...args) {
        super(...args);

        this.otterfx = otterfx;
        this.verifyOptions();
        this.setupEvents();
    }

    verifyOptions() {
        const options = this.otterfx.options;

        if ((typeof options !== "object" && !options) || (typeof options.discord !== "string" && !options.discord)) {
            throw new TypeError("Invalid discord options");
        }

        if (typeof options.discord.token !== "string" || options.discord.token === "") {
            throw new TypeError("Invalid Discord Token");
        }
    }

    login(token = this.otterfx.options.discord.token) {
        return super.login(token);
    }

    setupEvents() {
        this.on("error", this.eventHandleError.bind(this));
        this.on("ready", this.eventHandleReady.bind(this));
    }

    eventHandleError(error) {
        return this.otterfx.emit("error", error);
    }

    eventHandleReady() {
        return this.otterfx.emit("discord:ready");
    }
}

module.exports = DiscordConnector;
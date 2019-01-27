//
//MIT LICENSE
//
//Copyright (c) 2019 Athena
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in all
//copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
//SOFTWARE.
//

//
//REQUIREMENTS
//
const {MongoClient} = require("mongodb");
const {ModelGuild} = require("./models/index.js");

//
//CLASS
//
class MongoDBConnector extends MongoClient {
    constructor(otterfx) {
        if (!otterfx) {
            throw new TypeError("Invalid OtterFX");
        }

        const options = otterfx.options;

        if (typeof options !== "object" && !options) {
            throw new TypeError("Invalid Options");
        }

        const mongodb_url = options.mongodb_url;

        //No need to reinvent the wheel with lots of type checks for the URL. MongoDB can deal with that.
        if (typeof mongodb_url !== "string") {
            throw new TypeError("Invalid MongoDB URL");
        }

        super(otterfx.options.mongodb_url, {useNewUrlParser: true});

        this.otterfx = otterfx;
    }

    async connect() {
        return await super.connect();
    }

    async findOrCreateGuild(discord_guild) {
        if (!discord_guild) {
            throw new TypeError("Mising discord_guild");
        }

        const connector = {database_connector: this};
        const find = {snowflake: discord_guild.id};
        const create = {
            snowflake      : discord_guild.id,
            owner_snowflake: discord_guild.ownerID
        };
        let guild = await ModelGuild.find(connector, find);

        if (!guild && !(guild = await ModelGuild.create(connector, create))) {
            throw new Error("Unable to find/create guild");
        }

        return guild;
    }
}

//
//EXPORTS
//
module.exports = MongoDBConnector;

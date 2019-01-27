//
// REQUIREMENTS
//

const {ObjectID} = require("mongodb");

//
// CONSTANTS
//
const COLLECTION_NAME = "guilds";

//
// CLASS
//

class ModelGuild {
    constructor({
                    _id,
                    snowflake,
                    cmd_prefix = "$"
                } = {}, {database_connector}) {
        this._id = _id;
        this.snowflake = snowflake;
        this.cmd_prefix = cmd_prefix;
        this.database_connector = database_connector;
    }

    static async create({database_connector}, {snowflake, owner_snowflake}) {
        if (!database_connector) {
            return new TypeError("Missing database connector");
        }

        if (!snowflake) {
            throw new TypeError("Missing snowflake");
        }

        const document = {
            snowflake,
            owner: owner_snowflake
        };

        const result = await database_connector.db().collection(COLLECTION_NAME).insertOne(document);

        if (!result.insertedId) {
            throw Error("Nothing was inserted");
        }

        Object.apply(document, {_id: result.insertedId});

        return new ModelGuild(document, {database_connector});
    }

    static async find({database_connector}, {_id, snowflake} = {}) {
        if (!database_connector) {
            throw new TypeError("Missing database connector");
        }

        if (!_id && !snowflake) {
            return new TypeError("Invalid/Missing _id or snowflake");
        }

        let query = {
            snowflake
        };

        if (_id) {
            query = {
                _id: new ObjectID(_id)
            };
        }

        const result = await database_connector.db().collection(COLLECTION_NAME).findOne(query);

        if (!result) {
            return null;
        }

        return new ModelGuild(result, {database_connector});
    }
}

module.exports = ModelGuild;
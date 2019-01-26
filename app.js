//
//REQUIREMENTS
//

const OtterFX = require("./src/index.js");

//
//CONSTANTS
//

const ENV_IDENTIFIER = "OTTERFX_";
const ENV_DISCORD_IDENTIFIER = "DISCORD_";
const OTTERFX_ENVIRONMENT_VARIABLES = Object.keys(process.env)
                                            .filter(key => key.startsWith(ENV_IDENTIFIER))
                                            .reduce((previous, old_key) => {
                                                const new_key = old_key.slice(ENV_IDENTIFIER.length);

                                                previous[new_key] = process.env[old_key];

                                                return previous;
                                            }, {});
const DISCORD_OPTIONS = {};
const FXSERVER_OPTIONS = {}; //TODO: Add FXServer Integration

//
//FUNCTIONS
//

const handleDiscordEnvironmentVariable = (env_key, env_value) => {
    if (typeof env_key !== "string" || env_key === "") {
        throw new TypeError(`Invalid env_key: ${env_key}`);
    }

    env_key = env_key.toLowerCase().slice(ENV_DISCORD_IDENTIFIER.length);

    DISCORD_OPTIONS[env_key] = env_value;
};

const buildOptions = () => {
    for (const [env_key, env_value] of Object.entries(OTTERFX_ENVIRONMENT_VARIABLES)) {
        if (typeof env_key !== "string") {
            throw new TypeError(`Invalid Inv Key: ${env_key}`);
        }

        if (env_key.startsWith(ENV_DISCORD_IDENTIFIER)) {
            handleDiscordEnvironmentVariable(env_key, env_value);
        }
    }

    return {
        discord : DISCORD_OPTIONS,
        fxserver: FXSERVER_OPTIONS
    };
};

const handleError = (error) => {
    console.error("FATAL ERROR", error);

    return process.exit(1);
};

//
//APP LOGIC
//

const app_options = buildOptions();
const app = new OtterFX(app_options);

app.on("error", handleError);

app.start().catch(handleError);
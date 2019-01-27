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
    const raw_options = {};

    for (const [env_key, env_value] of Object.entries(OTTERFX_ENVIRONMENT_VARIABLES)) {
        if (typeof env_key !== "string") {
            throw new TypeError(`Invalid Inv Key: ${env_key}`);
        }

        if (env_key.startsWith(ENV_DISCORD_IDENTIFIER)) {
            handleDiscordEnvironmentVariable(env_key, env_value);
        } else {
            raw_options[env_key.toLowerCase()] = env_value;
        }
    }

    return Object.assign({
                            discord : DISCORD_OPTIONS,
                            fxserver: FXSERVER_OPTIONS
                        }, raw_options);
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
const config = require('../../config.json');

const CONFIG_VERSION = "0.0.1";

const ConfigChecker = () => {
    if(config.configVersion != CONFIG_VERSION) return error("Mismatch config version! Please update the config file!");

    if(!config.botToken) return error("Bot token not found!");

    if(config.botToken == "your-bot-token-here") return error("Default token found. Please update the token in config file!");

    if(!config.embedColor) return error("Embed color not found!");

    if(!config.prefix) return error("Prefix not found!");

    if(config.volumeControl == undefined || typeof(config.volumeControl) != 'boolean') return error("Volume control not found or is not boolean!");
}

const ConfigError = class extends Error {
    constructor(message){
        super(message);
        this.name = 'ConfigError';
    }
}

const error = (message) => {
    throw new ConfigError(message);
}

module.exports = ConfigChecker;
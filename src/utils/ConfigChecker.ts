import config from '../../config.json';

const CONFIG_VERSION = "0.0.2";

const ConfigChecker = () => {
    if (config.configVersion !== CONFIG_VERSION) return error("Mismatch config version! Please update the config file!");

    if (!config.botToken) return error("Bot token not found!");

    if (config.botToken === "your-bot-token-here") return error("Please add your bot token in config file!");

    if (!config.embedColor) return error("Embed color not found!");

    if (config.volumeControl === undefined || typeof (config.volumeControl) != 'boolean') return error("Volume control not found or is not boolean!");
}

const ConfigError = class extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ConfigError';
    }
}

const error = (message: string) => {
    throw new ConfigError(message);
}

export default ConfigChecker;
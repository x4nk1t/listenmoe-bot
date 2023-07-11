const { Client: DiscordClient, Collection } = require("eris");
const fs = require("fs");

const WSConnect = require('./api/wsconnect.js');
const BaseCommand = require("./BaseCommand.js");

const Status = require("./commands/status.js");
const Play = require("./commands/play.js");
const Leave = require("./commands/leave.js");
const NowPlaying = require("./commands/now-playing.js");
const Volume = require("./commands/volume.js");

const config = require('../config');
const guild_volumes = require('../guild_volumes');
const ConfigChecker = require("./utils/ConfigChecker.js");
const Eris = require("eris");

class Client extends DiscordClient {
    constructor(token, options = {}) {
        super(token, options);

        ConfigChecker();

        this.channelMaps = new Collection();
        this.embedColor = parseInt(config.embedColor.replace('#', ''), 16);
        this.config = config;

        this.wsJPOP = new WSConnect(this, 'gateway_v2');
        this.wsKPOP = new WSConnect(this, 'kpop/gateway_v2');

        this.commands = new Collection();
        this.aliases = new Collection();

        this.registerEvents();
    }

    registerEvents() {
        this.on('ready', () => {
            this.loadCommands();

            console.log('Logged in as ' + this.user.username);
        });

        this.on('interactionCreate', interaction => {
            if (interaction instanceof Eris.CommandInteraction) {
                this.executeCommand(interaction);
            }
        });

        this.on('voiceChannelLeave', (member, oldChannel) => {
            if (member.id === this.user.id) return;

            this.setLeaveTimeout(oldChannel);
        });

        this.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
            if (member.id === this.user.id) return;

            const guild = oldChannel.guild;
            const botMember = guild.members.get(this.user.id);
            const botVoiceChannelId = botMember.voiceState.channelID;

            if (!botVoiceChannelId) return;

            if (newChannel.id !== botVoiceChannelId) {
                const botVoiceChannel = guild.channels.get(botVoiceChannelId);
                this.setLeaveTimeout(botVoiceChannel);
            }
        });

        process.on('SIGINT', () => {
            this.voiceConnections.forEach((connection) => {
                this.closeVoiceConnection(connection.id);
            });
            this.disconnect();
            process.exit();
        });
    }

    setLeaveTimeout(voiceChannel) {
        if (voiceChannel.voiceMembers.size === 1) {
            setTimeout(() => {
                if (voiceChannel.voiceMembers.size === 1) {
                    voiceChannel.leave();
                    const messageChannel = this.channelMaps.get(voiceChannel.id);
                    if (messageChannel) messageChannel.createMessage(this.embed(`Nobody listening! Left **${voiceChannel.name}**!`)).catch(console.error);
                }
            }, 60000); //1 minutes
        }
    }

    loadCommands() {
        this.getCommands().then(commands => {
            commands.every(command => {
                this.deleteCommand(command.id);
            })
        })

        this.registerCommand(new Leave(this));
        this.registerCommand(new Play(this));
        this.registerCommand(new NowPlaying(this));
        this.registerCommand(new Status(this));
        this.registerCommand(new Volume(this));
    }

    registerCommand(commandClass) {
        if (commandClass instanceof BaseCommand) {
            const name = commandClass.name;
            const description = commandClass.description;
            const options = commandClass.options;

            if (this.commands.get(name)) {
                console.error(`Couldn't load ${name}. Reason: Already loaded`);
                return;
            }

            this.commands.set(name, commandClass);

            this.createCommand({
                name: name,
                description: description,
                options: options
            });
        } else {
            console.error(`Couldn't load ${commandClass}. Reason: Not a command.`);
        }
    }

    executeCommand(interaction) {
        if (interaction instanceof Eris.CommandInteraction) {
            const commandName = interaction.data.name;
            const args = interaction.data.options || [];

            const command = this.getBotCommand(commandName);

            if (command instanceof BaseCommand)
                command.execute(interaction, args);
        }
    }

    getGuildVolume(guildId) {
        var volume = 100;
        guild_volumes.forEach(data => {
            if (data.guild_id == guildId) {
                volume = data.volume;
            }
        });

        return volume;
    }

    setGuildVolume(guildId, volume) {
        var found = false;
        guild_volumes.forEach(data => {
            if (data.guild_id == guildId) {
                found = true;
                data.volume = volume;
            }
        });

        if (!found) {
            guild_volumes.push({ guild_id: guildId, volume: volume });
        }

        fs.writeFileSync("guild_volumes.json", JSON.stringify(guild_volumes));
    }

    getBotCommand(commandName) {
        return this.commands.get(commandName);
    }

    embed(description) {
        return { embed: { color: this.embedColor, description: description } };
    }
}

module.exports = Client;

import { Client as DiscordClient, ClientOptions, CommandInteraction, TextableChannel, VoiceChannel, ApplicationCommandStructure, InteractionContent } from "eris";
import fs from "fs";

import WSConnect from './api/wsconnect';
import BaseCommand from "./BaseCommand";

import Status from "./commands/status";
import Play from "./commands/play";
import Leave from "./commands/leave";
import NowPlaying from "./commands/now-playing";
import Volume from "./commands/volume";

import config from '../config.json';
import json_guild_volumes from '../guild_volumes.json';
import ConfigChecker from "./utils/ConfigChecker";
import Eris from "eris";
import { ListenMoe } from "../index";

class Client extends DiscordClient {
    channelMaps: Map<string, TextableChannel>;
    commands: Map<string, BaseCommand>;
    embedColor: number;
    config: any;
    wsJPOP: WSConnect;
    wsKPOP: WSConnect;
    guild_volumes: ListenMoe.GuildVolume[];

    constructor(token: string, options = <ClientOptions>{}) {
        super(token, options);

        ConfigChecker();

        this.channelMaps = new Map();
        this.commands = new Map();

        this.guild_volumes = json_guild_volumes;

        this.embedColor = parseInt(config.embedColor.replace('#', ''), 16);
        this.config = config;

        this.wsJPOP = new WSConnect(this, 'gateway_v2');
        this.wsKPOP = new WSConnect(this, 'kpop/gateway_v2');

        this.registerEvents();
    }

    registerEvents() {
        this.on('ready', () => {
            this.loadCommands();

            console.log('Logged in as ' + this.user.username);
        });

        this.on('interactionCreate', interaction => {
            if (interaction instanceof Eris.CommandInteraction) {
                if (interaction.guildID == undefined) {
                    interaction.createMessage("You cannot run commands outside of guild");
                    return;
                }
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
            const botVoiceChannelId = botMember?.voiceState.channelID;

            if (!botVoiceChannelId) return;

            if (newChannel.id !== botVoiceChannelId) {
                const botVoiceChannel = guild.channels.get(botVoiceChannelId) as VoiceChannel;
                this.setLeaveTimeout(botVoiceChannel);
            }
        });

        process.on('SIGINT', () => {
            this.voiceConnections.forEach((connection) => {
                this.closeVoiceConnection(connection.id);
            });
            this.disconnect({});
            process.exit();
        });
    }

    setLeaveTimeout(voiceChannel: VoiceChannel | undefined) {
        if (voiceChannel == undefined)
            return;

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

    registerCommand(commandClass: BaseCommand) {
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
        } as ApplicationCommandStructure);
    }

    executeCommand(interaction: CommandInteraction) {
        const commandName = interaction.data.name;
        const args = interaction.data.options;

        const command = this.getBotCommand(commandName);

        if (command instanceof BaseCommand) {
            command.execute(interaction, args);
        }
    }

    getGuildVolume(guildId: any) {
        var volume = 100;
        this.guild_volumes.forEach((data) => {
            if (data.guild_id == guildId) {
                volume = data.volume;
            }
        });

        return volume;
    }

    setGuildVolume(guildId: string, volume: number) {
        var found = false;
        this.guild_volumes.forEach((data: { guild_id: any; volume: any; }) => {
            if (data.guild_id == guildId) {
                found = true;
                data.volume = volume;
            }
        });

        if (!found) {
            this.guild_volumes.push({ guild_id: guildId, volume: volume });
        }

        fs.writeFileSync("guild_volumes.json", JSON.stringify(this.guild_volumes));
    }

    getBotCommand(commandName: any) {
        return this.commands.get(commandName);
    }

    embed(description: string) {
        return { embed: { color: this.embedColor, description: description } } as InteractionContent;
    }
}

export default Client;

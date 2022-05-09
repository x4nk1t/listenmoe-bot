const { Client: DiscordClient, Collection } = require("eris");
const WSConnect = require('./api/wsconnect.js');
const BaseCommand = require("./BaseCommand.js");

const Status = require("./commands/status.js");
const Play =  require("./commands/play.js");
const Leave =  require("./commands/leave.js");
const NowPlaying = require("./commands/now-playing.js");

const config = require('../config');

class Client extends DiscordClient{
    constructor(token, options = {}){
        super(token, options);
        
        this.channelMaps = new Collection();
        this.prefix = config.prefix;
        this.embedColor = parseInt(config.embedColor.replace('#', ''), 16);

        this.wsJPOP = new WSConnect(this, 'gateway_v2');
        this.wsKPOP = new WSConnect(this, 'kpop/gateway_v2');

        this.commands = new Collection();
        this.aliases = new Collection();

        this.loadCommands();
        this.registerEvents();
    }

    registerEvents(){
        this.on('ready', () => {
            console.log('Logged in as '+ this.user.username);
        })

        this.on('messageCreate', message => {
            if(message.author.bot) return;
            
            this.executeCommand(message);
        })

        this.on('voiceChannelLeave', (member, oldChannel) => {
            if(member.id == this.user.id) return;

            this.setLeaveTimeout(oldChannel);
        })

        this.on('voiceChannelSwitch', (member, newChannel, oldChannel) => {
            if(member.id == this.user.id) return;

            const guild = oldChannel.guild;
            const botMember = guild.members.get(this.user.id);
            const botVoiceChannelId = botMember.voiceState.channelID;

            if(!botVoiceChannelId) return;

            if(newChannel.id != botVoiceChannelId){
                const botVoiceChannel = guild.channels.get(botVoiceChannelId);
                this.setLeaveTimeout(botVoiceChannel);
            }
        })
    }

    setLeaveTimeout(voiceChannel){
        if(voiceChannel.voiceMembers.size == 1){
            setTimeout(() => {
                if(voiceChannel.voiceMembers.size == 1) {
                    voiceChannel.leave();
                    const messageChannel = this.channelMaps.get(voiceChannel.id);
                    if(messageChannel) messageChannel.createMessage(this.embed(`Nobody listening! Left **${voiceChannel.name}**!`)).catch(console.error);
                }
            }, 60000) //1 minutes
        }
    }

    loadCommands(){
        this.registerCommand(new Leave(this));
        this.registerCommand(new Play(this));
        this.registerCommand(new NowPlaying(this));
        this.registerCommand(new Status(this));
    }

    registerCommand(commandClass){
        if(commandClass instanceof BaseCommand){
            const name = commandClass.name;

            if(this.commands.get(name)){
                console.error(`Couldn't load ${name}. Reason: Already loaded`);
                return;
            }
            
            commandClass.aliases.forEach(alias => {
                this.aliases.set(alias, commandClass);
            })

            this.commands.set(name, commandClass);
        } else {
            console.error(`Couldn't load ${commandClass}. Reason: Not a command.`);
        }
    }

    executeCommand(message){
        const command = this.getCommand(message);
        if(command){
            const args = message.content.replace(this.prefix, '').split(' ');
            args.shift();

            command.execute(message, args);
        }
    }

    getCommand(message){
        const args = message.content.split(' ');
        const commandName = args[0].toLowerCase().replace(this.prefix, '');

        const commandClass = this.commands.get(commandName) || this.aliases.get(commandName);

        return commandClass;        
    }

    embed(description){
        return {embed: {color: this.embedColor, description: description}};
    }
}

module.exports = Client;
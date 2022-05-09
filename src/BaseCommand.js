class BaseCommand {
    constructor(client, options){
        this.client = client;
        
        this.name = options.name || '';
        this.aliases = options.aliases || [];
        this.usage = options.usage || '';

        this.prefix = this.client.prefix;
        this.embedColor = this.client.embedColor;
    }

    sendUsage(message){
        message.channel.createMessage(this.embed(`**Usage:** ${this.prefix}${this.name} ${this.usage}`));
    }

    embed(message){
        return this.client.embed(message);
    }

    isConnected(message){
        const guild = message.member.guild;
        const channelId = message.member.voiceState.channelID;
        if(channelId){
            const botMember = guild.members.get(this.client.user.id);

            if(botMember.voiceState.channelID){
                return true;
            } else {
                message.channel.createMessage(this.embed('I\'m not connected to any channels.'));
            }
        } else {
            message.channel.createMessage(this.embed('You must be connected to voice channel.'));
        }
        return false;
    }
}

module.exports = BaseCommand;
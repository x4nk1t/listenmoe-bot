const {VoiceChannel} = require("eris");
const BaseCommand = require("../BaseCommand.js");

class Leave extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'leave',
            aliases: ['stop']
        });
    }

    execute(message, args) {
        const guild = message.member.guild;
        const channelId = message.member.voiceState.channelID;
        if (channelId) {
            const voiceChannel = guild.channels.get(channelId);
            const botMember = guild.members.get(this.client.user.id);

            if (botMember.voiceState.channelID) {
                if (voiceChannel instanceof VoiceChannel) {
                    voiceChannel.leave();
                    message.channel.createMessage(this.embed(`Successfully left **${voiceChannel.name}**!`));
                }
            } else {
                message.channel.createMessage(this.embed('I\'m not connected to any channels.'));
            }
        } else {
            message.channel.createMessage(this.embed('You must be connected to voice channel.'));
        }
    }
}

module.exports = Leave;
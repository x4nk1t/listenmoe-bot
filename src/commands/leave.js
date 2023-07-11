const {VoiceChannel} = require("eris");
const BaseCommand = require("../BaseCommand.js");

class Leave extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "leave",
            description: "Leaves the voice channel"
        });
    }

    execute(interaction, args) {
        const guild = interaction.member.guild;
        const channelId = interaction.member.voiceState.channelID;
        if (channelId) {
            const voiceChannel = guild.channels.get(channelId);
            const botMember = guild.members.get(this.client.user.id);

            if (botMember.voiceState.channelID) {
                if (voiceChannel instanceof VoiceChannel) {
                    voiceChannel.leave();
                    interaction.createMessage(this.embed(`Successfully left **${voiceChannel.name}**!`));
                }
            } else {
                interaction.createMessage(this.embed('I\'m not connected to any channels.'));
            }
        } else {
            interaction.createMessage(this.embed('You must be connected to voice channel.'));
        }
    }
}

module.exports = Leave;
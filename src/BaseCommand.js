class BaseCommand {
    constructor(client, options) {
        this.client = client;

        this.name = options.name || '';
        this.description = options.description || 'N/A';
        this.options = options.options || [];

        this.embedColor = this.client.embedColor;
    }

    embed(interaction) {
        return this.client.embed(interaction);
    }

    isConnected(interaction) {
        const guild = interaction.member.guild;
        const channelId = interaction.member.voiceState.channelID;
        if (channelId) {
            const botMember = guild.members.get(this.client.user.id);

            if (botMember.voiceState.channelID) {
                return true;
            } else {
                interaction.createMessage(this.embed('I\'m not connected to any channels.'));
            }
        } else {
            interaction.createMessage(this.embed('You must be connected to voice channel.'));
        }
        return false;
    }
}

module.exports = BaseCommand;
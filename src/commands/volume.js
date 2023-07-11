const BaseCommand = require("../BaseCommand.js");
const { Constants } = require("eris");

class Volume extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "volume",
            description: "Change the volume of the music",
            aliases: ["vol", "v"],
            options: [
                {
                    name: "volume",
                    description: "Change the volume of the radio",
                    type: Constants.ApplicationCommandOptionTypes.INTEGER,
                    min_value: 1,
                    max_value: 100,
                    required: true
                }
            ]
        });
    }

    execute(interaction, args) {
        if (!this.client.config.volumeControl) {
            interaction.createMessage(this.embed('Volume control is disabled.\nIf you want to enable it, change `volumeControl` to `true` in config file.'));
            return;
        }

        const guild = interaction.member.guild;
        const volume = args[0].value;

        if (this.isConnected(interaction)) {
            const voiceConnection = this.client.voiceConnections.get(guild.id);

            if (voiceConnection) {
                voiceConnection.setVolume((volume / 100));
                this.client.setGuildVolume(guild.id, volume);

                interaction.createMessage(this.embed(`Set volume to \`${volume}\`!`));
            } else {
                interaction.createMessage(this.embed('Something went wrong! Try leaving and joining the voice channel.'));
            }
        }
    }
}

module.exports = Volume;
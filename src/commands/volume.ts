import Eris, { CommandInteraction, Constants } from "eris";

import Client from "../Client";
import BaseCommand from "../BaseCommand";

class Volume extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "volume",
            description: "Change the volume of the music",
            options: [
                {
                    name: "volume",
                    type: Constants.ApplicationCommandOptionTypes.INTEGER,
                    description: "Set the volume",
                    required: true,
                    min_value: 1,
                    max_value: 100
                }
            ]
        });
    }

    execute(interaction: CommandInteraction, args: Eris.InteractionDataOptionsNumber[]) {
        if (!this.client.config.volumeControl) {
            interaction.createMessage(this.embed('Volume control is disabled.\nIf you want to enable it, change `volumeControl` to `true` in config file.'));
            return;
        }

        const guild = interaction.member!.guild;
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

export default Volume;
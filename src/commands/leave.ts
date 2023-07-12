import { CommandInteraction, VoiceChannel } from "eris";

import Client from "../Client";
import BaseCommand from "../BaseCommand";

class Leave extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "leave",
            description: "Leaves the voice channel"
        });
    }

    execute(interaction: CommandInteraction, args: undefined) {
        const guild = interaction.member?.guild;
        const channelId = interaction.member?.voiceState.channelID;
        if (channelId) {
            const voiceChannel = guild?.channels.get(channelId) as VoiceChannel;
            const botMember = guild?.members.get(this.client.user.id);

            if (botMember?.voiceState.channelID) {
                voiceChannel?.leave();
                interaction.createMessage(this.embed(`Successfully left **${voiceChannel.name}**!`));
            } else {
                interaction.createMessage(this.embed('I\'m not connected to any channels.'));
            }
        } else {
            interaction.createMessage(this.embed('You must be connected to voice channel.'));
        }
    }
}

export default Leave;
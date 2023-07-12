import Eris, { CommandInteraction, VoiceChannel, Constants } from "eris";

import Client from "../Client";
import BaseCommand from "../BaseCommand";

class Play extends BaseCommand {
    inlineVolume: { inlineVolume: boolean; } | {};
    
    constructor(client: Client) {
        super(client, {
            name: "play",
            description: "Plays listen.moe radio on voice channel",
            options: [{
                name: "type",
                description: "Choose which music to play",
                type: Constants.ApplicationCommandOptionTypes.STRING,
                required: true,
                choices: [
                    {
                        name: "JPOP",
                        value: "jpop"
                    },
                    {
                        name: "KPOP",
                        value: "kpop"
                    }
                ]
            }]
        });

        this.inlineVolume = this.client.config.volumeControl ? { inlineVolume: true } : {};
    }

    execute(interaction: CommandInteraction, args: Eris.InteractionDataOptionsString[]) {
        const guild = interaction.member!.guild;
        const type = args[0].value || "";

        if (interaction.member!.voiceState.channelID) {
            const channelId = interaction.member!.voiceState.channelID;
            const botMember = guild.members.get(this.client.user.id);

            if (botMember!.voiceState.channelID) {
                interaction.createMessage(this.embed('Radio already playing. Use `~leave` and try again.'));
                return;
            }

            const voiceChannel = guild.channels.get(channelId);

            if (voiceChannel instanceof VoiceChannel) {
                voiceChannel.join().then(connection => {
                    const kpop = type == "" ? false : type.toLowerCase() === 'kpop';
                    const stream = kpop ? 'https://listen.moe/kpop/stream' : 'https://listen.moe/stream';

                    connection.play(stream, this.inlineVolume);

                    if (this.client.config.volumeControl) {
                        const volume = this.client.getGuildVolume(connection.id);
                        connection.setVolume((volume / 100));
                    }

                    this.client.channelMaps.set(voiceChannel.id, interaction.channel);
                    interaction.createMessage(this.embed('Playing ' + (kpop ? '**KPOP**' : '**JPOP**') + ' in **' + voiceChannel.name + '**'));
                }).catch(err => {
                    console.log(err);
                    interaction.createMessage(this.embed('Something went wrong. Make sure I have permission to view, connect and speak.'));
                })
            }
        } else {
            interaction.createMessage(this.embed('You must be connected to voice channel.'));
        }
    }
}

export default Play;
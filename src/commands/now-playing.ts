import Eris, { CommandInteraction, InteractionContent, Constants } from "eris";

import Client from "../Client";
import BaseCommand from "../BaseCommand";

class NowPlaying extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "now-playing",
            description: "Shows what is currently playing",
            options: [{
                name: "type",
                description: "Choose which now playing to show",
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
    }

    execute(interaction: CommandInteraction, args: Eris.InteractionDataOptionsString[]) {
        var cp = this.client.wsJPOP.currentPlaying.song;
        const type = args[0].value || "";

        var pop = '(JPOP)';

        if (type && type.toLowerCase() == 'kpop') {
            pop = '(KPOP)';
            cp = this.client.wsKPOP.currentPlaying.song;
        }

        const embed = {
            title: `Now playing ${pop}`,
            color: this.client.embedColor,
            fields: [
                { name: 'Name', value: cp.title },
                {
                    name: (cp.artists.length > 1 ? 'Artists' : 'Artist'),
                    value: cp.artists.map(artist => artist.nameRomaji ? artist.nameRomaji : artist.name).join(', ')
                },
                { name: 'Duration', value: this.formatTime(cp.duration) },
            ],
            footer: {
                text: 'Requested by ' + interaction.member!.username,
                icon_url: interaction.member!.user.avatarURL
            }
        };

        interaction.createMessage({ embed: embed } as InteractionContent);
    }

    formatTime(duration: number) {
        var minutes = ("0" + Math.floor(duration / 60)).slice(-2);
        var seconds = ("0" + Math.floor(duration % 60)).slice(-2);

        return `${minutes}:${seconds}`
    }
}

export default NowPlaying;
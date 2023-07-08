const BaseCommand = require("../BaseCommand.js");

class NowPlaying extends BaseCommand {
    constructor(client) {
        super(client, {
            name: "now-playing",
            description: "Shows what is currently playing",
            choices: [{
                name: "jpop",
                value: "jpop"
            },
            {
                name: "kpop",
                value: "kpop"
            }]
        });
    }

    execute(interaction, args) {
        var cp = this.client.wsJPOP.currentPlaying.song;
        var pop = '(JPOP)';

        if (args[0] && args[0].toLowerCase() == 'kpop') {
            pop = '(KPOP)';
            cp = this.client.wsKPOP.currentPlaying.song;
        }

        const embed = {
            title: `Now playing ${pop}`,
            color: this.client.embedColor,
            fields: [
                {name: 'Name', value: cp.title},
                {
                    name: (cp.artists.length > 1 ? 'Artists' : 'Artist'),
                    value: cp.artists.map(artist => artist.nameRomaji ? artist.nameRomaji : artist.name).join(', ')
                },
                {name: 'Duration', value: this.formatTime(cp.duration)},
            ],
            footer: {
                text: 'Requested by ' + interaction.member.username,
                icon_url: interaction.member.user.avatarURL
            }
        }

        interaction.createMessage({embed: embed})
    }

    formatTime(duration) {
        var minutes = ("0" + Math.floor(duration / 60)).slice(-2);
        var seconds = ("0" + Math.floor(duration % 60)).slice(-2);

        return `${minutes}:${seconds}`
    }
}

module.exports = NowPlaying;
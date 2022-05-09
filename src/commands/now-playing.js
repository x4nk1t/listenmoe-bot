const BaseCommand = require("../BaseCommand.js");

class NowPlaying extends BaseCommand {
    constructor(client){
        super(client, {
            name: 'now-playing',
            aliases: ['np']
        });
    }

    execute(message, args){
        var cp = this.client.wsJPOP.currentPlaying.song;
        var pop = '(JPOP)';
        
        if(args[0] && args[0].toLowerCase() == 'kpop') {
            pop = '(KPOP)';
            cp = this.client.wsKPOP.currentPlaying.song;
        }

        const embed = {
            title: `Now playing ${pop}`,
            color: this.client.embedColor,
            fields: [
                {name: 'Name', value: cp.title},
                {name: (cp.artists.length > 1 ? 'Artists' : 'Artist'), value: cp.artists.map(artist => artist.nameRomaji ? artist.nameRomaji : artist.name).join(', ')},
                {name: 'Duration', value: this.formatTime(cp.duration)},
            ],
            footer: {
                text: 'Requested by '+ message.author.username,
                icon_url: message.author.avatarURL
            }
        }

        message.channel.createMessage({embed: embed})
    }

    formatTime(duration){
        var minutes = ("0"+ Math.floor(duration / 60)).slice(-2);
        var seconds = ("0"+ Math.floor(duration % 60)).slice(-2);

        return `${minutes}:${seconds}`
    }
}

module.exports = NowPlaying;
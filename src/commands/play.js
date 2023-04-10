const {VoiceChannel} = require("eris");
const BaseCommand = require("../BaseCommand.js");

class Play extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'play',
            aliases: ['join'],
            usage: '[jpop|kpop]'
        });

        this.inlineVolume = this.client.config.volumeControl ? {inlineVolume: true} : {};
    }

    execute(message, args) {
        const guild = message.member.guild;

        if (message.member.voiceState.channelID) {
            const channelId = message.member.voiceState.channelID;
            const botMember = guild.members.get(this.client.user.id);

            if (botMember.voiceState.channelID) {
                message.channel.createMessage(this.embed('Radio already playing. Use `~leave` and try again.'));
                return;
            }

            const voiceChannel = guild.channels.get(channelId);

            if (voiceChannel instanceof VoiceChannel) {
                voiceChannel.join().then(connection => {
                    const kpop = args[0] == null ? false : args[0].toLowerCase() === 'kpop';
                    const stream = kpop ? 'https://listen.moe/kpop/stream' : 'https://listen.moe/stream';

                    connection.play(stream, this.inlineVolume);

                    this.client.channelMaps.set(voiceChannel.id, message.channel);
                    message.channel.createMessage(this.embed('Playing ' + (kpop ? '**KPOP**' : '**JPOP**') + ' in **' + voiceChannel.name + '**'));
                }).catch(err => {
                    message.channel.createMessage(this.embed('Something went wrong. Make sure I have permission to view, connect and speak.'));
                })
            }
        } else {
            message.channel.createMessage(this.embed('You must be connected to voice channel.'));
        }
    }
}

module.exports = Play;
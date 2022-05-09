const BaseCommand = require("../BaseCommand.js");

class Volume extends BaseCommand{
    constructor(client){
        super(client, {
            name: 'volume',
            aliases: ['v'],
            usage: '<0-100>',
        });
    }

    execute(message, args){
        if(!this.client.config.volumeControl){
            message.channel.createMessage(this.embed('Volume control is disabled.\nIf you want to enable it, change `volumeControl` to `true` in config file.'));
            return;
        }

        const guild = message.member.guild;
        const volume = args[0];

        if(isFinite(volume) && volume > 0 && volume < 100){
            if(this.isConnected(message)){
                const voiceConnection = this.client.voiceConnections.get(guild.id);

                if(voiceConnection) {
                    voiceConnection.setVolume((volume / 100));

                    message.channel.createMessage(this.embed(`Set volume to \`${volume}\`!`));
                } else {
                    message.channel.createMessage(this.embed('Something went wrong! Try leaving and joining the voice channel.'));
                }
            }
        } else {
            this.sendUsage(message);
        }
    }
}

module.exports = Volume;
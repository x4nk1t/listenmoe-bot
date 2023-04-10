const BaseCommand = require("../BaseCommand.js");

class Status extends BaseCommand {
    constructor(client) {
        super(client, {
            name: 'status',
            aliases: ['stats']
        });
    }

    async execute(message, args) {
        const sent = await message.channel.createMessage('Pong!');
        const ping = Math.round(sent.timestamp - message.timestamp);

        const embed = {
            color: this.client.embedColor,
            fields: [
                {name: 'Ping', value: `${ping}ms`, inline: true},
                {name: 'Uptime', value: this.getUptime(), inline: true},
                {name: 'Streams', value: this.client.voiceConnections.size.toString(), inline: true},
                {
                    name: 'Memory Usage',
                    value: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB/' + (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'MB',
                    inline: true
                },
            ]
        }

        sent.edit({content: '\n', embed: embed})
    }

    getUptime() {
        var date_in_ms = this.client.uptime;
        var delta = Math.abs(date_in_ms) / 1000;

        var days = Math.floor(delta / 86400);
        delta -= days * 86400;

        var hours = Math.floor(delta / 3600) % 24;
        delta -= hours * 3600;

        var minutes = Math.floor(delta / 60) % 60;
        delta -= minutes * 60;

        var seconds = Math.round(delta % 60);
        return (days + 'd ' + hours + 'h ' + minutes + 'm ' + seconds + 's')
    }
}

module.exports = Status;
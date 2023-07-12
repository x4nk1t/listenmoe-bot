import { CommandInteraction, InteractionContentEdit } from "eris";
import BaseCommand from "../BaseCommand";

import Client from "../Client.js";

class Status extends BaseCommand {
    constructor(client: Client) {
        super(client, {
            name: "status",
            description: "Shows the status of the bot"
        });
    }

    async execute(interaction: CommandInteraction, args: undefined) {
        if (interaction instanceof CommandInteraction) {
            await interaction.acknowledge();
            const sent = await interaction.createFollowup('Pong!');
            const ping = Math.round(sent.timestamp - interaction.createdAt);

            const embed = {
                color: this.client.embedColor,
                fields: [
                    { name: 'Ping', value: `${ping}ms`, inline: true },
                    { name: 'Uptime', value: this.getUptime(), inline: true },
                    { name: 'Streams', value: this.client.voiceConnections.size.toString(), inline: true },
                    {
                        name: 'Memory Usage',
                        value: (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + 'MB/' + (process.memoryUsage().rss / 1024 / 1024).toFixed(2) + 'MB',
                        inline: true
                    },
                ]
            };

            interaction.editMessage(sent.id, { content: '\n', embed: embed } as InteractionContentEdit);

        }
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

export default Status;
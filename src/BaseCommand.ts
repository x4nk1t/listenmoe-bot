import Eris, { ApplicationCommandOptions, CommandInteraction, ApplicationCommandOptionWithMinMax } from "eris";
import Client from "./Client";
import { ListenMoe } from "../index";

abstract class BaseCommand {
    client: Client;
    name: string;
    description: string;
    embedColor: number;
    options: ApplicationCommandOptions[] | ApplicationCommandOptionWithMinMax[];

    constructor(client: Client, options: ListenMoe.CommandOptionsStructure) {
        this.client = client;

        this.name = options.name || '';
        this.description = options.description || 'N/A';
        this.options = options.options || [];

        this.embedColor = this.client.embedColor;
    }

    embed(message: string) {
        return this.client.embed(message);
    }

    abstract execute(interaction: CommandInteraction, args: Eris.InteractionDataOptions[] | undefined): void;

    isConnected(interaction: CommandInteraction) {
        const guild = interaction.member!.guild;
        const channelId = interaction.member!.voiceState.channelID;
        if (channelId) {
            const botMember = guild.members.get(this.client.user.id);

            if (botMember!.voiceState.channelID) {
                return true;
            } else {
                interaction.createMessage(this.embed('I\'m not connected to any channels.'));
            }
        } else {
            interaction.createMessage(this.embed('You must be connected to voice channel.'));
        }
        return false;
    }
}

export default BaseCommand;
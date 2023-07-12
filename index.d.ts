import Eris, { ApplicationCommandOptions, ApplicationCommandStructure } from "eris";

declare namespace ListenMoe {
    type ListenMoeConfig = {
        configVersion: string,
        botToken: string,
        embedColor: string,
        volumeControl: boolean,
    };

    type CommandOptionsStructure = {
        name: string,
        description: string,
        options?: Eris.ApplicationCommandOptionsWithValue[] | Eris.ApplicationCommandOptionWithMinMax[],
        required?: boolean,
    };

    type ListenMoeResponse = {
        op: number,
        d: SongResponse & HeartBeatResponse,
        t?: string
    };

    type HeartBeatResponse = {
        message: string,
        heartbeat: number
    };

    type GuildVolume = {
        guild_id: string,
        volume: number
    };

    type SongResponse = {
        song: {
            id: number,
            title: string,
            sources: array,
            artists: ArtistData[],
            duration: number,
        }
    };

    type ArtistData = {
        id: number,
        name: string,
        nameRomaji: string,
    };
}
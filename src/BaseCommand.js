class BaseCommand {
    constructor(client, options){
        this.client = client;
        
        this.name = options.name || '';
        this.aliases = options.aliases || [];
        this.usage = options.usage || '';
    }

    embed(message){
        return this.client.embed(message);
    }
}

module.exports = BaseCommand;
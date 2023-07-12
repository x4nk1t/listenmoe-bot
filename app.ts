import Client from './src/Client';
import config from './config.json';

const client = new Client("Bot "+ config.botToken);

client.connect();
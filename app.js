const Client = require('./src/Client.js');
const config = require('./config.json');

const client = new Client(config.botToken);

client.connect();
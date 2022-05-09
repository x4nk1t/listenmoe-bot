# Listen.MOE Bot

A discord bot to stream the [listen.moe](https://listen.moe) radio.

## Prerequisites
- Node v16+ - [nodejs.org](https://nodejs.org)

## Setup

**1. Create [discord bot account](https://discord.com/developers/applications)**

**2. Clone this repo and install npm packages**
```sh
git clone https://github.com/x4nk1t/listenmoe-bot.git
cd listenmoe-bot
npm install
```

**3. Rename config.example.json to config.json**

**4. Edit the config file**
```
{
    "prefix": "~",
    "botToken": "your-bot-token-here",
    "embedColor": "#fe015a"
}
```

**5. Start the bot**

To start the bot run `npm start` or `node app.js`

## Commands
`Prefix can be changed in the config file.`

Default prefix is `~`
- `~play [kpop]` - Start streaming radio to voice channel.
- `~leave` - Bot leaves the voice channel if connected to any.
- `~now-playing [kpop]` - Shows what is currently playing
- `~status` - Shows the bot status

## Contributing
Any contribution is appreciated. Please fork the repo and create a pull request.

## License
Distributed under the GNU License. See `LICENSE` for more information.



_Note: This bot is not affiliated with [listen.moe](https://listen.moe)._
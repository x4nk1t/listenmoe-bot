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
    "configVersion": "0.0.1",
    "prefix": "~",
    "botToken": "your-bot-token-here",
    "embedColor": "#fe015a",
    "volumeControl": false
}
```

**5. Start the bot**

To start the bot run `npm start` or `node app.js`

## Commands
`Prefix can be changed in the config file.`

Default prefix is `~`
- `~leave` - Bot leaves the voice channel if connected to any.
- `~now-playing [kpop]` - Shows what is currently playing
- `~play [kpop]` - Start streaming radio to voice channel.
- `~status` - Shows the bot status
- `~volume` - Changes the volume of the music

_Notes:_
- _Volume control should be set to **true** in config file for volume command to work_
- _**Volume is not saved** so you have to manually change everytime the bot leaves channel_

## Contributing
Any contribution is appreciated. Please fork the repo and create a pull request.

## License
Distributed under the GNU License. See `LICENSE` for more information.



_This bot is not affiliated with [listen.moe](https://listen.moe)._

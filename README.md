# MetaBot

MetaBot is a high-level framework built on top of discord.js for creating discord-bots of any kind.
It is written in Typescript and already has a few modules for music and server moderation included.

*This Project is not finished*

## Features

- Permission management
- Argument parsing with multiple data-types
- Translation and Multi-Language support (If somebody was to translate it)
- Mongodb database
- Command/Handler structure with modules

## Installation and Usage

### Requirements
- node.js with esnext support
- git
- A local mongodb server
- A discord application with a bot
- Internet access
- sh-shell

*These instructions (and parts of the bot itself) only work posix compliant operating systems. If you dont have one, you have to figure it out on your own. Good Luck*

1. Clone this repository
    - `git clone https://www.github.com/MetaMuffin/MetaBot.git`
2. Setup the database with global configurations
    - Create a file `~/.metabotid` and store your client id of the bot in it. (make sure to not add a linebreak at the end)
    - Create a file `~/.metabotsecret` and store your client secret in it.
    - Run `cleandb.sh` from this repo. It will reset your mongo database and store the configuration in the global collection
3. Build and Run the bot
    - `npm run build`
    - `npm run start`


## Documentation

For a short tutorial and example for the basic concept look at `/src/modules/tutorialmodule.ts`.
The documentation is still WIP.

## Licence

This Project is licenced under the GNU GPL v3 Licence.

# MetaBot

MetaBot is a High-Level framework built on top of discord.js for creating Discord-Bots of any kind.
It is written in TypeScript, so it can be used with Javascript too.
*This Framework is not Finished yet so it could be instable*

## Changes

This branch of metabot is in active developement for the following goals:
- MetaBots own api wrapper
- Using deno instead of nodejs
- Using Mongodb instead of json files
- Use async/await instead of .then().then().then().catch().then()

## Features

- Command/Handler structure with modules
- JSON-Database
- Translation and Multi-Language support (If somebody was to translate it)
- Permission management
- Argument parsing with multiple data-types

## Getting started

### Requirements
- deno
- git
- A local mongodb server
- A discord application with a bot
- Internet access

*These instructions (and parts of the bot itself) only work Unix-like operating systemes. If you dont have one, you have to figure it out on your own. Good Luck*

1. Clone this repository
    - `git clone https://www.github.com/MetaMuffin/MetaBot.git`
2. Setup the database with global configurations
    - Create a file `~/.metabotid` and store your client id of the bot in it. (make sure to not add a linebreak at the end)
    - Create a file `~/.metabotsecret` and store your client secret in it.
    - Run `cleandb.sh` from this repo. It will reset your mongo database and store the configuration in the global collection
3. Run the bot
    - `run.sh` or `deno run --unstable --allow-read --allow-write --allow-net --allow-plugin src/index.ts`


## Documentation

For a short tutorial and exampleof the basic concept look at `/src/modules/tutorialmodule.ts`.
The documentation is still WIP.

## Licence

This Project is provided under an GNU GPL v3 Licence.

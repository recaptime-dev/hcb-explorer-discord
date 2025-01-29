# HCB Explorer on Discord

It's the Discord edition of [HCB Stalker] Slack app, built with [Discord.js] library,
running on Hack Club Nest by @ajhalili2006. Most HCB API endpoints are accessible via
slash commands for discoverability and to match the Slack experience.

[HCB Stalker]: https://github.com/Ssmidge/HCBFetcher
[Discord.js]: https://discord.js.org

## Bot features

* Ongoing
  * Port HCB Stalker Slack slash commands to Discord
  * Postgres-based DB + Redis presistence (via Prisma ORM) for org slug caching and stuff
  * Some basic API server for discoverability and maybe docs via [Hono](https://hono.dev)
* Planned
  * Authenicated calls to HCB v4 API via OAuth (once the docs and OAuth support are available)
  * HCB organization activity real-time monitoring over Discord-compatible webhooks (aka logging)
  * Zulip support?!?

## Installation

### Using the hosted instance

Just install the app into your Discord account or server
by [clicking here](https://hcb-explorer-discordbot.ajhalili2006.hackclub.app/install).

### Self-hosting

Running the bot on your own requires a recent Node.js
LTS release and a Discord app ID + bot token ready.

1. Clone the repository and install dependencies:

```sh
git clone https://github.com/recaptime-dev/hcb-explorer-discord && cd hcb-explorer-discord
npm install
```

2. Reset the `.env.production` file by blanking it's contents and using `dotenvx` to add your Discord bot token:

```sh
# see https://superuser.com/questions/90008/how-to-clear-the-contents-of-a-file-from-the-command-line for
# more ways to clear a file's contents
cat /dev/null > .env.production

# required
npm exec dotenvx set -f .env.production -- DISCORD_BOT_TOKEN <your-bot-token>
npm exec dotenvx set -f .env.production -- DISCORD_BOT_APP_ID <your-app-id>
npm exec dotenvx set -f .env.production -- NODE_ENV production

## optional
npm exec dotenvx set -f .env.production -- SENTRY_DSN <your-sentry-dsn>
```

3. Just run with `npm start` and you're good to go!

## License

MPL

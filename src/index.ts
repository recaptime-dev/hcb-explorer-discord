import "./lib/sentry";
import Sentry from './lib/sentry';

import { Events, GatewayIntentBits, ActivityType, Collection } from 'discord.js';
import { ExtendedClient } from './lib/extendedClient';
import { serve as honoServe, } from '@hono/node-server';
import { Hono, Context } from "hono";
import config from './config';

/** Check if we have the Discord bot token first */
if (!config.botToken) {
  throw Error("Discord token missing, try running via dotenvx/doppler?")
}

/**
 * Discord bot client initializer
 */
const client = new ExtendedClient({
  intents: [
    GatewayIntentBits.Guilds
  ],
  presence: {
    status: 'online',
    activities: [
      {
        name: "🏦 hcb.hackclub.com",
        type: ActivityType.Watching,
        url: "https://hackclub.com/hcb",
        state: "Monitoring Hack Club HQ finances and friends"
      }
    ]
  }
})

const app = new Hono()
client.commands = new Collection();

app.get("/", (c) => {
  return c.redirect(config.repo)
})
app.get("/ping", (c) => {
  return c.json({ ok: true, message: "Pong!" })
})
app.get("/invite", (c) => {
  return c.redirect(`https://discord.com/oauth2/authorize?client_id=${config.appId}`)
})

client.once(Events.ClientReady, async readyClient => {
  console.log('[discord]',`Up and running as ${readyClient.user.tag} (app ID: ${readyClient.user.id})`);
  await honoServe({
    fetch: app.fetch,
    port: config.port
  });
  console.log('[api-server]', `Hono server running on port ${config.port}`);

  client.commands.set("ping", require('./commands/utility').ping);
  client.commands.set("donate", require('./commands/utility').donateLinks);
  client.commands.set("hcb", require('./commands/hcb').hcb);
})

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) {
      await interaction.reply({
        content: ":warning: That command does not exist here or not yet implemented."
      });
      return;
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
      await interaction.reply({
        embeds: [
          {
            description: "We are looking into it right now. If you need to, [file a new bug report](https://github.com/recaptime-dev/hcb-explorer-discord) in our repo.",
            fields: [],
            color: 15480656,
            title: ":cross: Something went wrong on our side"
          }
        ],
      })
    }
  };
})

client.login(config.botToken)

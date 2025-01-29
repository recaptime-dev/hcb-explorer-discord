import { DiscordAPIError, REST, Routes } from 'discord.js';
import config from '../config';

const commands = [];

import { donateLinks, inviteLink, ping } from '../commands/utility';
import Sentry from '../lib/sentry';
import {hcb} from '../commands/hcb';
commands.push(ping.data.toJSON());
commands.push(donateLinks.data.toJSON());
commands.push(hcb.data.toJSON());
commands.push(inviteLink.data.toJSON());

(async () => {
  try {
      if (!config.botToken || !config.appId) {
        throw new Error('Bot token and/or Discord application is not defined in the configuration.');
      }
      const rest = new REST({ version: '10' }).setToken(config.botToken);
    
      const result = await rest.put(
        Routes.applicationCommands(config.appId),
        { body: commands }
      );

      console.log(result);
      process.exit(0);
  } catch (error) {
    Sentry.captureException(error);
    if (error instanceof DiscordAPIError) {
      console.log(error.rawError)
      throw Error(error.message);
    } else {
      console.log(error);
    }
  }
})();

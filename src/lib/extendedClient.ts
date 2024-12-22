import { Client, ClientOptions, Collection } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

interface Command {
  data: SlashCommandBuilder;
  execute: Function;
}

export class ExtendedClient extends Client {
  commands: Collection<string, Command>;

  constructor(options: ClientOptions) {
    super(options);
    this.commands = new Collection();
  }
}
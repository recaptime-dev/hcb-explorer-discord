import {
  SlashCommandBuilder,
  CommandInteraction,
  Client,
  EmbedBuilder
} from "discord.js";
import projectConfig from "../config"

export const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong + latency"),
  async execute(
    interaction: CommandInteraction,
    client: Client
  ) {
    const startTime = Date.now();
    const wsPing = client.ws.ping;

    const pingOps = new EmbedBuilder({
      title: "🏓 Pong!",
      description: `Websocket latency: ${wsPing}ms`,
      footer: {
        text: `Command executed in ${Date.now() - startTime}ms`
      }
    }).toJSON()

    await interaction.reply({
      embeds: [pingOps]
    });
  }
};

export const donateLinks = {
  data: new SlashCommandBuilder()
    .setName("donate")
    .setDescription("Support the project by donating to RecapTime.dev"),
  async execute(
    interaction: CommandInteraction,
    client: Client
  ) {
    const donateOps = new EmbedBuilder({
      title: "Donate to RecapTime.dev",
      author: {
        name: "Recap Time Squad",
        icon_url: "https://avatars.githubusercontent.com/u/55875459?v=4",
        url: "https://recaptime.dev"
      },
      description: "You can donate to RecapTime.dev to support the project through the following links:",
      fields: [
        {
          name: "HCB (recommended)",
          value: `https://hcb.hackclub.com/donations/start/${projectConfig.donate.hcb}`
        },
        {
          name: "Open Collective",
          value: `https://opencollective.com/${projectConfig.donate.opencollective}`
        },
        {
          name: "Crypto and other options",
          value: projectConfig.donate.more_details
        }
      ],
      footer: {
        text: "Recap Time Squad is fiscally sponsored by The Hack Foundation (dba Hack Club), a US 501(c)(3) non-profit with EIN 81-2908499."
      }
    }).toJSON()

    await interaction.reply({
      embeds: [donateOps]
    });
  }
}

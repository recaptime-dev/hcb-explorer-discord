import {
  SlashCommandBuilder,
  CommandInteraction,
  EmbedBuilder
} from "discord.js";
import projectConfig from "../config"
import env from "../config";

export const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with pong + latency"),
  async execute(
    interaction: CommandInteraction
  ) {
    const startTime = Date.now();
    const wsPing = interaction.client.ws.ping;

    const pingOps = new EmbedBuilder({
      title: "🏓 Pong!",
      description: `Websocket latency: \`${wsPing}ms\``,
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
    interaction: CommandInteraction
  ) {
    const donateOps = new EmbedBuilder({
      title: "Donate to RecapTime.dev",
      author: {
        name: "Recap Time Squad Crew",
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
          value: `https://opencollective.com/${projectConfig.donate.opencollective}/contribute`
        },
        {
          name: "Crypto and other options",
          value: projectConfig.donate.more_details
        }
      ],
      footer: {
        text: "Recap Time Squad is fiscally sponsored by The Hack Foundation (dba Hack Club), a US 501(c)(3) non-profit with EIN 81-2908499, but this project is not affliated with the HCB team."
      }
    })

    await interaction.reply({
      embeds: [donateOps]
    });
  }
}

export const inviteLink = {
  data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Invite HCB Explorer into your server"),
  async execute(interaction: CommandInteraction) {
    return await interaction.reply({
      embeds: [
        new EmbedBuilder({
          author: {
            name: "Recap Time Squad Crew",
            icon_url: "https://avatars.githubusercontent.com/u/55875459?v=4",
            url: "https://recaptime.dev"
          },
          title: "Invite the bot to your server (or install as standalone app)",
          description: `<${env.url}/install> (or via \`Add app\` in the bot profile page).`
        })
      ]
    })
  }
}
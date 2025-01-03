import { ChatInputCommandInteraction, Client, CommandInteraction, Interaction, SlashCommandBuilder } from "discord.js";
import { fetchOrganization, handleOrgDataEmbed, notFoundEmbed } from "../lib/hcb";

export const hcb = {
  data: new SlashCommandBuilder()
    .setName("hcb")
    .setDescription("Access the HCB API via Discord")
    .addSubcommand(sub =>
      sub.setName("org")
        .setDescription("See a HCB organization's information, such as their website and description.")
        .addStringOption(opt =>
          opt.setName("name")
            .setDescription("The name or ID of the organization.")
            .setRequired(true)
          )
    ),
  async execute(interaction: CommandInteraction & ChatInputCommandInteraction, client: Client) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "org") {
      const name = interaction.options.getString("name") || "hq";
      const api = await fetchOrganization(name);

      if (api.status == 404) {
        return await notFoundEmbed(interaction)
      }

      await handleOrgDataEmbed(interaction, api);
    }
  }
}

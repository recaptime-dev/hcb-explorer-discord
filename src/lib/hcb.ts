import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  EmbedBuilder
} from "discord.js";
import Sentry from "./sentry"
import config from "../config";
import { ErrorMessage, Organization } from "./hcb-types";
import { numberWithCommas } from "./money";
const hcbApi = "https://hcb.hackclub.com/api/v3"

type HcbTxn = {
  id: string
}

export type HcbOrgResponse = {
  status: number;
  headers: IterableIterator<[string, string]> | null;
  body: Organization | ErrorMessage;
  error?: Error | unknown;
}

/**
 * Fetch a single HCB organization
 * @param org Organization slug name or ID
 */
export async function fetchOrganization(org: string): Promise<HcbOrgResponse> {
  try {
    const api = await fetch(`${hcbApi}/organizations/${org}`)
    const body = await api.json();
    const result: HcbOrgResponse = {
      status: api.status,
      headers: api.headers.entries(),
      body: body as Organization
    }
    console.log("[hcb-api]","Fetched organization",result)
    return result
  } catch (error) {
    Sentry.captureException(error)
    return {
      status: 500,
      headers: null,
      body: {
        message: "Something went wrong while fetching the organization."
      },
      error
    }
  }
}

export async function notFoundEmbed(interact: CommandInteraction) {
  return await interact.reply({
    embeds: [
      new EmbedBuilder()
        .setTitle("Organization not found")
        .setDescription("The organization you requested was either not found or not discoverable without enabling Transparency Mode.")
        .setFooter({
          text: "If it is a private organization you manage, you may need to enable Transparency Mode to view it via the public API."
        })
        .setColor("Red")
    ]
  })
}

function parseOrgType(org_id: string | null, org_type: Organization["category"]): string {
  // check if it is a OSS project on HCB
  const isOpenSourceProject = config.opensource_org_ids.includes(org_id || "org_null")

  let orgTypeText = `Sandbox/uncategorized project`
  if (org_type == "hack_club_hq") {
    orgTypeText = "Hack Club HQ"
  } else if (org_type == "hack_club") {
    orgTypeText = "Local Hack Club"
  } else if ((org_type == "hackathon" || org_type == "nonprofit") && isOpenSourceProject == true) {
    orgTypeText = "Open-source Project/Organization"
  } else if (org_type == "hackathon" && isOpenSourceProject == false) {
    orgTypeText = "Hackathon"
  } else if (org_type == "nonprofit" && isOpenSourceProject == false) {
    orgTypeText = "Non-profit Organization"
  } else if (org_type == "robotics_team") {
    orgTypeText = "FIRST / Robotics team"
  } else if (org_type == "climate") {
    orgTypeText = "Climate-focused Organization"
  }

  return orgTypeText
}

export async function handleOrgDataEmbed(interact: CommandInteraction, data: HcbOrgResponse) {
  const { id, category, logo, background_image, balances, slug } = data.body

  // buttons
  const donationBtn = new ButtonBuilder()
    .setStyle(ButtonStyle.Link).setLabel("Donate")
    .setURL(data.body.donation_link || "https://hcb.hackclub.com")
  const website = new ButtonBuilder()
    .setStyle(ButtonStyle.Link).setLabel("Website")
    .setURL(data.body.website || `https://hcb.hackclub.com/${slug}`)

  const bal_normalized = {
    total_raised: numberWithCommas(Math.abs(balances.total_raised/ 100)),
    current: numberWithCommas(Math.abs(balances.balance_cents / 100)),
    incoming: numberWithCommas(Math.abs(balances.incoming_balance_cents / 100)),
    outcoming: numberWithCommas(Math.abs(balances.fee_balance_cents / 100)),
  }

  if (data.error) {
    return await interact.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Something went wrong on our side")
          .setDescription("Don't worry, [Sentry](https://sentry.io) has logged it on our side. We'll be looking onto it soon.")
          .setColor("Red")
      ]
    })
  }

  const base = new EmbedBuilder({
    author: {
      name: "HCB Explorer",
      url: config.repo,
      icon_url: config.brand_icon_url
    },
    title: data.body?.name || "Unknown organization",
    url: `https://hcb.hackclub.com/${slug ?? ""}`,

  }).addFields(
    { name: "Organization ID and slug", value: `\`${id}\` | \`${slug}\``},
    { name: "Type", value: parseOrgType(id, category)},
    { name: "Total raised in USD", value: bal_normalized.total_raised.toString()},
    { name: "Current balance in USD", value: bal_normalized.current.toString(), inline: true},
  )

  if (logo !== null) base.setThumbnail(logo);
  if (background_image !== null) base.setImage(background_image)
  if (data.body.public_message !== null) base.setDescription(data.body.public_message)
  
  // Disable the buttons if the fields are empty
  if (data.body.donation_link == null) {
    donationBtn.setDisabled(true)
  }

  if (data.body.website == null) {
    website.setDisabled(true)
  }
  
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(donationBtn, website)

  return await interact.reply({
    embeds: [base],
    components: [row1]
  })
};

export async function handleOrgBalanceEmbed(interact: CommandInteraction, data: HcbOrgResponse) {
  const { balances, logo, slug } = data.body
  const bal_normalized = {
    total_raised: numberWithCommas(Math.abs(balances.total_raised/ 100)),
    current: numberWithCommas(Math.abs(balances.balance_cents / 100)),
    incoming: numberWithCommas(Math.abs(balances.incoming_balance_cents / 100)),
    outcoming: numberWithCommas(Math.abs(balances.fee_balance_cents / 100)),
  }

  if (data.error) {
    return await interact.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("Something went wrong on our side")
          .setDescription("Don't worry, we have logged the problem on our side. We're looking into it soon.")
          .setColor("Red")
      ]
    })
  }

  const base = new EmbedBuilder({
    author: {
      name: "HCB Explorer",
      url: config.repo,
      icon_url: config.brand_icon_url
    },
    title: data.body.name || "Unknown organization",
    url: `https://hcb.hackclub.com/${slug ?? ""}`,
  }).addFields(
    { name: "Total raised in USD", value: bal_normalized.total_raised.toString()},
    { name: "Current balance in USD", value: bal_normalized.current.toString(), inline: true},
    { name: "Incoming balance in USD", value: bal_normalized.incoming.toString()},
    { name: "Outgoing balance in USD", value: bal_normalized.outcoming.toString(), inline: true},
  )

  if (logo !== null) base.setThumbnail(logo);

  return await interact.reply({
    embeds: [base]
  })
}

export async function handleTxnDataEmbed(_interact: CommandInteraction, data: HcbTxn) {
  // to be implemented soon
  console.log(data)
}

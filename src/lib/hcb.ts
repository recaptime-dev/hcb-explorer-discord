import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CommandInteraction, EmbedBuilder, Interaction } from "discord.js";
import Sentry from "./sentry"
import config from "../config";
const hcbApi = "https://hcb.hackclub.com/api/v3"

type HcbOrgUser = {
  id: string;
  object: string;
  full_name: string;
  admin: boolean;
  photo: string;
};

type HcbOrgCategory =
  | "climate"
  | "hackathon"
  | "hack_club"
  | "nonprofit"
  | "robotics_team"
  | "hack_club_hq"
  | null;

type HcbOrg = {
  id: string | null;
  object: string | null;
  href: string | null;
  name: string | null;
  slug: string | null;
  website?: string;
  category: HcbOrgCategory;
  transparent: true;
  demo_mode: boolean;
  logo: string | null;
  donation_header: string | null;
  background_image: string | null;
  public_message: string | null;
  donation_link: string | null;
  balances: {
    balance_cents: number | null;
    fee_balance_cents: number | null;
    incoming_balance_cents: number | null;
    total_raised: number | null;
  };
  created_at: string | null;
  users: Array<HcbOrgUser>;
  message?: string;
};

export type HcbOrgResponse = {
  status: number;
  headers: IterableIterator<[string, string]> | null;
  body: HcbOrg;
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
      body: body as HcbOrg
    }
    console.log("[hcb-api]","Fetched organization",result)
    return result
  } catch (error) {
    Sentry.captureException(error)
    return {
      status: 500,
      headers: null,
      body: {
        message: "Something went wrong while fetching the organization.",
        id: null,
        object: null,
        href: null,
        name: null,
        slug: null,
        category: null,
        transparent: true,
        demo_mode: false,
        logo: null,
        donation_header: null,
        background_image: null,
        public_message: null,
        donation_link: null,
        balances: {
          balance_cents: null,
          fee_balance_cents: null,
          incoming_balance_cents: null,
          total_raised: null
        },
        created_at: null,
        users: []
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

function parseOrgType(org_id: string | null, org_type: HcbOrgCategory) {
  // check if it is a OSS project on HCB
  const isOpenSourceProject = config.opensource_org_ids.includes(org_id || "org_null")

  let orgTypeText = `Sandbox/uncategorized project`
  if (org_type == "hack_club_hq") {
    orgTypeText = "Hack Club HQ"
  } else if (org_type == "hack_club") {
    orgTypeText = "Local Hack Club"
  } else if (org_type == "hackathon") {
    orgTypeText = "Hackathon"
    if (isOpenSourceProject == true) orgTypeText += " / Open-source Project or Organization"
  } else if (org_type == "nonprofit") {
    orgTypeText = "Non-profit Organization"
    if (isOpenSourceProject == true) orgTypeText +=" / Open-source Project"
  } else if (org_type == "robotics_team") {
    orgTypeText = "FIRST / Robotics team"
  } else if (org_type == "climate") {
    orgTypeText = "Climate-focused Organization"
  }

  return orgTypeText
}

export async function handleOrgDataEmbed(interact: CommandInteraction, data: HcbOrgResponse) {
  const { id, category, logo, background_image, balances } = data.body
  let donationBtn = new ButtonBuilder()
    .setStyle(ButtonStyle.Link).setLabel("Donate")
    .setEmoji(`💸`)
    .setDisabled(true)
  let website = new ButtonBuilder()
    .setStyle(ButtonStyle.Link).setLabel("Donate")
    .setEmoji(`:globe_with_meridians:`)
    .setDisabled(true)
  const bal_normalized = {
    total_raised: (balances.total_raised ?? 0) / 100,
    current: (balances.balance_cents ?? 0) / 100,
    incoming: (balances.incoming_balance_cents ?? 0) / 100,
    outcoming: (balances.fee_balance_cents ?? 0) / 100,
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
    title: data.body.name || "Unknown organization",
    url: data.body.href || "https://hcb.hackclub.com",
  }).addFields(
    { name: "Organization ID", value: id || "null"},
    { name: "Type", value: parseOrgType(id, category)},
    { name: "Total raised in USD", value: bal_normalized.total_raised.toString()},
    { name: "Current balance in USD", value: bal_normalized.current.toString(), inline: true},
  )

  if (logo !== null) base.setThumbnail(logo);
  if (background_image !== null) base.setImage(background_image)
  if (data.body.public_message !== null) base.setDescription(data.body.public_message)
  
  if (data.body.donation_link !== null) {
     
  }
  
  const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(donationBtn, website)

  return await interact.reply({
    embeds: [base],
    components: [row1]
  })
}

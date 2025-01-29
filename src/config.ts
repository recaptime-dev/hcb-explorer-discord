import pkgMetadata from "../package.json";

export default {
  port: Number(process.env.PORT) || 3000,
  appId: process.env.DISCORD_BOT_APP_ID,
  botToken: process.env.DISCORD_BOT_TOKEN,
  sentryDSN: process.env.SENTRY_DSN || "",
  repo: process.env.REPO_URL || pkgMetadata.repository.url,
  support: {
    discord: process.env.DISCORD_INVITE_CODE || "FyBYQrJtUX",
    slack: {
      team_id: process.env.SLACK_TEAM_ID || "T0266FRGM",
      channel_id: process.env.SLACK_CHANNEL_ID || "C07H1R2PW9W"
    },
    zulip: {
      host: process.env.ZULIP_HOMESERVER_HOST || "recaptime-dev.zulipchat.com",
      channel: process.env.ZULIP_CHANNEL || "hcb-ops"
    }
  },
  donate: {
    hcb: process.env.HCB_ORG_SLUG || "recaptime-dev",
    opencollective: process.env.OPENCOLLECTIVE_SLUG || "recaptime-dev",
    github_sposnors: process.env.GITHUB_USERNAME || "ajhalili2006",
    more_details: process.env.DONATE_DETAILS_URL || "https://recaptime.dev/donate"
  },
  brand_icon_url: "https://hcb.hackclub.com/brand/hcb-icon-icon-dark.png",
  // currently HCB doesn't categorize open-source projects yet, so we had
  // to verify ourselves manually for now.
  opensource_org_ids: [
    "org_G3ud13", // https://hcb.hackclub.com/recaptime-dev
    "org_RRu9K4", // https://hcb.hackclub.com/lorebooks-wiki
  ]
}

import { hcb } from "../commands/hcb";

type Discord = {
    server_id: string;
    channel_id: string;
}

type MonitoredOrg = {
    hcb_org_slug: string;
    discord: {
        server_id: string;
        channel_id: string;
    }
}

/**
 * This module contains the default configuration for logging HCB transactions
 * almost in real-time to Discord and Zulip channels as they are being imported into the
 * Postgres database.
 */
export const DefaultMonitoredOrgs: MonitoredOrg[] = [
    {
        hcb_org_slug: "recaptime-dev",
        discord: {
            server_id: "",
            channel_id: ""
        }
    },
    {
        hcb_org_slug: "lorebooks-wiki",
        discord: {
            server_id: "",
            channel_id: ""
        }
    }
]
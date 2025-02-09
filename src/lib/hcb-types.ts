/*
 * Adopted from https://github.com/Ssmidge/HCBFetcher/blob/761a812bb7b820de432997e9a71fe2fe64f24c23/src/types/HCB.ts 
 */

type Transaction = {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    memo: string;
    date: string;
    type: "invoice" | "donation" | "ach_transfer" | "check" | "transfer" | "bank_account_transaction" | "card_charge";
    pending: boolean;
    receipts: {
      count: number;
      missing: boolean;
    };
    comments: {
      count: number;
    };
    organization: Organization;
    tags: Tag[];
    card_charge?: CardCharge;
    ach_transfer?: ACHTransfer;
    check?: Check;
    donation?: Donation;
    invoice?: Invoice;
    transfer?: Transfer;
    message?: string;
  };
  
type Organization = {
    id: string;
    object: string;
    href: string;
    name: string;
    slug: string;
    website: string;
    category: "climate" | "hackathon" | "hack_club" | "nonprofit" | "robotics_team" | "hack_club_hq"
    transparent: boolean;
    demo_mode: boolean;
    logo: string;
    donation_header: string;
    background_image: string;
    public_message: string;
    donation_link: string;
    balances: {
      balance_cents: number;
      fee_balance_cents: number;
      incoming_balance_cents: number;
      total_raised: number;
    };
    created_at: string;
    users: User[];
    message: string;
  };
  
  type User = {
    id: string;
    object: string;
    full_name: string;
    admin: boolean;
    photo: string;
  };
  
  type Tag = {
    id: string;
    object: string;
    label: string;
  };
  
  type CardCharge = {
    id: string;
    object: string;
    href: string;
    memo: string;
    transaction: Transaction;
    organization: Organization;
    amount_cents: number;
    date: string;
    card: Card;
    user: User;
  };
  
  type Card = {
    id: string;
    object: string;
    href: string;
    name: string;
    type: "virtual" | "physical";
    status: "active" | "frozen" | "canceled";
    issued_at: string;
    owner: User;
    organization: Organization;
    message?: string;
  };
  
  type ACHTransfer = {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    date: string;
    bank_name: string;
    bank_id: string;
    account_id: string;
    status: "pending" | "completed" | "failed";
    user: User;
    organization: Organization;
  };
  
  type Check = {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    date: string;
    payee: string;
    status: "pending" | "completed" | "canceled";
    user: User;
    organization: Organization;
};
  
  type Donation = {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    date: string;
    donor_name: string;
    donor_email: string;
    status: "pending" | "completed" | "failed";
    user: User;
    organization: Organization;
};
  
  type Invoice = {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    date: string;
    description: string;
    status: "pending" | "completed" | "canceled";
    user: User;
    organization: Organization;
};
  
  type Transfer = {
    id: string;
    object: string;
    href: string;
    amount_cents: number;
    date: string;
    source_organization: Organization;
    destination_organization: Organization;
    status: "pending" | "completed" | "failed";
    user: User;
};

type ErrorMessage = {
    message: string;
}

export {
    Transaction,
    Organization,
    Card,
    ErrorMessage
};
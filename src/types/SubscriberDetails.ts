export type SubscriberDetail = {
  subscriber_id: string;
  subscriber_url?: string;
  unique_key_id: string;
  type: NetworkPaticipantType;
  signing_public_key: string;
  valid_until: string;
};
export enum NetworkPaticipantType {
  BAP = 'BAP',
  BPP = 'BPP',
  BG = 'BG',
  BREG = 'BREG',
}

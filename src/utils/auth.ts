import axios from 'axios';
import {createSigningString, signMessage, verifyMessage} from './crypto';
import {SubscriberDetail} from '@/types';

const remove_quotes = (value: string) => {
  if (
    value.length >= 2 &&
    value.charAt(0) === '"' &&
    value.charAt(value.length - 1) === '"'
  ) {
    value = value.substring(1, value.length - 1);
  }
  return value;
};

async function getSubscriberDetails(
  subscriber_id: string,
  unique_key_id: string,
  registryUrl: string
) {
  const subscribers: SubscriberDetail[] = [];
  const response = await axios.post(registryUrl, {
    subscriber_id,
    ukId: unique_key_id,
  });
  response.data
    .map((data: object) => {
      const {subscriber_url, ...subscriberData} = data as SubscriberDetail;
      return {
        ...subscriberData,
        unique_key_id: subscriber_url,
      };
    })
    .forEach((data: SubscriberDetail) => {
      try {
        subscribers.push({
          subscriber_id: data.subscriber_id,
          unique_key_id: data.unique_key_id,
          type: data.type,
          signing_public_key: data.signing_public_key,
          valid_until: data.valid_until,
        });
      } catch (error) {
        console.log(error);
      }
    });

  return subscribers;
}

const split_auth_header = (auth_header: string) => {
  const header = auth_header.replace('Signature ', '');
  const re = /\s*([^=]+)=([^,]+)[,]?/g;
  let m;
  const parts: any = {};
  while ((m = re.exec(header)) !== null) {
    if (m) {
      parts[m[1]] = remove_quotes(m[2]);
    }
  }
  return parts;
};

export async function verifyHeader(
  header: string,
  rawBody: string,
  registryUrl: string
): Promise<boolean> {
  try {
    const parts = split_auth_header(header);
    if (!parts || Object.keys(parts).length === 0) {
      return false;
    }

    const subscriber_id = parts['keyId'].split('|')[0];
    const unique_key_id = parts['keyId'].split('|')[1];
    const subscribers_details = await getSubscriberDetails(
      subscriber_id,
      unique_key_id,
      registryUrl
    );

    for (const each of subscribers_details as SubscriberDetail[]) {
      const public_key = each.signing_public_key;
      const {signing_string} = await createSigningString(
        rawBody,
        parts['created'],
        parts['expires']
      );
      // console.log("NP Public Key", public_key)
      const verified = await verifyMessage(
        parts['signature'],
        signing_string,
        public_key
      );
      if (verified) return true;
    }
    return false;
  } catch (error) {
    console.log('ERROR:', error);
    return false;
  }
}

export const createAuthHeader = async (
  message: string,
  privateKey: string,
  subscriberId: string,
  uniqueKey: string
) => {
  const {signing_string, expires, created} = await createSigningString(message);
  const signature = await signMessage(signing_string, privateKey);
  const header = `Signature keyId="${subscriberId}|${uniqueKey}|ed25519",algorithm="ed25519",created="${created}",expires="${expires}",headers="(created) (expires) digest",signature="${signature}"`;
  return header;
};

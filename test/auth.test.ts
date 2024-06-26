import {createAuthHeader, verifyHeader} from '../src';
import {PRIVATE_KEY, REGISTRY_URL, SUBSCRIBER_ID, UNIQUE_KEY} from './authKeys';

const REQ_BODY = 'THIS IS A TEST';

test('Testing Auth Header Creation', async () => {
  const header = await createAuthHeader(
    REQ_BODY,
    PRIVATE_KEY,
    SUBSCRIBER_ID,
    UNIQUE_KEY
  );
  expect(header).toContain(
    'Signature keyId="mock.ondc.org/api|a84fa513-2251-4126-ad0c-75fe3b799d85|ed25519",algorithm="ed25519",'
  );
});

test('Testing Auth Header Validation', async () => {
  const header = await createAuthHeader(
    REQ_BODY,
    PRIVATE_KEY,
    SUBSCRIBER_ID,
    UNIQUE_KEY
  );

  const verificationStatus = await verifyHeader(header, REQ_BODY, REGISTRY_URL);

  expect(verificationStatus).toBe(true);
});

import {
  BecknAuth,
  BecknConfig,
  createAuthHeader,
  verifyAuthHeader,
} from '../src';
import {PRIVATE_KEY, REGISTRY_URL, SUBSCRIBER_ID, UNIQUE_KEY} from './authKeys';

describe('Auth Functions Test', () => {
  const REQ_BODY = 'THIS IS A TEST';
  describe('Testing through functional manner', () => {
    it('Testing Auth Header Creation', async () => {
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
    it('Testing Auth Header Validation', async () => {
      const header = await createAuthHeader(
        REQ_BODY,
        PRIVATE_KEY,
        SUBSCRIBER_ID,
        UNIQUE_KEY
      );

      const verificationStatus = await verifyAuthHeader(
        header,
        REQ_BODY,
        REGISTRY_URL
      );

      expect(verificationStatus).toBe(true);
    });
  });

  describe('Testing through OOP Manner', () => {
    const becknConfig = new BecknConfig('beckn://ret10.ondc');
    becknConfig.setConfig('privateKey', PRIVATE_KEY);
    becknConfig.setConfig('registryUrl', REGISTRY_URL);
    becknConfig.setConfig('subscriberId', SUBSCRIBER_ID);
    becknConfig.setConfig('uniqueKey', UNIQUE_KEY);

    it('Checks Auth Header Creation', async () => {
      const becknAuth = new BecknAuth(becknConfig);
      const header = await becknAuth.createHeader(REQ_BODY);
      expect(header).toContain(
        'Signature keyId="mock.ondc.org/api|a84fa513-2251-4126-ad0c-75fe3b799d85|ed25519",algorithm="ed25519",'
      );
    });

    it('Checks Auth Header Verification', async () => {
      const becknAuth = new BecknAuth(becknConfig);
      const header = await becknAuth.createHeader(REQ_BODY);
      const verificationStatus = await becknAuth.verifyHeader(header, REQ_BODY);

      expect(verificationStatus).toBe(true);
    });
  });
});

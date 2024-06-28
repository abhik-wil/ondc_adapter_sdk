import {BecknConfig} from '../src';
test('Testing Config Manager Host', () => {
  const becknConfig = new BecknConfig('beckn://ret10.ondc');
  console.log('CONFIG DOMAIN', becknConfig.getDomain());
});

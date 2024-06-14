import {ConfirmMessageOrderFulfillmentsTagsDeliveryTerms} from '@/generated';
import {Mapping} from '@/types';

test('Testing initialization', () => {
  const e: Mapping<ConfirmMessageOrderFulfillmentsTagsDeliveryTerms> = {
    INCOTERMS: 'something',
    NAMED_PLACE_OF_DELIVERY: 'Something else',
  };
  console.log(e);
});

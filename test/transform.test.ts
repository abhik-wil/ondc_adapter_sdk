import client from './data/descriptor/client.mock.json';
import transformed from './data/descriptor/transformed.mock.json';
import mapping from './data/descriptor/mapping.mock.json';
import {getArray, transform, Descriptor, Mapping} from '../src';

test('Testing Descriptor Transform', () => {
  const toBeTransformed = client;
  const expectedTansformedResult = transformed;
  const transformMapping: Mapping<Descriptor> = mapping;
  // const result = transform(toBeTransformed, transformMapping);
  // console.log('LOADED original::', toBeTransformed);
  // console.log('LOADED tranformed::', expectedTansformedResult);
  // console.log('LOADED mapping::', transformMapping);
  // console.log('TRANSFORMED :::', result);
  console.log(
    'MAPPED ARRAY',
    getArray(toBeTransformed, 'mediaFiles[].fileType.trial[].type')
  );
  // expect(result).toEqual(expectedTansformedResult);
});

import client from './data/descriptor/client.mock.json';
import transformed from './data/descriptor/transformed.mock.json';
import mapping from './data/descriptor/mapping.mock.json';
import {transform, Descriptor, Mapping} from '../src';

test('Testing Descriptor Transform through direct assignment', () => {
  const toBeTransformed = client;
  const expectedTansformedResult = transformed;
  const transformMapping: Mapping<Descriptor> = {
    name: 'descriptorName',
    code: 'descriptorCode',
    short_desc: 'descriptions.short',
    long_desc: 'descriptions.long',
    media: [
      {
        mimetype: 'mediaFiles[].fileType',
        url: 'mediaFiles[].fileLink',
        signature: 'mediaFiles[].fileSignature',
        dsa: 'mediaFiles[].algorithm',
      },
    ],
    images: [
      {
        url: 'imageGallery[].imageLink',
        size_type: 'imageGallery[].dimension',
        width: 'imageGallery[].imgWidth',
        height: 'imageGallery[].imgHeight',
      },
    ],
  };
  const result = transform(toBeTransformed, transformMapping);

  expect(result).toEqual(expectedTansformedResult);
});

test('Testing Descriptor Transform through file-based assignment', () => {
  const toBeTransformed = client;
  const expectedTansformedResult = transformed;
  const transformMapping = mapping as Mapping<Descriptor>;
  const result = transform(toBeTransformed, transformMapping);

  expect(result).toEqual(expectedTansformedResult);
});

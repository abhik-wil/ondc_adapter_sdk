import path from 'path';
import {BecknConfig, BecknContext} from '../src';
import client from './data/descriptor/client.mock.json';
import transformed from './data/descriptor/transformed.mock.json';

test('Testing Config Manager with Default Config', () => {
  const becknConfig = new BecknConfig('beckn://ret10.ondc');

  expect(becknConfig.getDomain()).toBe('ret10.ondc');
  expect(becknConfig.getConfig('schemaPath')).toBe('beckn_openapi.yaml');
  becknConfig.setConfig(
    'mappingPath',
    path.resolve(__dirname, './data/descriptor')
  );
  expect(becknConfig.getConfig('mappingPath')).toBe(
    path.resolve(__dirname, './data/descriptor')
  );
});

test('Testing Config Manager with Custom Config', () => {
  const becknConfig = new BecknConfig(
    'beckn://ret10.ondc',
    path.resolve(__dirname, './data/config.yaml')
  );
  becknConfig.setConfig(
    'mappingPath',
    path.resolve(__dirname, './data/descriptor')
  );
  expect(becknConfig.getDomain()).toBe('ret10.ondc');
  expect(becknConfig.getConfig('schemaPath')).toBe(
    './test/data/beckn_openapi.yaml'
  );
  expect(becknConfig.getConfig('mappingPath')).toBe(
    path.resolve(__dirname, './data/descriptor')
  );
});

test('Testing Beckn Context Transform', () => {
  const becknConfig = new BecknConfig(
    'beckn://ret10.ondc',
    path.resolve(__dirname, './data/config.yaml')
  );
  becknConfig.setConfig(
    'mappingPath',
    path.resolve(__dirname, './data/descriptor')
  );
  const becknContext: BecknContext = new BecknContext(becknConfig);
  const transformedData = becknContext.transform(client, 'descriptor');
  expect(transformedData).toEqual(transformed);
});

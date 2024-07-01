import path from 'path';
import {BecknConfig, BecknContext} from '../src';
import descriptorClientData from './data/descriptor/client.mock.json';
import descriptorTransformedData from './data/descriptor/transformed.mock.json';
import providerClientData from './data/provider/client.mock.json';
import providerTransformedData from './data/provider/transformed.mock.json';

describe('Testing Config and Context Manager', () => {
  it('Tests Config Manager with Default Config', () => {
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

  it('Tests Config Manager with Custom Config', () => {
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

  describe('Testing Beckn Context Transform', () => {
    it('Tests using Descriptor Schema', () => {
      const becknConfig = new BecknConfig(
        'beckn://ret10.ondc',
        path.resolve(__dirname, './data/config.yaml')
      );
      becknConfig.setConfig(
        'mappingPath',
        path.resolve(__dirname, './data/descriptor')
      );
      const becknContext: BecknContext = new BecknContext(becknConfig);
      const transformedData = becknContext.transform(
        descriptorClientData,
        'descriptor'
      );
      expect(transformedData).toEqual(descriptorTransformedData);
    });
    it('Tests using Provider Schema', () => {
      const becknConfig = new BecknConfig(
        'beckn://ret10.ondc',
        path.resolve(__dirname, './data/config.yaml')
      );
      becknConfig.setConfig(
        'mappingPath',
        path.resolve(__dirname, './data/provider')
      );
      const becknContext: BecknContext = new BecknContext(becknConfig);
      const transformedData = becknContext.transform(
        providerClientData,
        'provider'
      );
      console.log('ITEMS', (transformedData as any).items);
      expect(transformedData).toEqual(providerTransformedData);
    });
  });
});

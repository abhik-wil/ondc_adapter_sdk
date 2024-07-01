import fs from 'fs';
import YAML from 'yaml';
import path from 'path';
import {BecknConfig} from './BecknConfig';
import {loadYamlFile, transform} from '../utils';

export class BecknContext {
  schemas: any;
  domain: string;
  initialized = false;

  constructor(private config: BecknConfig) {
    this.domain = config.parseDomain();
    this.loadSchemasFromOpenAPI();
  }

  async loadSchemasFromOpenAPI() {
    const schemaPath = this.config.getConfig('schemaPath');
    try {
      // Check if schemaPath is a URI
      // Fetch the URI File.
      const openApiSpec: any = await loadYamlFile(schemaPath);
      this.schemas = openApiSpec.components.schemas;
    } catch (error) {
      try {
        // Try to open it as a file
        const file = fs.readFileSync(schemaPath, 'utf8');
        const openApiSpec = YAML.parse(file);
        this.schemas = openApiSpec.components.schemas;
      } catch (error) {
        console.log('Error Occurred while opening it as a file');
        throw error;
      }
    }
    this.initialized = true;
  }

  loadMapping(mappingKey: string) {
    const mappingPath = path.join(
      this.config.getConfig('mappingPath'),
      `${mappingKey}.json`
    );
    console.log(mappingPath);
    if (!fs.existsSync(mappingPath)) {
      throw new Error(`Mapping path not found for key ${mappingKey}`);
    }
    return JSON.parse(fs.readFileSync(mappingPath).toString());
  }

  getSchema(name: string) {
    return this.schemas[name];
  }

  transform(rawData: object, schemaName: string, mappingKey?: string) {
    // console.log('schemaName', schemaName);
    // console.log('mappingKey', mappingKey);
    const mapping = mappingKey
      ? this.loadMapping(mappingKey)
      : this.loadMapping(schemaName);
    // console.log('mapping', mapping);
    const transformedData = transform(rawData, mapping);
    // if (this.validate(schemaName, transformedData)) {
    //     return transformedData;
    // } else {
    //     throw new Error(`Transformed data is not valid for schema: ${schemaName}`);
    // }
    return transformedData;
  }
}

export default BecknContext;

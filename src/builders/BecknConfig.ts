import fs from 'fs';
import YAML from 'yaml';
import path from 'path';

export class BecknConfig {
  private config: any;
  private domain: string;

  constructor(
    private baseUri: string = 'beckn://ondc',
    private configPath: string = path.resolve(__dirname, '../config.yaml')
  ) {
    this.domain = this.parseDomain();
    this.load();
  }

  load() {
    try {
      const file = fs.readFileSync(this.configPath, 'utf8');
      this.config = YAML.parse(file)[this.domain] || {};
      console.log(this.config);
    } catch (error) {
      console.error(
        `Error loading configuration file at ${this.configPath}:`,
        error
      );
      throw error;
    }
  }

  parseDomain(): string {
    const parsedUrl = new URL(this.baseUri);
    return parsedUrl.host;
  }

  setConfigPath(newPath: string) {
    this.configPath = newPath;
    this.load();
  }

  get(key: string) {
    console.log(this.config['mappingPath']);
    return this.config[key];
  }

  set(key: string, value: any) {
    this.config[key] = value;
  }

  setMapping(schema: string, mappingFile: string) {
    if (!this.config.mappings) {
      this.config.mappings = {};
    }
    this.config.mappings[schema] = path.resolve(
      this.config.mappingDir || path.dirname(this.configPath),
      mappingFile
    );
  }

  getAll() {
    console.log(this.domain);
    console.log(this.config);
    // Resolve paths to absolute paths
    if (this.config.schemaPath) {
      this.config.schemaPath = path.resolve(
        path.dirname(this.configPath),
        this.config.schemaPath
      );
    }
    if (this.config.mappingDir) {
      this.config.mappingDir = path.resolve(
        path.dirname(this.configPath),
        this.config.mappingDir
      );
    }
    if (this.config.mappingPath) {
      for (const key in this.config.mappingPath) {
        if (
          Object.prototype.hasOwnProperty.call(this.config.mappingPath, key)
        ) {
          this.config.mappingPath[key] = path.resolve(
            path.dirname(this.configPath),
            this.config.mappingPath[key]
          );
        }
      }
    }
    return this.config;
  }

  getDomain(): string {
    return this.domain;
  }

  getBaseUri(): string {
    return this.baseUri;
  }
}


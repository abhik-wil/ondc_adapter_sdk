import fs from 'fs';
import YAML from 'yaml';
import path from 'path';

export class BecknConfig {
  private config: {
    schemaPath: string;
    mappingPath: string;
    privateKey?: string;
    subscriberId?: string;
    uniqueKey?: string;
    registryUrl?: string;
  };
  private domain: string;

  constructor(
    private baseUri: string = 'beckn://ondc',
    private configPath: string = path.resolve(
      __dirname,
      '../template_config.yaml'
    )
  ) {
    this.domain = this.parseDomain();
    const file = fs.readFileSync(this.configPath, 'utf8');
    this.config = YAML.parse(file)[this.domain] || {};
  }

  parseDomain(): string {
    const parsedUrl = new URL(this.baseUri);
    return parsedUrl.host;
  }

  setConfigPath(newPath: string) {
    this.configPath = newPath;
    const file = fs.readFileSync(this.configPath, 'utf8');
    this.config = YAML.parse(file)[this.domain] || {};
  }

  authParamsSet(): boolean {
    return !(
      !this.config.privateKey ||
      !this.config.subscriberId ||
      !this.config.uniqueKey
    );
  }

  getConfig(key: keyof typeof this.config) {
    return this.config[key as keyof typeof this.config];
  }

  setConfig(key: keyof typeof this.config, value: string) {
    this.config[key as keyof typeof this.config] = value;
  }

  getDomain(): string {
    return this.domain;
  }

  getBaseUri(): string {
    return this.baseUri;
  }
}

import {
  DOMAIN_BUILD_LINKS,
  DOMAIN_CODE,
  loadYamlFile,
  saveToLocalFile,
} from '@/utils';
import path from 'path';
import {parse} from 'yaml';

export class DomainBuildInitiator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private build: any;
  private intialized = false;
  constructor(private domain: DOMAIN_CODE) {}
  async init() {
    const file = await loadYamlFile(DOMAIN_BUILD_LINKS[this.domain]);
    const parsedBuildYaml = parse(file);
    this.build = parsedBuildYaml;
    const buildPath = path.resolve(
      './src/domain-builds',
      `${this.domain}.json`
    );
    saveToLocalFile(JSON.stringify(parsedBuildYaml), buildPath);
    this.intialized = true;
  }

  getTags() {
    if (!this.intialized) throw new Error('Build not initialized');
    return this.build['x-tags'];
  }

  getAttributes() {
    if (!this.intialized) throw new Error('Build not initialized');
    return this.build['x-attributes'];
  }

  getSchema(schema: string) {
    if (!this.intialized) throw new Error('Build not initialized');
    return this.build['components']['schemas'][schema];
  }
}

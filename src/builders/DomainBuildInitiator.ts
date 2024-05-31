import {
  DOMAIN_BUILD_LINKS,
  DOMAIN_CODE,
  loadYamlFile,
  saveToLocalFile,
} from '@/utils';
import path from 'path';
import fs from 'fs';
import {parse} from 'yaml';
import SwaggerParser from '@apidevtools/swagger-parser';

export class DomainBuildInitiator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private build: any;
  private intialized = false;
  constructor(private domain: DOMAIN_CODE) {}
  public async init(refresh = false) {
    const buildPath = path.resolve(
      './src/domain-builds',
      `${this.domain.replace(':', '_')}.json`
    );
    if (!refresh) {
      if (fs.existsSync(buildPath)) {
        this.intialized = true;
        this.build = JSON.parse(fs.readFileSync(buildPath).toString());
        return;
      }
    }
    const file = await loadYamlFile(DOMAIN_BUILD_LINKS[this.domain]);
    const parsedBuildYaml = parse(file);

    const dereferencedBuild = await SwaggerParser.dereference(parsedBuildYaml);
    this.build = dereferencedBuild;
    saveToLocalFile(JSON.stringify(dereferencedBuild), buildPath);
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

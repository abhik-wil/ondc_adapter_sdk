import {
  DOMAIN_BUILD_LINKS,
  DOMAIN_CODE,
  loadYamlFile,
  saveToLocalFile,
} from '../utils';
import path from 'path';
import fs from 'fs';
import {parse} from 'yaml';
// import SwaggerParser from '@apidevtools/swagger-parser';

export class DomainBuildInitiator {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private build: any;
  private intialized = false;
  constructor(public domain: DOMAIN_CODE) {}
  public async init(
    location = './src/domain-builds',
    refresh = false
  ): Promise<boolean> {
    if (!fs.existsSync(location)) {
      fs.mkdirSync(location, {recursive: true});
    }
    const buildPath = path.resolve(
      location,
      `${this.domain.replace(':', '_')}.json`
    );
    if (!refresh) {
      if (fs.existsSync(buildPath)) {
        this.intialized = true;
        this.build = JSON.parse(fs.readFileSync(buildPath).toString());
        return true;
      }
    }
    const file = await loadYamlFile(DOMAIN_BUILD_LINKS[this.domain]);
    const parsedBuildYaml = parse(file);

    this.build = parsedBuildYaml;
    // const dereferencedBuild = await SwaggerParser.dereference(parsedBuildYaml);
    // this.build = dereferencedBuild;
    saveToLocalFile(JSON.stringify(this.build), buildPath);
    this.intialized = true;
    return true;
  }

  isInitialized() {
    if (!this.intialized) throw new Error('Build not initialized');
  }

  getBuild() {
    return this.build;
  }
}

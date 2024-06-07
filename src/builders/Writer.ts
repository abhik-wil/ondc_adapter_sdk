import fs from 'fs';
import path from 'path';
import {ReInflatedObject} from './GenerateType';

export class Writer {
  private _indentSpacing = 0;

  importSection = '';
  mainBody: string;

  constructor(private schemaName: string) {
    this.mainBody = `export type ${schemaName} = {\n`;
    this._indentSpacing += 1;
  }

  public get indentSpacing() {
    return this._indentSpacing;
  }
  public set indentSpacing(value) {
    this._indentSpacing = value;
  }

  addImport(schemaName: string) {
    this.importSection += `import {${schemaName}} from "${schemaName}"`;
  }

  openBlock() {
    this.mainBody += '{\n';
    this._indentSpacing++;
  }

  closeBlock() {
    this.mainBody += '},\n';
    this._indentSpacing--;
  }

  getIndentedAtomic(name: string, optional = false) {
    return `${'  '.repeat(this.indentSpacing)}'${name}'${
      optional && '?'
    }: string,\n`;
  }

  getIndentedReference(name: string, referenceName: string, optional = false) {
    return `${'  '.repeat(this.indentSpacing)}'${name}'${
      optional && '?'
    }: ${referenceName},\n`;
  }

  dumpToFile(location: string): boolean {
    try {
      const data = this.importSection + '\n' + this.mainBody + ';\n';
      fs.writeFileSync(path.join(location, `${this.schemaName}.d.ts`), data);
      return true;
    } catch (error) {
      console.log('ERROR:', error);
      return false;
    }
  }
}

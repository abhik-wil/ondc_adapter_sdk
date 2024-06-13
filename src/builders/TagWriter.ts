import fs from 'fs';
import path from 'path';

export class TagWriter {
  private _indentSpacing = 0;
  schemaName: string;

  importSection = '';
  mainBody: string;

  constructor(schemaName: string) {
    this.schemaName = TagWriter.processSchemaName(schemaName);
    this.mainBody = `export type ${this.schemaName} = {\n`;
    this._indentSpacing += 1;
  }
  static processSchemaName(name: string) {
    return name
      .split(/[._]/g)
      .map(e => e.charAt(0).toUpperCase() + e.slice(1).toLowerCase())
      .join('');
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

  openInnerBlock() {
    this.mainBody += '{\n';
    this._indentSpacing++;
  }

  closeInnerBlock() {
    this.mainBody += '},\n';
    this._indentSpacing--;
  }
  closeWriter() {
    this.mainBody += '};\n';
  }

  writeIndentedAtomic(name: string, optional = false) {
    this.mainBody += `${'  '.repeat(this.indentSpacing)}'${name}'${
      optional ? '?' : ''
    }: string,\n`;
  }

  writeIndentedReference(
    name: string,
    referenceName: string,
    optional = false
  ) {
    this.mainBody += `${'  '.repeat(this.indentSpacing)}'${name}'${
      optional && '?'
    }: ${referenceName},\n`;
  }

  dumpToFile(location: string): boolean {
    try {
      if (!fs.existsSync(location)) {
        fs.mkdirSync(location);
        // throw Error(`Location does not exist: ${location}`);
      }
      const data = this.importSection + '\n' + this.mainBody;
      fs.writeFileSync(path.join(location, `${this.schemaName}.gen.ts`), data);
      return true;
    } catch (error) {
      console.log('ERROR:', error);
      return false;
    }
  }
}

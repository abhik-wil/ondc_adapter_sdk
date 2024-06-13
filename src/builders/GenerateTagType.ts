import {SchemaFetcher} from './SchemaFetcher';
import {TagWriter} from './TagWriter';
import fs from 'fs';
import path from 'path';

type FlattenedObject = Record<string, string>;
export class GenerateTagType {
  generateAndExport(initiator: SchemaFetcher, location = './') {
    const obj = initiator.getTags();
    const flattened = this.flattenNestedObject(obj);
    for (const [name, schema] of Object.entries(flattened)) {
      const writer = new TagWriter(name);
      Object.keys(schema).forEach(tag => writer.writeIndentedAtomic(tag));
      writer.closeWriter();
      writer.dumpToFile(location);
    }
    let barrelExport = '';
    Object.keys(flattened).forEach(
      k =>
        (barrelExport += `export * from './${TagWriter.processSchemaName(
          k
        )}.gen';\n`)
    );
    fs.writeFileSync(path.join(location, 'index.ts'), barrelExport);
    fs.appendFileSync(
      path.join(location, '../', 'index.ts'),
      "\nexport * from './tags';"
    );
    fs.appendFileSync(
      path.join(location, '../../', 'index.ts'),
      `\nexport * from './${initiator.domain.replace(':', '_')}';`
    );
  }

  flattenNestedObject(obj: any): FlattenedObject {
    const result: any = {};

    function flatten(obj: any, prefix = '') {
      for (const [key, value] of Object.entries(obj)) {
        const propName = prefix ? `${prefix}.${key}` : key;
        if (key === 'tags') {
          for (const tagGroup of value as any) {
            const code = `${propName}.${tagGroup.code}`;
            for (const tag of tagGroup['list']) {
              const tagCode = (tag as any).code;
              result[code] = {
                ...result[code],
                [tagCode]: 'string',
              };
            }
          }
        } else if (typeof value === 'object') {
          flatten(value, propName);
        } else if (Array.isArray(value)) {
          for (const eachElement of value) {
            flatten(eachElement, `${propName}[]`);
          }
        }
      }
    }

    flatten(obj);

    return result;
  }
}

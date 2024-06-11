import {SchemaFetcher} from './SchemaFetcher';
import {TagWriter} from './TagWriter';

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

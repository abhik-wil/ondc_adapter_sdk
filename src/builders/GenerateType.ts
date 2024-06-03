import fs from 'fs';
import path from 'path';
import {DomainBuildInitiator} from './DomainBuildInitiator';

type SchemaType = {
  description: string;
  type: string;
  allOf?: SchemaType[];
  properties?: Record<string, SchemaType>;
  items?: SchemaType;
};

type FlattenedObject = Record<string, string>;
// type ReInflatedObject = Record<string, string | Record<string, string>>;
type ReInflatedObject = Record<string, any>;
export class GenerateType {
  generateAndExport(
    initiator: DomainBuildInitiator,
    schemaName: string,
    location = './'
  ): boolean {
    const schema = initiator.getSchema(schemaName);
    const generatedType = this.generateType(schema);
    return this.writeType(schemaName, generatedType, location);
  }
  generateType(obj: SchemaType) {
    const flattened = this.flattenNestedObject(obj);
    const reInflated = this.convertToNested(flattened);

    return this.parseObject(reInflated);
  }
  writeType(name: string, type: string, location: string): boolean {
    try {
      let data = `export type ${name} = `;
      data += type + ';\n';
      fs.writeFileSync(path.join(location, `${name}.d.ts`), data);
      return true;
    } catch (error) {
      console.log('ERROR:', error);
      return false;
    }
  }
  parseObject(obj: ReInflatedObject): string {
    const stringifiedObj = JSON.stringify(obj);
    const thirdBracketStack: string[] = [];
    const secondBracketStack: string[] = [];
    let parsedType = '';
    for (const chr of stringifiedObj) {
      if (chr === '{') {
        secondBracketStack.push(chr);
        parsedType += `{\n${'  '.repeat(secondBracketStack.length)}`;
      } else if (chr === '}') {
        secondBracketStack.pop();
        parsedType += ';\n' + '  '.repeat(secondBracketStack.length) + chr;
      } else if (chr === '[') thirdBracketStack.push(chr);
      else if (chr === `"`) continue;
      else if (chr === ':') parsedType += ': ';
      else if (chr === ',')
        parsedType += `;\n${'  '.repeat(secondBracketStack.length)}`;
      else if (chr === ']') {
        (parsedType += '[]'), thirdBracketStack.pop();
      } else parsedType += chr;
    }
    return parsedType;
  }

  convertToNested(flat: FlattenedObject): ReInflatedObject {
    const result: ReInflatedObject = {};

    for (const path in flat) {
      const keys = path.split('.');
      let current = result;

      while (keys.length > 1) {
        const key = keys.shift()!;
        if (key.endsWith('[]')) {
          const arrayKey = key.slice(0, -2);
          if (!current[arrayKey]) {
            current[arrayKey] = [{}];
          } else if (!Array.isArray(current[arrayKey])) {
            throw new Error(`Expected array at ${arrayKey}`);
          }
          current = current[arrayKey][0];
        } else {
          if (!current[key]) {
            current[key] = {};
          }
          current = current[key];
        }
      }

      const lastKey = keys.shift()!;
      if (lastKey.endsWith('[]')) {
        current[lastKey.slice(0, -2)] = [{}];
      } else {
        current[lastKey] = flat[path];
      }
    }

    return result;
  }
  flattenNestedObject(obj: SchemaType): FlattenedObject {
    const result: FlattenedObject = {};

    function flatten(obj: SchemaType, prefix = '') {
      if (obj.type === 'object' && obj.properties) {
        for (const [key, value] of Object.entries(obj.properties)) {
          const propName = prefix ? `${prefix}.${key}` : key;
          if (value.type === 'object') {
            flatten(value, propName);
          } else if (value.type === 'array') {
            if (value.items?.type !== 'object') {
              result[propName] = `${value.items?.type}[]`;
            } else {
              flatten(value.items, `${propName}[]`);
            }
          } else if (value.allOf?.length) {
            for (const each of value.allOf) {
              flatten(each, propName);
            }
          } else {
            result[propName] = value.type;
          }
        }
      }
    }

    flatten(obj);

    return result;
  }
}

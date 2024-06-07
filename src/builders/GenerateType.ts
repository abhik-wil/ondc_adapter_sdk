import {SchemaFetcher} from './SchemaFetcher';

export type SchemaType = {
  description: string;
  type: string;
  allOf?: SchemaType[];
  properties?: Record<string, SchemaType>;
  items?: SchemaType;
  $ref?: string;
};

type FlattenedObject = Record<string, string>;
// type ReInflatedObject = Record<string, string | Record<string, string>>;
export type ReInflatedObject = Record<string, any>;
export class GenerateType {
  // generateAndExport(
  //   initiator: SchemaFetcher,
  //   schemaName: string,
  //   location = './'
  // ): boolean {
  //   const schema = initiator.getSchema(schemaName);
  //   const generatedType = this.generateType(schema);
  //   return this.writeType(schemaName, generatedType, location);
  // }
  generateType(obj: SchemaType) {
    const flattened = this.flattenNestedObject(obj);
    // const reInflated = this.convertToNested(flattened);

    // return this.parseObject(reInflated);
    return flattened;
  }

  convertToNested(flat: FlattenedObject): ReInflatedObject {
    const result: ReInflatedObject = {};

    for (const path in flat) {
      const keys = path.split('.');
      let current = result;

      while (keys.length > 1) {
        const key = keys.shift()!;
        if (key.endsWith('[]')) {
          const arrayKey = key;
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
        current[lastKey] = {};
      } else {
        current[lastKey] = flat[path];
      }
    }

    return result;
  }

  flattenNestedObject(obj: SchemaType): FlattenedObject {
    const result: FlattenedObject = {};

    function flatten(obj: SchemaType, prefix = '') {
      console.log('PREFIX ::', prefix);
      console.log('OBJECT RECEIVED ::', obj);
      if (Object.keys(obj).includes('$ref')) {
        console.log('HERE');
        result[prefix] = obj.$ref?.split('/').at(-1) as string;
      }
      if (obj.type === 'object' && obj.properties) {
        for (const [key, value] of Object.entries(obj.properties)) {
          const propName = prefix ? `${prefix}.${key}` : key;
          if (value.type === 'object') {
            flatten(value, propName);
          } else if (value.type === 'array') {
            if (value.items?.type && value.items?.type !== 'object') {
              result[propName] = `${value.items?.type}[]`;
            } else if (
              !value.items?.type &&
              Object.keys(value.items!).includes('$ref')
            ) {
              flatten(value.items!, propName);
            } else {
              flatten(value.items!, `${propName}[]`);
            }
          } else if (value.allOf?.length) {
            for (const each of value.allOf) {
              flatten(each, propName);
            }
          } else {
            result[propName] = 'string';
            // value.type;
          }
        }
      }
    }

    flatten(obj);

    return result;
  }
}

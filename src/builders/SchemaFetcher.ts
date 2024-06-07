import {DomainBuildInitiator} from './DomainBuildInitiator';

interface Schema {
  [key: string]: any;
}

interface RefLocations {
  [key: string]: string;
}

interface RefResult {
  refs: RefLocations;
  propertiesWithRefs: string[];
}
export class SchemaFetcher extends DomainBuildInitiator {
  private parsedSchema!: Record<string, RefResult>;
  getTags() {
    this.isInitialized();
    return this.getBuild()['x-tags'];
  }

  getAttributes() {
    this.isInitialized();
    return this.getBuild()['x-attributes'];
  }

  getSchema(schema: string) {
    this.isInitialized();
    return this.getBuild()['components']['schemas'][schema];
  }

  parse() {
    for (const [name, schema] of Object.entries(
      this.getBuild()['components']['schemas']
    )) {
      this.parsedSchema[name] = this.findRefs(schema as Schema);
    }
  }

  isAtomic(schemaName: string) {
    return this.parsedSchema[schemaName].propertiesWithRefs.length === 0;
  }

  getAtomicSchemaList() {
    const result = [];
    for (const [key, value] of Object.entries(this.parsedSchema)) {
      if (value.propertiesWithRefs.length === 0) result.push(key);
    }
    return result;
  }

  getReferencesWithNestedLocations(schemaName: string) {
    const refLocs: Record<string, string> = {};
    for (const [location, reference] of Object.entries(
      this.parsedSchema[schemaName].refs
    )) {
      const typeName = reference.split('/')[-1];
      refLocs[typeName] = location;
    }
    return refLocs;
  }

  private findRefs(schema: Schema): RefResult {
    const refs: RefLocations = {};
    const propertiesWithRefs = new Set<string>();

    function search(obj: any, path: string): void {
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            const currentPath = path ? `${path}.${key}` : key;
            if (key === '$ref') {
              refs[currentPath] = obj[key];
              const topLevelProperty = path.split('.')[0];
              propertiesWithRefs.add(topLevelProperty);
            } else {
              search(obj[key], currentPath);
            }
          }
        }
      } else if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          const currentPath = `${path}[${index}]`;
          search(item, currentPath);
        });
      }
    }

    for (const topLevelKey in schema) {
      if (Object.prototype.hasOwnProperty.call(schema, topLevelKey)) {
        search(schema[topLevelKey], topLevelKey);
      }
    }

    return {
      refs,
      propertiesWithRefs: Array.from(propertiesWithRefs),
    };
  }
}

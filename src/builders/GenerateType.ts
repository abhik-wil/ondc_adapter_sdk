type SchemaType = {
  description: string;
  type: string;
  properties?: Record<string, SchemaType>;
  items?: SchemaType;
};
export class GenerateType {
  flattenNestedObject(
    obj: SchemaType
  ): Record<string, string | Record<string, string>> {
    const result: Record<string, string | Record<string, string>> = {};

    function flatten(obj: SchemaType, prefix = '') {
      if (obj.type === 'object' && obj.properties) {
        for (const [key, value] of Object.entries(obj.properties)) {
          const propName = prefix ? `${prefix}.${key}` : key;
          if (value.type === 'object') {
            flatten(value, propName);
          } else if (value.type === 'array') {
            if (value.items?.type !== 'object') {
              result[propName] = `${value.items?.type}[]`;
            }
            flatten(value, propName);
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

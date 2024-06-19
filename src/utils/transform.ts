import {Mapping} from '@/types';
import _ from 'lodash';
export function transform(rawData: any, mapping: Mapping<any>): any {
  if (Array.isArray(rawData)) {
    return rawData.map(item => {
      const transformedItem = {};
      applyMapping(transformedItem, item, mapping);
      return transformedItem;
    });
  } else {
    const transformedData = {};
    applyMapping(transformedData, rawData, mapping);
    return transformedData;
  }
}

function applyMapping(target: any, source: any, map: Mapping<any>) {
  console.log('Target ::::', target);
  console.log('Source ::::', source);
  _.forEach(map, (sourcePath: any, targetPath: any) => {
    console.log('SOURCE Path', sourcePath);
    console.log('TARGET Path', targetPath);
    if (_.isObject(sourcePath) && !Array.isArray(sourcePath)) {
      if (!target[targetPath]) target[targetPath] = {};
      applyMapping(target[targetPath], source, sourcePath as Mapping<any>);
    } else if (targetPath.endsWith('[]')) {
      const arrayKey = targetPath.slice(0, -2);
      if (!target[arrayKey]) target[arrayKey] = [];
      target[arrayKey] = sourcePath.map((item: any) => {
        const transformedItem = {};
        applyMapping(transformedItem, source, item as Mapping<any>);
        return transformedItem;
      });
      //const sourceArray = _.get(source, sourcePath[0]);
    } else {
      const value = _.get(source, sourcePath as _.PropertyPath);
      console.log('VALUE TO BE ASSIGNED :::', value);
      if (value !== undefined) {
        _.set(target, targetPath, value);
      }
    }
  });
}

function applyMapping2<T>(target: T, source: any, map: Mapping<T>) {
  for (const [targetPath, sourcePath] of Object.entries(map)) {
    if (!target[targetPath as keyof typeof target]) {
      // targetPath does not exist in the target
      if (targetPath.endsWith('[]')) {
        // targetPath is actually an array
        (target as any)[targetPath.slice(0, -2)] = [];
      } else if (typeof (target as any)[targetPath] !== 'object') {
        // targetPath is niether an array nor an object
        if ((sourcePath as string).includes('[]')) {
          // There is no array in the sourcePath path
        }
      } else {
        // targetPath is actually an object => sourcePath must also be an object
        (target as any)[targetPath] = {};
      }
    }
  }
}

export function getArray(obj: any, path: string) {
  const properties = path.split('.').reverse();
  while (properties.length > 0) {
    let currentProperty = properties.pop();
    console.log('Current Property :', currentProperty);
    console.log('OBJ :', obj);
    if (currentProperty?.endsWith('[]')) {
      currentProperty = currentProperty.slice(0, -2);
      const nextProperty = properties.pop();
      if (Array.isArray(obj))
        obj = obj
          .map((each: any) =>
            each[currentProperty!].map(
              (allNestedProperties: any) => allNestedProperties[nextProperty!]
            )
          )
          .flat();
      else
        obj = obj[currentProperty]
          .map((allNestedProperties: any) => allNestedProperties[nextProperty!])
          .flat();
      console.log('NEXT Property', nextProperty);
      console.log('OBJ Now', obj);
    } else {
      if (Array.isArray(obj))
        obj = obj.map((each: any) => each[currentProperty!]);
      else obj = obj[currentProperty!];
    }
  }
  return obj;
}

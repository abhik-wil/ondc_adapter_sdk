import {Mapping} from '../types';
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
  _.forEach(map, (sourcePath: any, targetPath: any) => {
    if (_.isObject(sourcePath) && !Array.isArray(sourcePath)) {
      if (!target[targetPath]) target[targetPath] = {};
      applyMapping(target[targetPath], source, sourcePath as Mapping<any>);
    } else if (Array.isArray(sourcePath)) {
      if (!target[targetPath]) target[targetPath] = [];
      const hasArrayMapping = _.some(sourcePath, (obj: any) =>
        _.some(
          obj,
          (path: any) => typeof path === 'string' && path.includes('[]')
        )
      );
      if (hasArrayMapping) {
        const arrayPath = _.find(sourcePath, (obj: any) =>
          _.some(
            obj,
            (path: any) => typeof path === 'string' && path.includes('[]')
          )
        );
        const sourceArrayPath = _.find(
          arrayPath,
          (path: any) => typeof path === 'string' && path.includes('[]')
        ).split('[]')[0];
        const sourceArray = _.get(source, sourceArrayPath);
        if (Array.isArray(sourceArray)) {
          target[targetPath] = sourceArray.map((item, index) => {
            const transformedItem = {};
            const updatedMapping = _.mapValues(arrayPath, (path: any) => {
              if (typeof path === 'string') {
                return path.replace(`${sourceArrayPath}[].`, '');
              }
              return path;
            });
            applyMapping(transformedItem, item, updatedMapping as Mapping<any>);
            return transformedItem;
          });
        }
      } else {
        target[targetPath] = sourcePath.map(item => {
          const transformedItem = {};
          applyMapping(transformedItem, source, item as Mapping<any>);
          return transformedItem;
        });
      }
    } else {
      const value = _.get(source, sourcePath as _.PropertyPath);
      if (value !== undefined) {
        _.set(target, targetPath, value);
      }
    }
  });
}

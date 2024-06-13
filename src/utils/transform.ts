/* eslint-disable @typescript-eslint/no-explicit-any */
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
  _.forEach(map, (sourcePath: any, targetPath: any) => {
    if (_.isObject(sourcePath) && !Array.isArray(sourcePath)) {
      if (!target[targetPath]) target[targetPath] = {};
      applyMapping(target[targetPath], source, sourcePath as Mapping<any>);
    } else if (Array.isArray(sourcePath)) {
      if (!target[targetPath]) target[targetPath] = [];
      target[targetPath] = sourcePath.map(item => {
        const transformedItem = {};
        applyMapping(transformedItem, source, item as Mapping<any>);
        return transformedItem;
      });
      //const sourceArray = _.get(source, sourcePath[0]);
    } else {
      const value = _.get(source, sourcePath as _.PropertyPath);
      if (value !== undefined) {
        _.set(target, targetPath, value);
      }
    }
    console.log('target', target);
  });
}

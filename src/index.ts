import {parseArgs} from '@/utils';
import {SchemaFetcher} from '@/builders/SchemaFetcher';
// import {GenerateType} from './builders/GenerateType';
import {exec} from 'child_process';
import {GenerateTagType} from './builders/GenerateTagType';
async function main() {
  const parsedArgs = parseArgs(process.argv.slice(2));
  const initiator = new SchemaFetcher(parsedArgs.domain);
  const initiated = await initiator.init();
  if (initiated) {
    await exec(
      `npx @hey-api/openapi-ts -i ./src/domain-builds/${parsedArgs.domain.replace(
        ':',
        '_'
      )}.json -o ./generated/${parsedArgs.domain.replace(':', '_')}`
    );
  }
  const generator = new GenerateTagType();
  generator.generateAndExport(
    initiator,
    `./generated/${parsedArgs.domain.replace(':', '_')}/tags/`
  );
}

main();

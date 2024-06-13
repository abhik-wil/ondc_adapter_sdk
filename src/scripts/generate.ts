import {parseArgs} from '@/utils';
import {SchemaFetcher} from '@/builders/SchemaFetcher';
// import {GenerateType} from './builders/GenerateType';
import {execSync} from 'child_process';
import {GenerateTagType} from '@/builders';
async function main() {
  const parsedArgs = parseArgs(process.argv.slice(2));
  const initiator = new SchemaFetcher(parsedArgs.domain);
  const initiated = await initiator.init();
  if (initiated) {
    console.log('STARTING GENERATION OF TYPES');
    execSync(
      `npx @hey-api/openapi-ts -i ./src/domain-builds/${parsedArgs.domain.replace(
        ':',
        '_'
      )}.json -o ./src/generated/${parsedArgs.domain.replace(':', '_')}`
    );
    console.log('COMPLETED SUCCESSFULLY');
  }
  console.log('STARTING GENERATION OF TAGS');
  const generator = new GenerateTagType();
  generator.generateAndExport(
    initiator,
    `./src/generated/${parsedArgs.domain.replace(':', '_')}/tags/`
  );
  console.log('COMPLETED GENERATION');
}

main();

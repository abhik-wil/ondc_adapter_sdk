import {DOMAIN_CODE} from '@/utils';
import {GenerateTagType} from '@/builders';
import {SchemaFetcher} from '@/builders/SchemaFetcher';
// import {GenerateType} from './builders/GenerateType';
import {execSync} from 'child_process';
export async function generate(domain: DOMAIN_CODE) {
  const initiator = new SchemaFetcher(domain);
  const initiated = await initiator.init();
  if (initiated) {
    console.log('STARTING GENERATION OF TYPES');
    execSync(
      `npx @hey-api/openapi-ts -i ./src/domain-builds/${domain.replace(
        ':',
        '_'
      )}.json -o ./src/generated/${domain.replace(':', '_')}`
    );
    console.log('COMPLETED SUCCESSFULLY');
  }
  console.log('STARTING GENERATION OF TAGS');
  const generator = new GenerateTagType();
  generator.generateAndExport(
    initiator,
    `./src/generated/${domain.replace(':', '_')}/tags/`
  );
  console.log('COMPLETED GENERATION');
}

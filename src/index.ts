import {parseArgs} from '@/utils';
import {SchemaFetcher} from '@/builders/SchemaFetcher';
import {GenerateType} from './builders/GenerateType';

async function main() {
  const parsedArgs = parseArgs(process.argv.slice(2));
  console.log('DETECTED DOMAIN:', parsedArgs.domain);
  const initiator = new SchemaFetcher(parsedArgs.domain);
  await initiator.init();
  console.log('SCHEMA FETCHING', initiator.getSchema('Ack'));
  const generator = new GenerateType();
  console.log(
    'FLATTENED',
    generator.generateType(initiator.getSchema('Descriptor'))
  );
}

main();

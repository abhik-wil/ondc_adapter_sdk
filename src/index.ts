import {parseArgs} from '@/utils';
import {DomainBuildInitiator} from '@/builders/DomainBuildInitiator';

async function main() {
  const parsedArgs = parseArgs(process.argv.slice(2));
  console.log('DETECTED DOMAIN:', parsedArgs.domain);
  const initiator = new DomainBuildInitiator(parsedArgs.domain);
  initiator.init();
}

main();

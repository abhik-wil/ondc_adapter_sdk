#!/usr/bin/env node

require('tsconfig-paths/register');

import yargs from 'yargs';
import {hideBin} from 'yargs/helpers';
import {generate} from './scripts/generate';
import {DOMAIN_CODE} from './utils';

yargs(hideBin(process.argv))
  .command(
    'generate',
    'Generate something',
    yargs => {
      return yargs.option('domain', {
        type: 'string',
        description: 'Domain code',
        demandOption: true,
      });
    },
    argv => {
      generate(argv.domain as DOMAIN_CODE);
    }
  )
  .help().argv;

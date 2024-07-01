import {ParsedArgs} from '../types';

export function parseArgs(args: string[]): ParsedArgs {
  const parsedArgs: Record<string, string> = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    parsedArgs[key] = value;
  }
  return parsedArgs as ParsedArgs;
}

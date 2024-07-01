import {createAuthHeader, verifyAuthHeader} from '../utils';
import {BecknConfig} from './BecknConfig';

export class BecknAuth {
  constructor(private config: BecknConfig) {}
  async createHeader(message: string) {
    if (!this.config.authParamsSet())
      throw Error('Auth Parameters not set in Config');
    return createAuthHeader(
      message,
      this.config.getConfig('privateKey')!,
      this.config.getConfig('subscriberId')!,
      this.config.getConfig('uniqueKey')!
    );
  }
  async verifyHeader(header: string, rawBody: string) {
    if (!this.config.getConfig('registryUrl'))
      throw Error('Registry URL not set in Config');
    return verifyAuthHeader(
      header,
      rawBody,
      this.config.getConfig('registryUrl')!
    );
  }
}

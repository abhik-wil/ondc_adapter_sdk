import {DOMAIN_CODE} from './domainCodes';

// TODO: Place Links to respective build.yaml files
export const DOMAIN_BUILD_LINKS: {[key in DOMAIN_CODE]: string} = {
  [DOMAIN_CODE.NIC2004_52110]: 'Retail',
  [DOMAIN_CODE.NIC2004_60232]: 'Logistics',
  [DOMAIN_CODE.ONDC_RET10]:
    'https://raw.githubusercontent.com/ONDC-Official/ONDC-RET-Specifications/release-2.0.2/api/build/build.yaml',
  [DOMAIN_CODE.ONDC_RET11]: 'F&B',
  [DOMAIN_CODE.ONDC_RET12]: 'Fashion',
  [DOMAIN_CODE.ONDC_RET13]: 'BPC',
  [DOMAIN_CODE.ONDC_RET14]: 'Electronics',
  [DOMAIN_CODE.ONDC_RET15]: 'Home & Decor',
  [DOMAIN_CODE.ONDC_RET16]: 'Pharma',
  [DOMAIN_CODE.ONDC_RET17]: 'Agriculture',
  [DOMAIN_CODE.ONDC_RET18]: 'Health & Wellness',
  [DOMAIN_CODE.ONDC_RET19]: 'Pharma',
  [DOMAIN_CODE.ONDC_RET1A]: 'Autoparts & Components',
  [DOMAIN_CODE.ONDC_RET1B]: 'Hardware and Industrial',
  [DOMAIN_CODE.ONDC_RET1C]: 'Building and construction supplies',
  [DOMAIN_CODE.ONDC_RET1D]: 'Chemicals',
  [DOMAIN_CODE.ONDC_FIS10]: 'Gift card',
  [DOMAIN_CODE.ONDC_FIS11]: 'FASTag',
  [DOMAIN_CODE.ONDC_FIS12]: 'Credit',
  [DOMAIN_CODE.ONDC_FIS13]: 'Insurance',
  [DOMAIN_CODE.ONDC_FIS14]: 'Investments',
  [DOMAIN_CODE.ONDC_TRV10]: 'Ride Hailing',
  [DOMAIN_CODE.ONDC_TRV11]: 'Ticket(Unreserved)',
  [DOMAIN_CODE.ONDC_TRV12]: 'Ticket(Reserved)',
  [DOMAIN_CODE.ONDC_NTS10]: 'RSP',
  [DOMAIN_CODE.ONDC_NTS11]: 'ODR',
  [DOMAIN_CODE.ONDC_AGR10]: 'Agri Inputs',
  [DOMAIN_CODE.ONDC_AGR11]: 'Agri Outputs',
  [DOMAIN_CODE.ONDC_AGR12]: 'Agri Services',
  [DOMAIN_CODE.ONDC_SRV10]: 'Skilled Services - Appliance Repair Services',
  [DOMAIN_CODE.ONDC_SRV11]:
    'https://raw.githubusercontent.com/ONDC-Official/ONDC-SRV-Specifications/draft-services/api/build/build.yaml',
  [DOMAIN_CODE.ONDC_SRV12]: 'Skilled Services - Personal Care Services',
};

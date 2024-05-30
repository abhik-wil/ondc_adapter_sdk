# ONDC Adapter SDK

This SDK is meant to be the adapter layer which can be used for mapping the NP data with ease and help in smoother onboarding experience.

# How to use:

## For Developers:
For developers who clone this repo and try to use it locally, keep in mind to follow these steps:
1. Run `npm i` to install all the dependencies.

## Initiate SDK

Firstly, to initiate the SDK, run `npm run init -- --domain <domain>`. The list of valid values which can be passed are given in the domain codes file [here](./src/utils/constants/domainCodes.ts). So, if you wish to initialize the SDK with Retail B2B domain ONDC:RET10, you need to run `npm run init -- --domain ONDC_RET10`. This will fetch the build file and then generate the types. 
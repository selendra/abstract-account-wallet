/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from 'ethers';
import type { Provider } from '@ethersproject/providers';
import type { IERC1967, IERC1967Interface } from '../../../../@openzeppelin/contracts/interfaces/IERC1967';

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'previousAdmin',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'newAdmin',
        type: 'address',
      },
    ],
    name: 'AdminChanged',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'beacon',
        type: 'address',
      },
    ],
    name: 'BeaconUpgraded',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'implementation',
        type: 'address',
      },
    ],
    name: 'Upgraded',
    type: 'event',
  },
] as const;

export class IERC1967__factory {
  static readonly abi = _abi;
  static createInterface(): IERC1967Interface {
    return new utils.Interface(_abi) as IERC1967Interface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): IERC1967 {
    return new Contract(address, _abi, signerOrProvider) as IERC1967;
  }
}

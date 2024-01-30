/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from 'ethers';
import type { Provider, TransactionRequest } from '@ethersproject/providers';
import type { PromiseOrValue } from '../../../common';
import type { BitrielPaymaster, BitrielPaymasterInterface } from '../../../src/paymaster/BitrielPaymaster';

const _abi = [
  {
    inputs: [
      {
        internalType: 'contract IEntryPoint',
        name: '_entryPoint',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
    ],
    name: 'AddedBatchToWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'AddedToWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address[]',
        name: 'accounts',
        type: 'address[]',
      },
    ],
    name: 'RemovedBatchFromWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'RemovedFromWhitelist',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'paymaster',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'SponsorSuccessful',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_accounts',
        type: 'address[]',
      },
    ],
    name: 'addBatchToWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint32',
        name: 'unstakeDelaySec',
        type: 'uint32',
      },
    ],
    name: 'addStake',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
    ],
    name: 'addToWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_sponsor',
        type: 'address',
      },
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
    ],
    name: 'check',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'depositFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'entryPoint',
    outputs: [
      {
        internalType: 'contract IEntryPoint',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getDeposit',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'initCode',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'callData',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'callGasLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'verificationGasLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'preVerificationGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxFeePerGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPriorityFeePerGas',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'paymasterAndData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      {
        internalType: 'uint48',
        name: 'validUntil',
        type: 'uint48',
      },
      {
        internalType: 'uint48',
        name: 'validAfter',
        type: 'uint48',
      },
    ],
    name: 'getHash',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_sponsor',
        type: 'address',
      },
    ],
    name: 'getSponsorBalance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'paymasterAndData',
        type: 'bytes',
      },
    ],
    name: 'parsePaymasterAndData',
    outputs: [
      {
        internalType: 'uint48',
        name: 'validUntil',
        type: 'uint48',
      },
      {
        internalType: 'uint48',
        name: 'validAfter',
        type: 'uint48',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'enum IPaymaster.PostOpMode',
        name: 'mode',
        type: 'uint8',
      },
      {
        internalType: 'bytes',
        name: 'context',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'actualGasCost',
        type: 'uint256',
      },
    ],
    name: 'postOp',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: '_accounts',
        type: 'address[]',
      },
    ],
    name: 'removeBatchFromWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '_account',
        type: 'address',
      },
    ],
    name: 'removeFromWhitelist',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'unlockStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'sender',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: 'nonce',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'initCode',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'callData',
            type: 'bytes',
          },
          {
            internalType: 'uint256',
            name: 'callGasLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'verificationGasLimit',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'preVerificationGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxFeePerGas',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'maxPriorityFeePerGas',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: 'paymasterAndData',
            type: 'bytes',
          },
          {
            internalType: 'bytes',
            name: 'signature',
            type: 'bytes',
          },
        ],
        internalType: 'struct UserOperation',
        name: 'userOp',
        type: 'tuple',
      },
      {
        internalType: 'bytes32',
        name: 'userOpHash',
        type: 'bytes32',
      },
      {
        internalType: 'uint256',
        name: 'maxCost',
        type: 'uint256',
      },
    ],
    name: 'validatePaymasterUserOp',
    outputs: [
      {
        internalType: 'bytes',
        name: 'context',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'validationData',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256',
      },
    ],
    name: 'withdrawFunds',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: 'withdrawAddress',
        type: 'address',
      },
    ],
    name: 'withdrawStake',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

const _bytecode =
  '0x60a060405234801561001057600080fd5b5060405162001c0238038062001c02833981016040819052610031916100a2565b8061003b33610052565b6001600160a01b03166080525060016002556100d2565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6000602082840312156100b457600080fd5b81516001600160a01b03811681146100cb57600080fd5b9392505050565b608051611ae36200011f60003960008181610295015281816103ff0152818161056201528181610749015281816107dd01528181610854015281816108f30152610dcb0152611ae36000f3fe60806040526004361061011f5760003560e01c8063b0d691fe116100a0578063de481f1711610064578063de481f1714610331578063e2c41dbc14610367578063e43252d71461036f578063f2fde38b1461038f578063f465c77e146103af57600080fd5b8063b0d691fe14610283578063b3154db0146102b7578063bb9fe6bf146102e7578063c23a5cea146102fc578063c399ec881461031c57600080fd5b80638da5cb5b116100e75780638da5cb5b146101ae57806394d4ad60146101e557806394e1fc1914610215578063a3d19d8c14610243578063a9a234091461026357600080fd5b80630396cb6014610124578063123a6a8214610139578063155dd5ee14610159578063715018a6146101795780638ab1d6811461018e575b600080fd5b610137610132366004611535565b6103dd565b005b34801561014557600080fd5b50610137610154366004611562565b610468565b34801561016557600080fd5b506101376101743660046115d7565b6104b8565b34801561018557600080fd5b506101376105d3565b34801561019a57600080fd5b506101376101a9366004611605565b6105e7565b3480156101ba57600080fd5b506000546001600160a01b03165b6040516001600160a01b0390911681526020015b60405180910390f35b3480156101f157600080fd5b50610205610200366004611664565b610629565b6040516101dc94939291906116a6565b34801561022157600080fd5b50610235610230366004611726565b610666565b6040519081526020016101dc565b34801561024f57600080fd5b5061013761025e366004611562565b6106c0565b34801561026f57600080fd5b5061013761027e366004611784565b610710565b34801561028f57600080fd5b506101c87f000000000000000000000000000000000000000000000000000000000000000081565b3480156102c357600080fd5b506102d76102d23660046117e4565b61072a565b60405190151581526020016101dc565b3480156102f357600080fd5b5061013761073f565b34801561030857600080fd5b50610137610317366004611605565b6107b6565b34801561032857600080fd5b5061023561083c565b34801561033d57600080fd5b5061023561034c366004611605565b6001600160a01b031660009081526003602052604090205490565b6101376108cc565b34801561037b57600080fd5b5061013761038a366004611605565b610963565b34801561039b57600080fd5b506101376103aa366004611605565b6109a5565b3480156103bb57600080fd5b506103cf6103ca36600461181d565b610a1b565b6040516101dc92919061186b565b6103e5610a3f565b604051621cb65b60e51b815263ffffffff821660048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031690630396cb609034906024016000604051808303818588803b15801561044c57600080fd5b505af1158015610460573d6000803e3d6000fd5b505050505050565b6104728282610a99565b81816040516104829291906118c0565b6040519081900381209033907f75dcdde27b71b9c529ae8b02072e1eeda244662d2d9c2effea5a1afb8fc913f390600090a35050565b6104c0610ae8565b3360009081526003602052604090205481111561053c5760405162461bcd60e51b815260206004820152602f60248201527f457468657273706f745061796d61737465723a3a206e6f7420656e6f7567682060448201526e6465706f73697465642066756e647360881b60648201526084015b60405180910390fd5b6105463382610b3f565b60405163040b850f60e31b8152336004820152602481018290527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063205c287890604401600060405180830381600087803b1580156105ae57600080fd5b505af11580156105c2573d6000803e3d6000fd5b505050506105d06001600255565b50565b6105db610a3f565b6105e56000610b70565b565b6105f081610bc0565b6040516001600160a01b0382169033907fd288ab5da2e1f37cf384a1565a3f905ad289b092fbdd31950dbbfef148c04f8890600090a350565b600080368161063c605460148789611902565b810190610649919061192c565b909450925061065b8560548189611902565b949793965094505050565b600061067184610ca4565b604080516020810192909252469082015230606082015265ffffffffffff8085166080830152831660a082015260c0016040516020818303038152906040528051906020012090509392505050565b6106ca8282610d76565b81816040516106da9291906118c0565b6040519081900381209033907f6eabb183ad4385932735ae89018089a008c58e814451b618bc0dd0e7922f6d1390600090a35050565b610718610dc0565b61072484848484610e30565b50505050565b60006107368383610eb5565b90505b92915050565b610747610a3f565b7f00000000000000000000000000000000000000000000000000000000000000006001600160a01b031663bb9fe6bf6040518163ffffffff1660e01b8152600401600060405180830381600087803b1580156107a257600080fd5b505af1158015610724573d6000803e3d6000fd5b6107be610a3f565b60405163611d2e7560e11b81526001600160a01b0382811660048301527f0000000000000000000000000000000000000000000000000000000000000000169063c23a5cea90602401600060405180830381600087803b15801561082157600080fd5b505af1158015610835573d6000803e3d6000fd5b5050505050565b6040516370a0823160e01b81523060048201526000907f00000000000000000000000000000000000000000000000000000000000000006001600160a01b0316906370a0823190602401602060405180830381865afa1580156108a3573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906108c7919061195f565b905090565b6108d4610ae8565b6108de3334610ee3565b60405163b760faf960e01b81523060048201527f00000000000000000000000000000000000000000000000000000000000000006001600160a01b03169063b760faf99034906024016000604051808303818588803b15801561094057600080fd5b505af1158015610954573d6000803e3d6000fd5b50505050506105e56001600255565b61096c81610f0b565b6040516001600160a01b0382169033907f0c4b48e75a1f7ab0a9a2f786b5d6c1f7789020403bff177fb54d46edb89ccc0090600090a350565b6109ad610a3f565b6001600160a01b038116610a125760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201526564647265737360d01b6064820152608401610533565b6105d081610b70565b60606000610a27610dc0565b610a32858585610ff9565b915091505b935093915050565b6000546001600160a01b031633146105e55760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610533565b60005b81811015610ae357610ad3838383818110610ab957610ab9611978565b9050602002016020810190610ace9190611605565b610bc0565b610adc816119a4565b9050610a9c565b505050565b6002805403610b395760405162461bcd60e51b815260206004820152601f60248201527f5265656e7472616e637947756172643a207265656e7472616e742063616c6c006044820152606401610533565b60028055565b6001600160a01b03821660009081526003602052604081208054839290610b679084906119bd565b90915550505050565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b6001600160a01b038116610c115760405162461bcd60e51b815260206004820152601860248201527757686974656c6973743a3a205a65726f206164647265737360401b6044820152606401610533565b610c1b3382610eb5565b610c765760405162461bcd60e51b815260206004820152602660248201527f57686974656c6973743a3a204163636f756e74206973206e6f742077686974656044820152651b1a5cdd195960d21b6064820152608401610533565b3360009081526001602090815260408083206001600160a01b0394909416835292905220805460ff19169055565b600081356020830135610cba60408501856119d0565b604051610cc8929190611a17565b604051908190039020610cde60608601866119d0565b604051610cec929190611a17565b604080519182900382206001600160a01b03909516602083015281019290925260608201526080808201929092529083013560a08083019190915283013560c08083019190915283013560e0808301919091528301356101008083019190915283013561012082015261014001604051602081830303815290604052805190602001209050919050565b60005b81811015610ae357610db0838383818110610d9657610d96611978565b9050602002016020810190610dab9190611605565b610f0b565b610db9816119a4565b9050610d79565b336001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016146105e55760405162461bcd60e51b815260206004820152601560248201527414d95b99195c881b9bdd08115b9d1c9e541bda5b9d605a1b6044820152606401610533565b6000808080610e4186880188611a27565b9350935093509350610e68848287610e599190611a6d565b610e6390856119bd565b610ee3565b604080516001600160a01b038087168252851660208201527f2c5d05f0498c9d2ef9ad6bec38fa7d6693827331e772b11b0864225ad20507f4910160405180910390a15050505050505050565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205460ff1690565b6001600160a01b03821660009081526003602052604081208054839290610b67908490611a6d565b6001600160a01b038116610f5c5760405162461bcd60e51b815260206004820152601860248201527757686974656c6973743a3a205a65726f206164647265737360401b6044820152606401610533565b610f663382610eb5565b15610fc65760405162461bcd60e51b815260206004820152602a60248201527f57686974656c6973743a3a204163636f756e7420697320616c726561647920776044820152691a1a5d195b1a5cdd195960b21b6064820152608401610533565b3360009081526001602081815260408084206001600160a01b03959095168452939052919020805460ff19169091179055565b60606000808036816110126102006101208b018b6119d0565b92965090945092509050604081148061102b5750604181145b6110a75760405162461bcd60e51b815260206004820152604160248201527f457468657273706f745061796d61737465723a3a20696e76616c69642073696760448201527f6e6174757265206c656e67746820696e207061796d6173746572416e644461746064820152606160f81b608482015260a401610533565b60006110ea6110b78b8787610666565b7f19457468657265756d205369676e6564204d6573736167653a0a3332000000006000908152601c91909152603c902090565b905060008a35905060006111348386868080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061128692505050565b90506111408183610eb5565b61117157611150600188886112aa565b60405180602001604052806000815250909850985050505050505050610a37565b6000611183619c4060e08f0135611a80565b90506000611191828d611a6d565b9050806111b3846001600160a01b031660009081526003602052604090205490565b101561121e5760405162461bcd60e51b815260206004820152603460248201527f457468657273706f745061796d61737465723a3a2053706f6e736f72207061796044820152736d61737465722066756e647320746f6f206c6f7760601b6064820152608401610533565b6112288382610b3f565b604080516001600160a01b038086166020830152861691810191909152606081018290526080810183905260a00160405160208183030381529060405261127160008b8b6112aa565b9a509a50505050505050505050935093915050565b600080600061129585856112e2565b915091506112a281611327565b509392505050565b600060d08265ffffffffffff16901b60a08465ffffffffffff16901b856112d25760006112d5565b60015b60ff161717949350505050565b60008082516041036113185760208301516040840151606085015160001a61130c87828585611471565b94509450505050611320565b506000905060025b9250929050565b600081600481111561133b5761133b611a97565b036113435750565b600181600481111561135757611357611a97565b036113a45760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610533565b60028160048111156113b8576113b8611a97565b036114055760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610533565b600381600481111561141957611419611a97565b036105d05760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b6064820152608401610533565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156114a8575060009050600361152c565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156114fc573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166115255760006001925092505061152c565b9150600090505b94509492505050565b60006020828403121561154757600080fd5b813563ffffffff8116811461155b57600080fd5b9392505050565b6000806020838503121561157557600080fd5b823567ffffffffffffffff8082111561158d57600080fd5b818501915085601f8301126115a157600080fd5b8135818111156115b057600080fd5b8660208260051b85010111156115c557600080fd5b60209290920196919550909350505050565b6000602082840312156115e957600080fd5b5035919050565b6001600160a01b03811681146105d057600080fd5b60006020828403121561161757600080fd5b813561155b816115f0565b60008083601f84011261163457600080fd5b50813567ffffffffffffffff81111561164c57600080fd5b60208301915083602082850101111561132057600080fd5b6000806020838503121561167757600080fd5b823567ffffffffffffffff81111561168e57600080fd5b61169a85828601611622565b90969095509350505050565b600065ffffffffffff808716835280861660208401525060606040830152826060830152828460808401376000608084840101526080601f19601f850116830101905095945050505050565b6000610160828403121561170557600080fd5b50919050565b803565ffffffffffff8116811461172157600080fd5b919050565b60008060006060848603121561173b57600080fd5b833567ffffffffffffffff81111561175257600080fd5b61175e868287016116f2565b93505061176d6020850161170b565b915061177b6040850161170b565b90509250925092565b6000806000806060858703121561179a57600080fd5b8435600381106117a957600080fd5b9350602085013567ffffffffffffffff8111156117c557600080fd5b6117d187828801611622565b9598909750949560400135949350505050565b600080604083850312156117f757600080fd5b8235611802816115f0565b91506020830135611812816115f0565b809150509250929050565b60008060006060848603121561183257600080fd5b833567ffffffffffffffff81111561184957600080fd5b611855868287016116f2565b9660208601359650604090950135949350505050565b604081526000835180604084015260005b81811015611899576020818701810151606086840101520161187c565b506000606082850101526060601f19601f8301168401019150508260208301529392505050565b60008184825b858110156118f75781356118d9816115f0565b6001600160a01b0316835260209283019291909101906001016118c6565b509095945050505050565b6000808585111561191257600080fd5b8386111561191f57600080fd5b5050820193919092039150565b6000806040838503121561193f57600080fd5b6119488361170b565b91506119566020840161170b565b90509250929050565b60006020828403121561197157600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000600182016119b6576119b661198e565b5060010190565b818103818111156107395761073961198e565b6000808335601e198436030181126119e757600080fd5b83018035915067ffffffffffffffff821115611a0257600080fd5b60200191503681900382131561132057600080fd5b8183823760009101908152919050565b60008060008060808587031215611a3d57600080fd5b8435611a48816115f0565b93506020850135611a58816115f0565b93969395505050506040820135916060013590565b808201808211156107395761073961198e565b80820281158282048414176107395761073961198e565b634e487b7160e01b600052602160045260246000fdfea264697066735822122007fa2e030debf8b03bb1a4965f0636621190d6523b91ba6f9ec5d238d1d1448364736f6c63430008110033';

type BitrielPaymasterConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: BitrielPaymasterConstructorParams): xs is ConstructorParameters<typeof ContractFactory> =>
  xs.length > 1;

export class BitrielPaymaster__factory extends ContractFactory {
  constructor(...args: BitrielPaymasterConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    _entryPoint: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): Promise<BitrielPaymaster> {
    return super.deploy(_entryPoint, overrides || {}) as Promise<BitrielPaymaster>;
  }
  override getDeployTransaction(
    _entryPoint: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(_entryPoint, overrides || {});
  }
  override attach(address: string): BitrielPaymaster {
    return super.attach(address) as BitrielPaymaster;
  }
  override connect(signer: Signer): BitrielPaymaster__factory {
    return super.connect(signer) as BitrielPaymaster__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): BitrielPaymasterInterface {
    return new utils.Interface(_abi) as BitrielPaymasterInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): BitrielPaymaster {
    return new Contract(address, _abi, signerOrProvider) as BitrielPaymaster;
  }
}

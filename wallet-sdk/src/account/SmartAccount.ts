import { JsonRpcProvider } from "@ethersproject/providers";
import { ethers, BigNumberish, BytesLike, BigNumber } from "ethers";
import { Bytes, getCreate2Address, hexConcat, keccak256, solidityKeccak256 } from "ethers/lib/utils";
import { BaseSmartAccount } from "./BaseSmartAccount";
import { UserOpResponse } from "../bundler";
import {
  Logger,
  NODE_CLIENT_URL,
  SmartAccount_v100,
  SmartAccountFactory_v100,
  SmartAccount_v100__factory,
  SmartAccountFactory_v100__factory,
  AddressResolver,
  AddressResolver__factory,
  isNullOrUndefined,
} from "../common";
import {
  BiconomyTokenPaymasterRequest,
  BiconomySmartAccountV2Config,
  CounterFactualAddressParam,
  BuildUserOpOptions,
  Overrides,
  NonceOptions,
  SmartAccountInfo,
  QueryParamsForAddressResolver,
} from "./utils/Types";
import {
    ADDRESS_RESOLVER_ADDRESS,
    SMART_WALLET_IMPLEMENTATION_ADDRESSES_BY_VERSION,
    DEFAULT_SMART_WALLET_FACTORY_ADDRESS,
    DEFAULT_FALLBACK_HANDLER_ADDRESS,
    PROXY_CREATION_CODE,
  } from "./utils/Constants";
import { BaseValidationModule, ECDSAOwnershipValidationModule, ModuleInfo, SendUserOpParams } from "../modules";
import { UserOperation, Transaction } from "../core-types";
import { IHybridPaymaster, BiconomyPaymaster, SponsorUserOperationDto } from "../paymaster";
import {
  SupportedChainsResponse,
  BalancesResponse,
  BalancesDto,
  UsdBalanceResponse,
  SmartAccountByOwnerDto,
  SmartAccountsResponse,
  SCWTransactionResponse,
} from "../node-client";
import NodeClient from "../node-client";
import INodeClient from "../node-client";
import log from "loglevel";

import { BigNumber, BigNumberish} from "ethers";
import { parseEther, parseUnits } from "ethers/lib/utils";

export type StakingConfig = {
    unstakeDelayInSec: number;
    stakeInWei: BigNumber;
};

export const factoryStakeConfig: Record<number, StakingConfig> = {
    1961: {
        unstakeDelayInSec: 60 * 60 * 24, // 1 Day
        stakeInWei: parseEther("1"),
    },
    1953: {
        unstakeDelayInSec: 60 * 60 * 24, // 1 Day
        stakeInWei: parseEther("1"),
    },
}

export const DEPLOYMENT_GAS_PRICES: Record<
    number,
    | { maxFeePerGas?: BigNumberish; maxPriorityFeePerGas?: BigNumberish }
    | { gasPrice: BigNumberish }
> = {
    1961: { gasPrice: parseUnits("1", "gwei") },
    1953: { gasPrice: parseUnits("1", "gwei") },
}

export const paymasterStakeConfig: Record<number, StakingConfig> = {
    1961: {
      unstakeDelayInSec: 60 * 60 * 24, // 1 Day
      stakeInWei: parseEther("1"),
    },
    1953: {
      unstakeDelayInSec: 60 * 60 * 24, // 1 Day
      stakeInWei: parseEther("1"),
    },
}
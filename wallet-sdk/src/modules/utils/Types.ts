import { Signer } from "ethers";

export type ModuleVersion = "V1_0_0";

export interface BaseValidationModuleConfig {
    entryPointAddress?: string;
  }

export type SessionParams = {
    sessionID?: string;
    sessionSigner: Signer;
    sessionValidationModule?: string;
    additionalSessionData?: string;
};

export interface SendUserOpParams extends ModuleInfo {
    simulationType?: SimulationType;
  }


export type ModuleInfo = {
    // Could be a full object of below params and that way it can be an array too!
    // sessionParams?: SessionParams[] // where SessionParams is below four
    sessionID?: string;
    sessionSigner?: Signer;
    sessionValidationModule?: string;
    additionalSessionData?: string;
    batchSessionParams?: SessionParams[];
};

export interface SendUserOpParams extends ModuleInfo {
    simulationType?: SimulationType;
}

export type SimulationType = "validation" | "validation_and_execution";
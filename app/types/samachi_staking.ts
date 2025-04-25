import { Idl } from '@coral-xyz/anchor';

export interface SamachiStaking extends Idl {
  version: string;
  name: string;
  instructions: {
    name: string;
    discriminator: number[];
    accounts: {
      name: string;
      isMut: boolean;
      isSigner: boolean;
    }[];
    args: {
      name: string;
      type: string;
    }[];
  }[];
  accounts: {
    name: string;
    type: {
      kind: string;
      fields: {
        name: string;
        type: string;
      }[];
    };
  }[];
  types: any[];
  errors: any[];
  metadata: {
    address: string;
    name: string;
    version: string;
    spec: string;
  };
}

export interface UserState {
  user: string;
  stakedAmount: number;
  lastStakeTime: number;
}

export interface Vault {
  authority: string;
  tokenMint: string;
  tokenAccount: string;
} 
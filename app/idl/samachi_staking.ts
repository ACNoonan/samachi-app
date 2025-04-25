import { Idl } from '@coral-xyz/anchor';
import idl from './samachi_staking.json';

export const IDL: Idl = idl;

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
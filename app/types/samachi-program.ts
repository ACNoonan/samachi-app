import { Program } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { BN } from '@coral-xyz/anchor';

export interface UserState {
  authority: PublicKey;
  stakedAmount: BN;
  lastStakeTime: BN;
  lastUnstakeTime: BN;
}

export interface AdminState {
  authority: PublicKey;
}

export interface VaultTokenAccount {
  mint: PublicKey;
  authority: PublicKey;
}

export interface SamachiProgram {
  name: string;
  version: string;
  instructions: {
    initialize_admin: {
      accounts: {
        admin: { isMut: true; isSigner: false };
        admin_authority: { isMut: true; isSigner: true };
        system_program: { isMut: false; isSigner: false };
      };
      args: [];
    };
    initialize_user: {
      accounts: {
        user_state: { isMut: true; isSigner: false };
        authority: { isMut: true; isSigner: true };
        system_program: { isMut: false; isSigner: false };
      };
      args: [];
    };
    initialize_vault: {
      accounts: {
        vault_token_account: { isMut: true; isSigner: false };
        mint: { isMut: false; isSigner: false };
        payer: { isMut: true; isSigner: true };
        system_program: { isMut: false; isSigner: false };
        token_program: { isMut: false; isSigner: false };
        rent: { isMut: false; isSigner: false };
      };
      args: [];
    };
    settle_bill: {
      accounts: {
        user_state: { isMut: true; isSigner: false };
        vault_token_account: { isMut: true; isSigner: false };
        treasury_token_account: { isMut: true; isSigner: false };
        mint: { isMut: false; isSigner: false };
        admin: { isMut: false; isSigner: false };
        admin_authority: { isMut: true; isSigner: true };
        token_program: { isMut: false; isSigner: false };
      };
      args: [{ amount: BN }];
    };
    stake: {
      accounts: {
        user_state: { isMut: true; isSigner: false };
        vault_token_account: { isMut: true; isSigner: false };
        user_token_account: { isMut: true; isSigner: false };
        mint: { isMut: false; isSigner: false };
        authority: { isMut: false; isSigner: true };
        token_program: { isMut: false; isSigner: false };
      };
      args: [{ amount: BN }];
    };
    unstake: {
      accounts: {
        user_state: { isMut: true; isSigner: false };
        vault_token_account: { isMut: true; isSigner: false };
        user_token_account: { isMut: true; isSigner: false };
        mint: { isMut: false; isSigner: false };
        authority: { isMut: false; isSigner: true };
        token_program: { isMut: false; isSigner: false };
      };
      args: [{ amount: BN }];
    };
  };
  accounts: {
    userState: UserState;
    adminState: AdminState;
    vaultTokenAccount: VaultTokenAccount;
  };
  errors: {
    InsufficientFunds: {
      code: number;
      name: string;
      msg: string;
    };
    InvalidAmount: {
      code: number;
      name: string;
      msg: string;
    };
  };
}

export type SamachiProgramType = Program<SamachiProgram>; 
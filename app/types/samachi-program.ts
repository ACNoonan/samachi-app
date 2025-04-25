import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';

export type SamachiProgram = {
  version: "0.1.0";
  name: "samachi_staking";
  instructions: [
    {
      name: "initialize";
      accounts: [
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "authority";
          isMut: true;
          isSigner: true;
        },
        {
          name: "systemProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [];
    },
    {
      name: "stake";
      accounts: [
        {
          name: "userState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    },
    {
      name: "unstake";
      accounts: [
        {
          name: "userState";
          isMut: true;
          isSigner: false;
        },
        {
          name: "vault";
          isMut: true;
          isSigner: false;
        },
        {
          name: "user";
          isMut: true;
          isSigner: true;
        },
        {
          name: "userTokenAccount";
          isMut: true;
          isSigner: false;
        },
        {
          name: "tokenProgram";
          isMut: false;
          isSigner: false;
        }
      ];
      args: [
        {
          name: "amount";
          type: "u64";
        }
      ];
    }
  ];
  accounts: [
    {
      name: "userState";
      type: {
        kind: "struct";
        fields: [
          {
            name: "user";
            type: "publicKey";
          },
          {
            name: "stakedAmount";
            type: "u64";
          },
          {
            name: "lastStakeTime";
            type: "i64";
          }
        ];
      };
    },
    {
      name: "vault";
      type: {
        kind: "struct";
        fields: [
          {
            name: "authority";
            type: "publicKey";
          },
          {
            name: "tokenMint";
            type: "publicKey";
          },
          {
            name: "tokenAccount";
            type: "publicKey";
          }
        ];
      };
    }
  ];
};

export interface UserState {
  user: PublicKey;
  stakedAmount: BN;
  lastStakeTime: BN;
}

export interface Vault {
  authority: PublicKey;
  tokenMint: PublicKey;
  tokenAccount: PublicKey;
} 
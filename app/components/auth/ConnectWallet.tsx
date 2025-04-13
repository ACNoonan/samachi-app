'use client';

import React, { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
// You might not need the specific hooks here if just using the button
// import { useWallet } from '@solana/wallet-adapter-react';

// This component now simply renders the pre-built button from the UI library
// which handles the modal and connection logic.
export const SolanaConnectButton: FC = () => {

  // const { connected } = useWallet(); // Example: You could conditionally render based on connection status

  return (
      <WalletMultiButton />
  );
};

// If you need more customization than WalletMultiButton offers, 
// you can use WalletModalButton and other hooks:
// import { useWalletModal } from '@solana/wallet-adapter-react-ui';
// import { Button } from '@/app/components/ui/button';
// 
// export const CustomConnectWallet: FC = () => {
//   const { setVisible } = useWalletModal();
//   const { wallet, connect, connected, connecting } = useWallet();
// 
//   const handleConnectClick = () => {
//       setVisible(true);
//   };
// 
//   if (connected) {
//     return <p>Connected to {wallet?.adapter.name}</p>;
//   }
// 
//   return (
//     <Button onClick={handleConnectClick} disabled={connecting}>
//       {connecting ? 'Connecting...' : 'Connect Solana Wallet'}
//     </Button>
//   );
// };

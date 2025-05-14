declare module 'tweetnacl' {
  interface Sign {
    detached: {
      verify(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): boolean;
    };
    // Add other functions from nacl.sign if needed, e.g., nacl.sign.detached(message, secretKey)
  }

  const sign: Sign;

  // Add other top-level exports from tweetnacl if you use them, e.g.:
  // const secretbox: any; 
  // const scalarMult: any;
  // etc.

  export default { sign };
} 
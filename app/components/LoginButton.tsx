import React from 'react';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] font-role font-bold"
      text="Log in"
      withWalletAggregator={true}
    />
  );
}

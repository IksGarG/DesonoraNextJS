import { BootsHeader } from '@/components/Boots';
import clsx from 'clsx';
import React from 'react';

export default function Boots() {
  return (
    <div className={clsx('h-full w-full relative flex flex-col px-6 py-2')}>
      <div aria-label="spacer" className={clsx('min-h-16 h-16')} />
      <div className={clsx('flex-1 w-full flex flex-col')}>
        <BootsHeader />
      </div>
    </div>
  );
}

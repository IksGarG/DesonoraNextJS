import { Button } from '@/components/ui/button';
import clsx from 'clsx';
import {
  BookUser,
  CircleQuestionMark,
  CircleUserRound,
  Footprints,
  House,
  Languages,
  ShoppingBag,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import React from 'react';
import { LocaleToggle } from './LocaleToggle';
import { ModeToggle } from './ModeToggle';

export default function Navbar() {
  const t = useTranslations('Navbar');
  return (
    <div
      className={clsx(
        'dark:bg-background/25 bg-arena/25 fixed top-0 left-0 z-50 flex h-16 w-screen items-center px-6 backdrop-blur-md'
      )}
    >
      <div className={clsx('flex w-full items-center justify-between')}>
        <div className={clsx('flex items-center justify-start gap-3')}>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">
              <House /> {t('home')}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/boots">
              <Footprints />
              {t('boots')}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/about">
              <CircleQuestionMark />
              {t('about')}
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/contact">
              <BookUser />
              {t('contact')}
            </Link>
          </Button>
        </div>
        <div className={clsx('flex items-center justify-start gap-2')}>
          <LocaleToggle />
          <ModeToggle />
          <Button variant="ghost" size="icon">
            <CircleUserRound />
          </Button>
          <Button variant="ghost" size="icon">
            <ShoppingBag />
          </Button>
        </div>
      </div>
    </div>
  );
}

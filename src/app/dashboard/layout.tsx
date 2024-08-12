import { ReactNode } from 'react';
import { HeaderDashboard } from './components/Header';

export default function LayoutDashboard({ children }: { children: ReactNode}) {
  return (
    <>
      <HeaderDashboard />
      { children }
    </>
  );
}
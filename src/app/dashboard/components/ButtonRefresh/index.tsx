'use client'

import { useRouter } from 'next/navigation';
import { FiRefreshCcw } from 'react-icons/fi';

export function ButtonRefresh() {

  const router = useRouter();

  return (
    <button className='bg-green-600 hover:bg-green-700 p-1 rounded-md' onClick={() => router.refresh()}>
      <FiRefreshCcw size={24} color='#FFF' />
    </button>
  );
}
import { Container } from '@/components/Container';
import Link from 'next/link';

export function HeaderDashboard() {
  return (
    <Container>
      <header className='w-full flex items-center bg-gray-900 rounded-md my-4 p-3 gap-4'>
        <Link href='/dashboard' className='text-white hover:text-blue-200 focus:text-blue-400 duration-100'>
          Chamados
        </Link>
        
        <Link href='/dashboard/customer' className='text-white hover:text-blue-200 focus:text-blue-400 duration-100'>
          Clientes
        </Link>
      </header>
    </Container>
  );
}
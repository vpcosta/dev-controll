import { Container } from '@/components/Container';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { CardCustomer } from './components/card';
import prisma from '@/lib/prisma';

export default async function Customer() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/');
  }

  const customers = await prisma.customer.findMany({
    where: {
      userId: session.user.id
    }
  });

  return (
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between mb-2'>
          <h1 className='font-bold text-3xl'>Clientes</h1>

          <Link href='/dashboard/customer/new' className='bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-white'>
            Novo Cliente
          </Link>
        </div>

        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
          { customers.map( customer => (
            <CardCustomer
              key={customer.id}
              customer={customer}
            />
          ))}
        </section>

        { customers.length === 0 && (
          <h1 className='text-gray-600'>Você ainda não possui nenhum cliente</h1>
        )}
      </main>
    </Container>
  );
}
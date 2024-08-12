import { Container } from '@/components/Container';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { NewCustomerForm } from '../components/Form';

export default async function NewCustomer() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/');
  }

  return (
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between mb-2'>
          <h1 className='font-bold text-3xl'>Cadastro de Clientes</h1>

          <Link href='/dashboard/customer' className='bg-slate-800 hover:bg-slate-900 px-4 py-1 rounded text-white'>
            Voltar
          </Link>
        </div>
        
        <NewCustomerForm userId={session.user.id} />
      </main>
    </Container>
  );

}
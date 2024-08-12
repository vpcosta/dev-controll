import { Container } from '@/components/Container';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function NewTicket() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/');
  }

  const customers = await prisma.customer.findMany({
    where: {
      userId: session.user.id
    }
  });

  async function handleRegisterTicket(formData: FormData) {
    'use server'
    
    const name = formData.get('name');
    const description = formData.get('description');
    const customerId = formData.get('customer');

    if(!name || !description || !customerId) {
      return;
    }

    await prisma.ticket.create({
      data: {
        name: name as string,
        description: description as string,
        customerId: customerId as string,
        status: 'ABERTO',
        userId: session?.user.id
      }
    });

    redirect('/dashboard');
  }

  return (
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between mb-2'>
          <h1 className='font-bold text-3xl'>Novo Chamado</h1>

          <Link href='/dashboard/customer' className='bg-slate-800 hover:bg-slate-900 px-4 py-1 rounded text-white'>
            Voltar
          </Link>
        </div>

        <form action={handleRegisterTicket}>
          <label className='mb-1 text-lg font-medium'>Nome do chamado</label>
          <input
            className='w-full border-2 rounded-md px-2 mb-2 h-11'
            type='text'
            placeholder='Digite o nome do chamado'
            name='name'
          />

          <label className='mb-1 text-lg font-medium'>Descreva o problema</label>
          <textarea
            className='w-full border-2 rounded-md px-2 mb-2 h-24 resize-none'
            placeholder='Digite o nome do chamado'
            name='description'
          />

          {customers.length !== 0 && (
            <>
              <label className='mb-1 text-lg font-medium'>Selecione o cliente</label>
              <select
                className='w-full border-2 rounded-md px-2 mb-2 h-11'
                name='customer'
              >
                {customers.map(customer => (
                  <option
                    key={customer.id}
                    value={customer.id}>{customer.name}</option>
                ))}
              </select>
            </>
          )}

          {customers.length === 0 && (
            <Link href='/dashboard/customer/new'>
              Você ainda não possui clientes cadastrados. <span className='text-blue-500 font-medium'>Cadastre aqui</span>
            </Link>
          )}

          <button
            className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded my-4 px-2 h-10 disabled:bg-gray-400 disabled:cursor-not-allowed'
            type='submit'
            disabled={customers.length === 0}
          >
            Cadastrar
          </button>

        </form>

      </main>
    </Container>
  );
}
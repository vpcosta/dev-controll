import { Container } from '@/components/Container'
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { TicketItem } from './components/Ticket';
import prisma from '@/lib/prisma';
import { TicketProps } from '@/utils/ticket.type';
import { ButtonRefresh } from './components/ButtonRefresh';

export default async function Dashboard() {

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect('/');
  };

  const tickets = await prisma.ticket.findMany({
    where: {
      status: 'ABERTO',
      customer: {
        userId: session.user.id
      }
    },
    include: {
      customer: true
    },
    orderBy: {
      created_at: 'asc'
    }
  });

  return (
    <Container>
      <main className='mt-9 mb-2'>
        <div className='flex items-center justify-between mb-2'>
          <h1 className='font-bold text-3xl'>Chamados</h1>

          <div className='flex items-center gap-3'>
            <ButtonRefresh />

            <Link href='/dashboard/new' className='bg-blue-500 hover:bg-blue-600 px-4 py-1 rounded text-white'>
              Abrir Chamado
            </Link>
          </div>
        </div>

        <table className='min-w-full'>
          <thead>
            <tr className='bg-blue-200 h-10 shadow-md'>
              <th className='font-medium text-left pl-1'>CLIENTE</th>
              <th className='font-medium text-left hidden sm:table-cell'>CADASTRO</th>
              <th className='font-medium text-left'>STATUS</th>
              <th className='font-medium text-left'>AÇÕES</th>
            </tr>
          </thead>

          <tbody>
            {tickets.map(ticket => (
              <TicketItem
                key={ticket.id}
                customer={ticket.customer}
                ticket={ticket as TicketProps}
              />
            ))}
          </tbody>
        </table>
        {tickets.length === 0 && (
          <h1 className='px-2 py-2 md:px-0 text-gray-600'>Nenhum ticket encontrado...</h1>
        )}
      </main>
    </Container>
  );
}
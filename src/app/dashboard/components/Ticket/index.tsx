'use client'
import { api } from '@/lib/api'
import { ModalContext } from '@/providers/modal'
import { CustomerProps } from '@/utils/customer.type'
import { TicketProps } from '@/utils/ticket.type'
import { useRouter } from 'next/navigation'
import { useContext } from 'react'
import { FiCheckSquare, FiFile } from 'react-icons/fi'

interface TicketItemProps{
  customer: CustomerProps | null,
  ticket: TicketProps,
}

export function TicketItem({ customer, ticket }: TicketItemProps) {
  
  const router = useRouter();
  const { handleModalVisible, setDetailTicket } = useContext(ModalContext);

  async function handleChangeStatus() {
    try{
      const response = await api.patch('/api/ticket', {
        id: ticket.id,
      });

      router.refresh();
      
    } catch(err) {
      console.log(err);
    }
  };

  function handleOpenModal() {
    handleModalVisible();
    setDetailTicket({
      customer: customer,
      ticket: ticket
    });
  }

  return (
    <>
      <tr className='border-b-2 border-b-slate-200 h-12 last:border-b-0 bg-slate-100 hover:bg-slate-200 duration-200'>

        <td className='text-left pl-1'>
          {customer?.name}
        </td>
        
        <td className='text-left hidden sm:table-cell'>
          {ticket.created_at?.toLocaleDateString('pt-br')}
        </td>
        
        <td className='text-left'>
          <span className='bg-green-500 rounded px-2 py-1'>{ticket.status}</span>
        </td>
        
        <td className='text-left'>
          <button className='mr-2' onClick={handleChangeStatus}>
            <FiCheckSquare size={24} color='#22C55E' className='hover:scale-105'/>
          </button>
          <button onClick={handleOpenModal}>
            <FiFile size={24} color=' #3B82F6' className='hover:scale-105'/>
          </button>
        </td>
      </tr>
    </>
  )
}
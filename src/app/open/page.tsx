'use client'
import { Input } from '@/components/Input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiSearch, FiX } from 'react-icons/fi';
import { z } from 'zod';
import { FormTicket } from './components';
import { api } from '@/lib/api';

const schema = z.object({
  email: z.string().email('Digite o e-mail do cliente para localizar').min(1, 'O campo e-mail é obrigatório'),
})

type FormData = z.infer<typeof schema>

export interface CustomerDataInfo {
  id: string,
  name: string,
}

export default function OpenTicket() {

  const [customer, setCustomer] = useState<CustomerDataInfo | null>(null);

  const { register, handleSubmit, setValue, setError, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  function handleClearCustomer() {
    setCustomer(null);
    setValue('email', '');
  }

  async function handleSearchCustomer(data: FormData) {

    const response = await api.get('/api/customer', {
      params: {
        email: data.email
      }
    })

    if(response.data === null) {
      setError('email', { type: 'custom', message: 'Ops, Cliente não foi encontrado!' });
      return;
    }

    setCustomer({
      id: response.data.id,
      name: response.data.name,
    })

  }

  return (
    <div className='w-full max-w-2xl mx-auto px-2'>
      <h1 className='font-bold text-3xl text-center mt-24'>Abrir Chamado</h1>

      <main className='flex flex-col mt-4 mb-2'>

        {customer ? (
          <div className='flex bg-slate-200 py-6 px-2 rounded-md border-2 items-center justify-around pl-3 pr-1'>
            <p className='text-lg'>
              <strong className='mr-1'>Cliente Selecionado:</strong>{customer.name}
            </p>
            <button onClick={handleClearCustomer} className='flexp-2 rounded hover:bg-gray-200'>
              <FiX size={24} color='#EF4444' />
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleSearchCustomer)}
            className='bg-slate-200 py-6 px-2 md:px-6 rounded-md border-2'
          >
            <div className='flex flex-col gap-3'>
              <Input
                name='email'
                placeholder='Digite seu email'
                type='text'
                error={errors.email?.message}
                register={register}
              />

              <button type='submit' className='flex flex-row items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md px-2 h-11 gap-3'>
                Procurar Cliente
                <FiSearch size={24} color='#FFF' />
              </button>
            </div>
          </form >
        )}

        {customer !== null && <FormTicket customer={customer} />}
      </main >
    </div >
  );
}
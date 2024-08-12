'use client'
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomerDataInfo } from '../page';

const schema = z.object({
  name: z.string().min(1, 'O nome do chamado é obrigatório'),
  description: z.string().min(1, 'Descreva um pouco sobre seu chamado')
})

type FormData = z.infer<typeof schema>;

interface FormTicketProps {
  customer: CustomerDataInfo
}

export function FormTicket({ customer }: FormTicketProps) {

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  async function handleRegisterTicket(data: FormData) {

    await api.post('/api/ticket', {
      name: data.name,
      description: data.description,
      customerId: customer.id
    });

    setValue('name', '');
    setValue('description', '');

  }

  return (
    <form onSubmit={handleSubmit(handleRegisterTicket)} className='flex flex-col bg-slate-200 mt-6 py-6 px-2 md:px-6 rounded-md border-2'>
      <label className='mb-1 font-medium text-lg'>Nome do Chamado</label>
      <Input
        name='name'
        placeholder='Digite o nome do chamado...'
        type='text'
        error={errors.name?.message}
        register={register}
      />

      <label className='mb-1 mt-4 font-medium text-lg'>Descreva o Problema</label>
      <textarea
        className='w-full border-2 rounded-md h-24 resize-none px-2'
        placeholder='Descreva seu problema aqui...'
        id='description'
        {...register('description')}
      />
      {errors.description?.message && <p className='text-red-500 my-1 mt-1 mb-4'>{ errors.description?.message }</p>}

      <button
        type='submit'
        className='w-full bg-blue-500 hover:bg-blue-600 text-white font-bold h-11 rounded-md mt-1'
      >
        Cadastrar
      </button>
    </form>
  );
}
'use client'
import { Input } from '@/components/Input';
import { api } from '@/lib/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, 'O campo de nome é obrigatório!'),
  email: z.string().email("Digite um e-mail válido").min(1, 'O campo de e-mail é obrigatório!'),
  phone: z.string().refine((value) => {
    return /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) || /^\d{2}\s\d{9}$/.test(value) || /^\d{11}$/.test(value);
  }, {
    message: 'O número de telefone deve seguir o padrão: DDD 999999999'
  }),
  address: z.string(),
});

type FormData = z.infer<typeof schema>

export function NewCustomerForm({ userId }: { userId: string }) {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const router = useRouter();

  async function handleRegisterCustomer(data: FormData) {
    await api.post('/api/customer', {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      userId: userId,
    })

    router.replace('/dashboard/customer');
    router.refresh();
  }

  return (
    <form className='flex flex-col' onSubmit={handleSubmit(handleRegisterCustomer)}>
      <label className='mb-1 text-lg font-medium'>
        Nome
      </label>
      <Input
        type='text'
        name='name'
        placeholder='Digite o nome completo'
        error={errors.name?.message}
        register={register}
      />

      <section className='flex flex-col sm:flex-row gap-2 my-2'>
        <div className='flex-1'>
          <label className='mb-1 text-lg font-medium'>
            Telefone
          </label>
          <Input
            type='text'
            name='phone'
            placeholder='Ex.: XX 000000000'
            error={errors.phone?.message}
            register={register}
          />
        </div>

        <div className='flex-1'>
          <label className='mb-1 text-lg font-medium'>
            Email
          </label>
          <Input
            type='email'
            name='email'
            placeholder='Digite um e-mail válido'
            error={errors.email?.message}
            register={register}
          />
        </div>
      </section>

      <label className='mb-1 text-lg font-medium'>
        Endereço
      </label>
      <Input
        type='text'
        name='address'
        placeholder='Digite seu endereço completo'
        error={errors.address?.message}
        register={register}
      />

      <button
        className='bg-blue-500 hover:bg-blue-600 text-white font-bold rounded my-4 px-2 h-10'
        type='submit'>
        Cadastrar
      </button>
    </form>
  );
}
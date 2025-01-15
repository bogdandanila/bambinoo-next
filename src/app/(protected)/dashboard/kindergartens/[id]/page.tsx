import { createKindergarten, getKindergarten, KindergartenData, updateKindergarten } from '@/app/api/kindergartens/actions';
import CancelButton from '@/components/ui/CancelButton';
import SubmitButton from '@/components/ui/SubmitButton';
import { notFound, redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function KindergartenPage({ params }: Props) {
  const { id } = await params;
  const isNew = id === 'new';
  const kindergarten = !isNew ? await getKindergarten(id) : null;

  if (!isNew && !kindergarten) {
    notFound();
  }

  const handleSubmit = async (formData: FormData) => {
    'use server';
    const data = Object.fromEntries(formData.entries()) as KindergartenData;
    
    if (isNew) {
      await createKindergarten(data);
    } else {
      await updateKindergarten(id, data);
    }

    redirect('/dashboard/kindergartens');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">
        {isNew ? 'Add Kindergarten' : 'Edit Kindergarten'}
      </h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Kindergarten Information</h2>
        <p className="text-gray-600 mb-6">
          Please provide the basic information about the kindergarten.
        </p>

        <form action={handleSubmit}>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                defaultValue={kindergarten?.name || ''}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                defaultValue={kindergarten?.address || ''}
                required
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  defaultValue={kindergarten?.city || ''}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  id="country"
                  defaultValue={kindergarten?.country || ''}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <CancelButton />
            <SubmitButton>Create</SubmitButton>
          </div>
        </form>
      </div>
    </div>
  );
} 
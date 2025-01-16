import { getUser } from '@/utils/getUser';
import Link from 'next/link';

export default async function HomePage() {
  const {user} = await getUser({ preventRedirect: true })

  return (
    <div className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-40">
        <div className="mx-auto max-w-2xl flex-auto">
          <h1 className="mt-10 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Manage your kindergarten with ease
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Bambinoo helps you manage your kindergarten efficiently. From student records to daily activities,
            we&apos;ve got everything covered in one simple platform.
          </p>
          <div className="mt-10 flex items-center gap-x-6">
            <Link
              href={user ? '/dashboard' : '/auth/login'}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {user ? 'Go to dashboard' : 'Get started'}
            </Link>
            <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 
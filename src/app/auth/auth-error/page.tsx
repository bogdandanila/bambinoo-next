import Link from 'next/link';

interface Props {
  searchParams: Promise<{ error?: string; error_description?: string }>;
}

export default async function AuthErrorPage({ searchParams }: Props) {
  const params = await searchParams;
  
  const error = params?.error 
    ? decodeURIComponent(params.error)
    : 'Unknown Error';
    
  const errorMessage = params?.error_description 
    ? decodeURIComponent(params.error_description).replace(/\+/g, ' ')
    : 'There was a problem authenticating your account.';

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Authentication Error
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="text-center">
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <div className="flex flex-col">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorMessage}</p>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-base text-gray-600">
              Please try signing in again. If the problem persists, contact support.
            </p>
            <div className="mt-6">
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
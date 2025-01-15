import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <span className="text-xl font-bold text-indigo-600">Bambinoo</span>
            </Link>
          </div>
          <div className="flex flex-1 justify-end">
            <Link
              href="/auth/login"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Sign in <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
} 
import { getUser } from '../../../utils/getUser';
import { Navigation } from '../../../components/ui/Navigation';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  if (!user) {
    return redirect('/auth/login');
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="lg:pl-72">
        {/* Mobile-only header */}
        <div className="lg:hidden sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:gap-x-6 sm:px-6">
          {/* Spacer for the hamburger menu */}
          <div className="h-6 w-6" />
        </div>
        <div className="px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
} 
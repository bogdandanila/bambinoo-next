'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';
import { useState, useEffect } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Settings', href: '/dashboard/settings' },
  { name: 'Kindergartens', href: '/dashboard/kindergartens' },
];

export function Navigation() {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when pathname changes (i.e., when navigating)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <div className="fixed top-0 left-0 z-40 flex h-16 items-center lg:hidden">
        <button
          type="button"
          className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 mx-4 sm:mx-6 lg:mx-8"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="absolute -inset-0.5" />
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={`relative z-50 lg:hidden ${
          sidebarOpen ? '' : 'pointer-events-none'
        }`}
      >
        <div
          className={`fixed inset-0 bg-gray-900/80 ${
            sidebarOpen ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-300`}
          onClick={() => setSidebarOpen(false)}
        />

        <div className="fixed inset-0 flex">
          <div
            className={`relative mr-16 flex w-full max-w-xs flex-1 transform ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } transition duration-300`}
          >
            <div
              className={`absolute top-0 right-0 -mr-12 pt-2 ${
                sidebarOpen ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            >
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>

            {/* Sidebar content */}
            <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
              <div className="flex h-16 shrink-0 items-center">
                <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
                  Bambinoo
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul role="list" className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const isActive =
                          pathname === item.href ||
                          (item.href !== '/dashboard' &&
                            pathname.startsWith(item.href));

                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={`${
                                isActive
                                  ? 'bg-indigo-700 text-white'
                                  : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                              } group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6`}
                            >
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  <li className="mt-auto">
                    <SignOutButton className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6" />
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              Bambinoo
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href));

                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={`${
                            isActive
                              ? 'bg-indigo-700 text-white'
                              : 'text-gray-700 hover:text-indigo-600 hover:bg-gray-50'
                          } group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="mt-auto">
                <SignOutButton className="w-full justify-start text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6" />
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
} 
export default function Loading() {
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="mt-2 h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <div className="h-9 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <div className="min-w-full divide-y divide-gray-300">
                <div className="bg-gray-50 px-6 py-3.5">
                  <div className="flex space-x-16">
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="bg-white">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="px-6 py-4 border-t border-gray-200">
                      <div className="flex items-center space-x-16">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
                          <div className="ml-4 h-5 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="h-5 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-5 w-20 bg-gray-200 rounded animate-pulse" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
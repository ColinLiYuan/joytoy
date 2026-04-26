import Link from 'next/link'

export default function Forbidden() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <h1 className="text-9xl font-black text-gray-200 leading-none">403</h1>
        <h2 className="text-2xl font-bold text-gray-900 mt-4">Access Denied</h2>
        <p className="text-gray-500 mt-3 max-w-md mx-auto">
          You do not have permission to access this page. Please contact support if you believe this is an error.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link 
            href="/"
            className="px-6 py-3 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors"
          >
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  )
}

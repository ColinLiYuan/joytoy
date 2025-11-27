// app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
            <h1 className="text-9xl font-bold text-gray-200">404</h1>
            <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-2 font-['Playfair_Display']">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                The page you are looking for might have been removed or is temporarily unavailable.
            </p>

            {/* ✅ 引导去分类页 */}
            <Link
                href="/collections"
                className="bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-all"
            >
                Browse Collections
            </Link>
        </div>
    );
}
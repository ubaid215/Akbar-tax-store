import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-vh-100 p-8 text-center" style={{ minHeight: '100vh' }}>
      <h1 className="text-4xl font-bold mb-4 text-[#0040A8]">404 - Page Not Found</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-[#0040A8] text-white rounded-md hover:bg-blue-800 transition-colors"
      >
        Return Home
      </Link>
    </div>
  );
}

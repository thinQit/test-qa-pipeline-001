import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="mt-2 text-sm text-secondary">The page you are looking for does not exist.</p>
      <div className="mt-6">
        <Link href="/" className="text-primary hover:underline">Return to dashboard</Link>
      </div>
    </div>
  );
}

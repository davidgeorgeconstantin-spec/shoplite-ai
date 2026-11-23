import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="py-32 text-center">
      <p className="text-7xl font-black">404</p>
      <Link href="/" className="mt-6 inline-block underline">Home</Link>
    </div>
  );
}

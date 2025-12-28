import Link from 'next/link'

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
            <div className="text-center">
                <h2 className="mb-4 text-4xl font-bold text-primary">404 - Not Found</h2>
                <p className="mb-8 text-gray-400">Could not find requested resource</p>
                <Link
                    href="/"
                    className="rounded-lg bg-primary px-6 py-3 font-semibold text-black transition-colors hover:bg-primary/80"
                >
                    Return Home
                </Link>
            </div>
        </div>
    )
}

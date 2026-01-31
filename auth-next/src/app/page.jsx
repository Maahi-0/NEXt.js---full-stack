
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <h1 className="text-4xl font-bold mb-4 text-white">Welcome to Auth Next</h1>
            <p className="text-xl mb-8 text-gray-300">Authentication System with Next.js</p>

            <div className="flex space-x-4">
                <Link
                    href="/login"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition"
                >
                    Login
                </Link>
                <Link
                    href="/signup"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition"
                >
                    Sign Up
                </Link>
            </div>
        </div>
    );
}

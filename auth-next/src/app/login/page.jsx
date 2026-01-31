"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function LoginPage() {
    const [user, setUser] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onLogin = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/login", user);
            console.log("Login success", response.data);
            router.push("/");
        } catch (error) {
            console.log("Login failed", error.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-900 flex items-center justify-center p-2">
            <div className="flex flex-col justify-center items-center bg-gray-800 bg-opacity-50 rounded-lg p-8 w-full max-w-md shadow-2xl">
                <h1 className="text-4xl font-bold text-white mb-6">{loading ? "Processing" : "Login"}</h1>
                <hr className="w-full border-blue-500 mb-6" />

                <label htmlFor="email" className="text-gray-300 font-semibold mb-2 w-full">email</label>
                <input className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" type="text" id="email" value={user.email} onChange={(e) => setUser({ ...user, email: e.target.value })} placeholder="email" />

                <label htmlFor="password" className="text-gray-300 font-semibold mb-2 w-full">password</label>
                <input className="w-full px-4 py-2 mb-6 bg-gray-700 text-white rounded-lg border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 placeholder-gray-400" type="password" id="password" value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} placeholder="password" />

                <button
                    onClick={onLogin}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold py-2 px-4 rounded-lg transition duration-200">
                    {loading ? "Processing..." : "Login"}
                </button>
                <Link href="/signup" className="mt-4 text-blue-400 hover:text-blue-300">Visit Signup page</Link>
            </div>
        </div>
    );
}

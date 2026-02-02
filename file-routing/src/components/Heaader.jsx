import Link from "next/link";
const Navbar = () => {
    return (
        <>
            <nav className=" absolute z-10 bg-blue-400 text-black px-6 py-4 shadow-lg w-full">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="text-2xl font-bold">Home</Link>
                        <div className="flex gap-6">
                            <Link href="/performance" className="hover:text-blue-800 cursor-pointer">Performance</Link>
                            <Link href="/reliability" className="hover:text-blue-800 cursor-pointer">Reliability</Link>
                        </div>
                    </div>
                    <div className="flex items-center bg-white px-4 py-2 rounded-lg">
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-white text-black outline-none placeholder-gray-400 w-64"
                        />
                        <svg className="w-5 h-5 text-gray-500 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </nav>
        </>
    );
}
export default Navbar;
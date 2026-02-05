import Link from "next/link";
const Navbar = () => {
    return (
        <>
            <nav className="m-0.5shadow-lg">
                <div className="flex justify-between items-center px-8 py-4 max-w-7xl mx-auto">
                    <div><Link href="/" className="text-black font-bold text-xl hover:text-gray-300 transition">home</Link></div>
                    <div className="flex gap-8">
                        <Link href="/form-filling" className="text-black hover:text-gray-600 transition">Form</Link>
                        <Link href="/about" className="text-black hover:text-gray-600 transition">About</Link>
                        <Link href="/contact-us" className="text-black hover:text-gray-600 transition">Contact</Link>
                    </div>
                </div>
            </nav>

        </>
    );
}
export default Navbar;
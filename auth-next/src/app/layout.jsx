
import "./globals.css";

export const metadata = {
    title: "Auth Next App",
    description: "Authentication with Next.js",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className="antialiased min-h-screen bg-black text-white">
                {children}
            </body>
        </html>
    );
}

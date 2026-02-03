import { prisma } from "@/lib/prisma";
import Link from "next/link";

const Home = async () => {
  const snippets = await prisma.snippet.findMany();

  return (
    <div className="h-full bg-blue-100 p-8 min-h-screen flex items-center justify-center transition-colors duration-500">
      <div className={`
        bg-slate-900 rounded-2xl shadow-2xl p-8 transition-all duration-700 ease-in-out
        ${snippets.length > 0 ? "w-full max-w-4xl" : "w-full max-w-md"}
      `}>
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-bold text-4xl text-white tracking-tight">Snippets</h1>
          <Link
            href="/snippet/new"
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 px-6 rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-blue-900/20"
          >
            New
          </Link>
        </div>

        <div className="grid gap-4">
          {snippets.map((snippet) => (
            <Link
              key={snippet.id}
              href={`/snippet/${snippet.id}`}
              className="flex items-center justify-between bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5 shadow-sm hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-300 group"
            >
              <h2 className="text-xl font-medium text-slate-200 group-hover:text-white transition-colors">{snippet.title}</h2>
              <div className="text-blue-400 font-medium group-hover:translate-x-1 transition-transform">View →</div>
            </Link>
          ))}
          {snippets.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="text-slate-500 mb-2 italic">No snippets found</div>
              <p className="text-slate-400 text-sm">Create your first snippet to get started!</p>
            </div>
          )}
        </div>
      </div>
    </div>

  );
}

export default Home;
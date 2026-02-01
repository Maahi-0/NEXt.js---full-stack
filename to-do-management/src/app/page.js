import TodoApp from "@/components/TodoApp";

export const metadata = {
  title: "Quest Log | Todo Management",
  description: "A premium, minimalist todo management application built with Next.js",
};

export default function Home() {
  return (
    <main>
      <TodoApp />
    </main>
  );
}

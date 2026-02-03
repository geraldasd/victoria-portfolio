import Header from "./components/Header";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
    </main>
  );
}

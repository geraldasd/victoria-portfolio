import Header from "./components/Header";
import { client } from "@/sanity/lib/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHeaderData() {
  const data = await client.fetch(`*[_type == "header"][0]`);
  return data;
}

export default async function Home() {
  const data = await getHeaderData();
  
  return (
    <main className="min-h-screen">
      <Header data={data} />
      {/* Placeholder content for scrolling */}
      <div className="h-[200vh]"></div>
    </main>
  );
}

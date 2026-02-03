import Header from "./components/Header";
import ProjectsTable from "./components/ProjectsTable";
import { client } from "@/sanity/lib/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHeaderData() {
  const data = await client.fetch(`*[_type == "header"][0]`);
  return data;
}

async function getProjects() {
  const data = await client.fetch(`*[_type == "project"] | order(order asc)`);
  return data;
}

export default async function Home() {
  const data = await getHeaderData();
  const projects = await getProjects();
  
  return (
    <main className="min-h-screen">
      <Header data={data} />
      <ProjectsTable projects={projects} />
      {/* Placeholder content for scrolling */}
      <div className="h-[200vh]"></div>
    </main>
  );
}

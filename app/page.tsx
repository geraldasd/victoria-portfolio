import Header from "./components/Header";
import ProjectsTable from "./components/ProjectsTable";
import Footer from "./components/Footer";
import { client } from "@/sanity/lib/client";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getHeaderData() {
  const data = await client.fetch(`*[_type == "header" && _id == "header"][0]`);
  return data;
}

async function getProjects() {
  const data = await client.fetch(`*[_type == "project"] | order(order asc) {
    ...,
    "featuredImageLqip": featuredImage.asset->metadata.lqip,
    "featuredImageDimensions": featuredImage.asset->metadata.dimensions
  }`);
  return data;
}

async function getFooterData() {
  const data = await client.fetch(`*[_type == "footer" && _id == "footer"][0]`);
  return data;
}

export default async function Home() {
  const data = await getHeaderData();
  const projects = await getProjects();
  const footerData = await getFooterData();
  
  return (
    <main className="min-h-screen home-content">
      <Header data={data} />
      <ProjectsTable projects={projects} />
      <Footer data={footerData} />
    </main>
  );
}

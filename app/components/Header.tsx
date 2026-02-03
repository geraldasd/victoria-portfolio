import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

async function getHeaderData() {
  const data = await client.fetch(`*[_type == "header"][0]`);
  console.log("Header data:", JSON.stringify(data, null, 2));
  return data;
}

const portableTextComponents = {
  marks: {
    link: ({ children, value }: any) => {
      const href = value?.href || "#";
      console.log("Link component:", { children, href, value });
      return (
        <a
          href={href}
          className="cursor-pointer hover:opacity-70"
        >
          {children}
        </a>
      );
    },
    underline: ({ children }: any) => {
      // Handle underlined text that should be styled as links
      return <span className="underline-text">{children}</span>;
    },
  },
};

export default async function Header() {
  const data = await getHeaderData();

  if (!data) {
    console.log("No header data found");
    return <div>No header data</div>;
  }

  return (
    <header className="w-full bg-white">
      <div className="header-text">
        <PortableText value={data.introText} components={portableTextComponents} />
      </div>
    </header>
  );
}
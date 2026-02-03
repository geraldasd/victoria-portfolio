import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";

async function getHeaderData() {
  const data = await client.fetch(`*[_type == "header"][0]`);
  return data;
}

export default async function Header() {
  const data = await getHeaderData();

  if (!data) return null;

  return (
    <header className="w-full">
      {/* DESIGN IMPLEMENTATION:
         pt-7           -> 1.75rem
         px-8           -> 2rem
         leading-[1.1]  -> Line height 1.1
         tracking-[.0075em] -> Letter spacing
         text-[1.45rem] -> Font size
         decoration-1   -> Thickness 1px
         underline-offset-[.15em] -> Offset
      */}
      <div className="
        font-monument 
        pt-7 
        px-8 
        leading-[1.1] 
        tracking-[.0075em] 
        text-[1.45rem] 
        text-black
        decoration-1 
        underline-offset-[.15em]
      ">
        <PortableText value={data.introText} />
      </div>
    </header>
  );
}
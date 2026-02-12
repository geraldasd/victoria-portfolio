'use client';

import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";

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
      return <span className="underline-text">{children}</span>;
    },
  },
};

function StickyHeader({ show }: { show: boolean }) {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div 
      className={`sticky-header fixed top-0 left-0 right-0 z-10 w-full header-content flex justify-between transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        fontSize: 'clamp(1.25rem, 0.9rem + 1.5vw, 2rem)',
      }}
    >
      <button
        onClick={handleScrollToTop}
        className="cursor-pointer hover:opacity-70 bg-transparent border-none p-0 font-inherit text-left"
        style={{ margin: 0 }}
      >
        Victoria Chen
      </button>
    </div>
  );
}

export default function Header({ data }: { data: any }) {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowSticky(true);
      } else {
        setShowSticky(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!data) {
    console.log("No header data found");
    return <div>No header data</div>;
  }

  return (
    <>
      <StickyHeader show={showSticky} />
      <header className="header-text header-content">
        <PortableText value={data.introText} components={portableTextComponents} />
      </header>
    </>
  );
}
'use client';

import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  return (
    <div 
      className={`sticky-header fixed top-0 left-0 right-0 z-10 w-full header-content flex justify-between transition-opacity duration-300 ${
        show ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
      style={{
        fontSize: 'clamp(1.25rem, 0.9rem + 1.5vw, 2rem)',
      }}
    >
      <Link href="/" className="cursor-pointer hover:opacity-70" style={{ margin: 0 }}>
        Victoria Chen
      </Link>
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
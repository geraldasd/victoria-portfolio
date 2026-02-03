'use client';

import { useEffect, useRef, useState } from 'react';

interface FooterData {
  logo?: string;
  company?: string;
  instagram?: string;
  linkedin?: string;
  telephone?: string;
  email?: string;
}

export default function Footer({ data }: { data: FooterData | null }) {
  const logoRef = useRef<HTMLDivElement>(null);
  const [fontSize, setFontSize] = useState('10vw');

  useEffect(() => {
    const calculateFontSize = () => {
      if (!logoRef.current || !data?.logo) return;
      
      const containerWidth = logoRef.current.parentElement?.clientWidth || window.innerWidth;
      const letterCount = data.logo.length;
      // Calculate font size to fit all letters with some spacing
      // Account for padding (approx 4rem = ~64px on each side)
      const availableWidth = containerWidth - 64;
      const targetSize = availableWidth / (letterCount * 0.65); // 0.65 accounts for letter width ratio
      setFontSize(`${targetSize}px`);
    };

    calculateFontSize();
    window.addEventListener('resize', calculateFontSize);
    return () => window.removeEventListener('resize', calculateFontSize);
  }, [data?.logo]);

  if (!data) return null;

  // Split logo into individual characters for spacing
  const logoLetters = data.logo ? data.logo.split('') : [];

  return (
    <footer className="footer">
      {/* Large Logo Text - Letters spread across full width */}
      {logoLetters.length > 0 && (
        <div className="footer-logo" ref={logoRef} style={{ fontSize }}>
          {logoLetters.map((letter, index) => (
            <span key={index}>{letter}</span>
          ))}
        </div>
      )}

      {/* Footer Info Row - spread across full width */}
      <div className="footer-info">
        {data.company && (
          <span className="footer-item">{data.company}</span>
        )}

        {data.instagram && (
          <a 
            href={data.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-item footer-link"
          >
            Instagram
          </a>
        )}

        {data.linkedin && (
          <a 
            href={data.linkedin} 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-item footer-link"
          >
            LinkedIn
          </a>
        )}

        {data.telephone && (
          <span className="footer-item">T {data.telephone}</span>
        )}

        {data.email && (
          <a 
            href={`mailto:${data.email}`}
            className="footer-item footer-link"
          >
            E <span className="underline-text">{data.email}</span>
          </a>
        )}
      </div>
    </footer>
  );
}

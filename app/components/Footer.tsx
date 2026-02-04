'use client';

interface FooterData {
  logo?: string;
  company?: string;
  instagram?: string;
  linkedin?: string;
  telephone?: string;
  email?: string;
}

export default function Footer({ data }: { data: FooterData | null }) {
  if (!data) return null;

  // Split logo into individual characters for spacing
  const logoLetters = data.logo ? data.logo.split('') : [];

  return (
    <footer className="footer">
      {/* Large Logo Text - Letters spread across full width */}
      {logoLetters.length > 0 && (
        <div className="footer-logo">
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

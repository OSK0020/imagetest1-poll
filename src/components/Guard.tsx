'use client';

import React, { useEffect, useState } from 'react';

const ALLOWED_HOSTS = ['iamge-lab-website.vercel.app', 'localhost', '127.0.0.1'];
const OFFICIAL_URL = 'https://iamge-lab-website.vercel.app/';

interface GuardProps {
  children: React.ReactNode;
}

export const Guard: React.FC<GuardProps> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const hostname = window.location.hostname;
    
    // Check if the current hostname is allowed
    const isDomainAllowed = ALLOWED_HOSTS.some(host => hostname.includes(host));
    
    // Check for a specifically defined environment key (passed via NEXT_PUBLIC)
    const hasLicenseKey = !!process.env.NEXT_PUBLIC_APP_LICENSE_KEY;

    if (!isDomainAllowed) {
      setIsAuthorized(false);
    } else {
      setIsAuthorized(true);
    }
  }, []);

  if (isAuthorized === null) return null; // Wait for check

  if (!isAuthorized) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0a0a0a',
        color: '#fff',
        fontFamily: 'system-ui, sans-serif',
        textAlign: 'center',
        padding: '20px'
      }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ff4444' }}>
          🔒 Unauthorized Copy / העתקה לא מורשית
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '600px', lineHeight: '1.6', color: '#ccc' }}>
          This source code is protected and belongs exclusively to <strong>OSK0020</strong>. 
          Running this project on unauthorized domains is prohibited.
        </p>
        <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#888' }}>
          הקוד הזה מוגן ושייך בלעדית ל-OSK0020. הרצת הפרויקט בדומיינים לא מורשים אסורה.
        </p>
        <a 
          href={OFFICIAL_URL}
          style={{
            marginTop: '2rem',
            padding: '12px 24px',
            background: '#6a3fcb',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '8px',
            fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          Visit Official Site / למעבר לאתר הרשמי
        </a>
      </div>
    );
  }

  return <>{children}</>;
};

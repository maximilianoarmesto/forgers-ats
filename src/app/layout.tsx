import type { ReactNode } from 'react';

export const metadata = {
  title: 'Forgers ATS',
  description: 'Applicant Tracking System built with Clean Architecture.',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif',
          margin: 0,
          background: '#0b1020',
          color: '#e6e9f0',
        }}
      >
        {children}
      </body>
    </html>
  );
}

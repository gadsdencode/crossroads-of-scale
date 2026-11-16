import './globals.css';
import type { Metadata } from 'metadata';

export const metadata: Metadata = {
  title: 'Crossroads of Scale | Governance & Systems Dynamics',
  description: 'Interactive matrix exploring scale and government type dynamics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#07090e] text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}

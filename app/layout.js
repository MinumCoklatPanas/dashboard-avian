import './globals.css';

export const metadata = {
  title: 'Dashboard Avian - Next.js',
  description: 'Converted HASIL_PRODUKSI and BACKORDER modules',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block"
          rel="stylesheet"
        />
      </head>
      <body className="bg-background text-on-surface font-body antialiased select-none custom-scrollbar">
        {children}
      </body>
    </html>
  );
}

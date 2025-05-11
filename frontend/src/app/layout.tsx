import './globals.css';

export const metadata = {
  title: 'PowerPoint to PDF convertor - SlideSpeak',
  description: 'Convert Powerpoint to PDF',
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;

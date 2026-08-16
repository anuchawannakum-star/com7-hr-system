import './globals.css';

export const metadata = {
  title: 'COM7 HR Document Workflow',
  description: 'ระบบบริหารเอกสาร HR - COM7 Group',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}

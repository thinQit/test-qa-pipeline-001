import './globals.css';
import { AuthProvider } from '@/providers/AuthProvider';
import { ToastProvider } from '@/providers/ToastProvider';
import Navigation from '@/components/layout/Navigation';

export const metadata = {
  title: 'Todo Dashboard',
  description: 'A simple Next.js 14 + Tailwind CSS todo list app.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <ToastProvider>
            <Navigation />
            <main className="min-h-screen bg-background">{children}</main>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

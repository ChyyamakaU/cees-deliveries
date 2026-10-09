import { Sora, DM_Sans } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/context/AuthContext';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: "Cee's Deliveries — Whatever you need. Wherever it needs to go.",
  description:
    'Food, groceries, packages and everyday essentials — all delivered through one simple platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col bg-vanilla font-sans">
        <AuthProvider>
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

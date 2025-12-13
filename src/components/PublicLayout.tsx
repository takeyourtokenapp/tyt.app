import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import CryptoCarousel from './CryptoCarousel';

interface PublicLayoutProps {
  children: ReactNode;
  showFooter?: boolean;
  showCarousel?: boolean;
}

export default function PublicLayout({ children, showFooter = true, showCarousel = true }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-owl-dark via-owl-navy to-black text-white flex flex-col">
      <Header />
      {showCarousel && <CryptoCarousel />}
      <main className="flex-1">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

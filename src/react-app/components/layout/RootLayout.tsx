import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import './RootLayout.css';

interface RootLayoutProps {
  children: ReactNode;
}

export const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <div className="root-layout">
      <Header />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
};

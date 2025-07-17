// src/app/layout.js
import { AuthProvider } from "./contexts/AuthContext";
import './styles/globals.css';

import Header from './components/Header';
import Footer from './components/Footer';

export const metadata = {
  title: 'moovine | WorkSpace',
  description: 'Sua página inicial personalizada',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}

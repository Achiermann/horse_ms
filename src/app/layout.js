import '../styles/main.css';
import ClientWrapper from './clientWrapper';
import Header from '../components/Header';
import AuthGate from '../components/AuthGate';

export const metadata = {
  title: 'Horse-MS - Horse Stable Management System',
  description: 'Manage horse events and participants',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientWrapper>
          <AuthGate>
            <Header />
            <main>{children}</main>
          </AuthGate>
        </ClientWrapper>
      </body>
    </html>
  );
}

import { Metadata } from 'next';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardGuard from '../../components/core/guards/DashboardGuard';
import { UserProvider } from '../../contexts/UserContext';

export const metadata: Metadata = {
  title: 'Kraken saas',
  description: 'Dashboard principal de Kraken SAS',
};

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <UserProvider>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </UserProvider>
    </DashboardGuard>
  );
}

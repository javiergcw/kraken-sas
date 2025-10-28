import { Metadata } from 'next';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import DashboardGuard from '../../components/core/guards/DashboardGuard';

export const metadata: Metadata = {
  title: 'Dashboard - OCEANOSCUBA',
  description: 'Dashboard principal de OCEANOSCUBA',
};

export default function RootDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DashboardGuard>
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </DashboardGuard>
  );
}

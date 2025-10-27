import { Metadata } from 'next';
import DashboardLayout from '../../components/dashboard/DashboardLayout';

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
    <DashboardLayout>
      {children}
    </DashboardLayout>
  );
}

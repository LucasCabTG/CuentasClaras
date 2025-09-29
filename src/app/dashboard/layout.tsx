import Sidebar from '@/core/components/Sidebar';
import Header from '@/core/components/Header';
import AuthGuard from '@/core/components/AuthGuard';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}

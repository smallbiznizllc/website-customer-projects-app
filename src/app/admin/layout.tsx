import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNav />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </ProtectedRoute>
  )
}




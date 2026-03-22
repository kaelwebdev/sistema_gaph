import { ReactNode } from 'react'

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-xl font-semibold text-gray-900">
            Sistema GAPH
          </h1>
        </div>
      </header>
      <main>{children}</main>
    </div>
  )
}
